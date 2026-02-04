import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Reseller,
  Restaurant,
  RestaurantAdmin,
  SubscriptionPayment,
} from '@/types/reseller';
import { useAuth } from './useAuth';

/* ============================================================
   REVENDEDOR
============================================================ */

export function useIsReseller() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['is-reseller', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('resellers')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id,
  });
}

export function useCurrentReseller() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['current-reseller', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('resellers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Reseller | null;
    },
    enabled: !!user?.id,
  });
}

/* ============================================================
   RESTAURANTES DO REVENDEDOR
============================================================ */

export function useResellerRestaurants() {
  const { data: reseller } = useCurrentReseller();
  
  return useQuery({
    queryKey: ['reseller-restaurants', reseller?.id],
    queryFn: async () => {
      if (!reseller?.id) return [];
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('reseller_id', reseller.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Restaurant[];
    },
    enabled: !!reseller?.id,
  });
}

export function useRestaurantDetails(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ['restaurant-details', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .maybeSingle();

      if (error) throw error;
      return data as Restaurant | null;
    },
    enabled: !!restaurantId,
  });
}

export function useRestaurantAdmins(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ['restaurant-admins', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('restaurant_admins')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as RestaurantAdmin[];
    },
    enabled: !!restaurantId,
  });
}

export function useRestaurantPayments(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ['restaurant-payments', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('subscription_payments')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('due_date', { ascending: false });

      if (error) throw error;
      return data as SubscriptionPayment[];
    },
    enabled: !!restaurantId,
  });
}

export function useResellerPayments() {
  const { data: restaurants } = useResellerRestaurants();
  
  return useQuery({
    queryKey: ['reseller-payments', restaurants?.map(r => r.id)],
    queryFn: async () => {
      if (!restaurants?.length) return [];
      
      const restaurantIds = restaurants.map(r => r.id);
      
      const { data, error } = await supabase
        .from('subscription_payments')
        .select('*, restaurants(*)')
        .in('restaurant_id', restaurantIds)
        .order('due_date', { ascending: false });

      if (error) throw error;
      return data as (SubscriptionPayment & { restaurants: Restaurant })[];
    },
    enabled: !!restaurants?.length,
  });
}

/* ============================================================
   🔥 CRIAÇÃO DE RESTAURANTE (COM TRIAL AUTOMÁTICO)
============================================================ */

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  const { data: reseller } = useCurrentReseller();
  
  return useMutation({
    mutationFn: async (
      restaurant: Omit<Restaurant, 'id' | 'created_at' | 'updated_at' | 'reseller_id'>
    ) => {
      if (!reseller?.id) throw new Error('Reseller not found');

      const trialDays = Number(restaurant.trial_days) || 0;

      const startDate = new Date();
      const endDate =
        trialDays > 0
          ? new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000)
          : null;

      const { data, error } = await supabase
        .from('restaurants')
        .insert({
          ...restaurant,
          reseller_id: reseller.id,
          subscription_status: trialDays > 0 ? 'trial' : 'active',
          subscription_start_date: startDate.toISOString(),
          subscription_end_date: endDate ? endDate.toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('store_config').insert({
        restaurant_id: data.id,
        name: restaurant.name,
        primary_color: (reseller as any)?.primary_color || null,
        secondary_color: (reseller as any)?.secondary_color || null,
      });

      return data as Restaurant;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller-restaurants'] });
    },
  });
}

/* ============================================================
   OUTRAS MUTATIONS
============================================================ */

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...update }: Partial<Restaurant> & { id: string }) => {
      const { data, error } = await supabase
        .from('restaurants')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Restaurant;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reseller-restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-details', data.id] });
    },
  });
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller-restaurants'] });
    },
  });
}

export function useCreateRestaurantAdmin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (admin: Omit<RestaurantAdmin, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('restaurant_admins')
        .insert(admin)
        .select()
        .single();

      if (error) throw error;
      return data as RestaurantAdmin;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-admins', data.restaurant_id] });
    },
  });
}

export function useDeleteRestaurantAdmin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, restaurantId }: { id: string; restaurantId: string }) => {
      const { error } = await supabase
        .from('restaurant_admins')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return restaurantId;
    },
    onSuccess: (restaurantId) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-admins', restaurantId] });
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payment: Omit<SubscriptionPayment, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('subscription_payments')
        .insert(payment)
        .select()
        .single();

      if (error) throw error;
      return data as SubscriptionPayment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-payments', data.restaurant_id] });
      queryClient.invalidateQueries({ queryKey: ['reseller-payments'] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...update }: Partial<SubscriptionPayment> & { id: string }) => {
      const { data, error } = await supabase
        .from('subscription_payments')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as SubscriptionPayment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-payments', data.restaurant_id] });
      queryClient.invalidateQueries({ queryKey: ['reseller-payments'] });
    },
  });
}

/* ============================================================
   ESTATÍSTICAS DO REVENDEDOR
============================================================ */

export function useResellerStats() {
  const { data: restaurants } = useResellerRestaurants();
  const { data: payments } = useResellerPayments();
  
  const totalRestaurants = restaurants?.length || 0;
  const activeRestaurants = restaurants?.filter(r => r.subscription_status === 'active').length || 0;
  const trialRestaurants = restaurants?.filter(r => r.subscription_status === 'trial').length || 0;
  const suspendedRestaurants = restaurants?.filter(r => r.subscription_status === 'suspended').length || 0;
  
  const monthlyRevenue =
    restaurants?.filter(r => r.subscription_status === 'active')
      .reduce((sum, r) => sum + r.monthly_fee, 0) || 0;
  
  const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;
  const overduePayments = payments?.filter(p => p.status === 'overdue').length || 0;
  
  const mpActiveSubscriptions = restaurants?.filter(r => r.mp_subscription_status === 'authorized').length || 0;
  const mpPendingSubscriptions = restaurants?.filter(r => r.mp_subscription_status === 'pending').length || 0;
  const mpPausedSubscriptions = restaurants?.filter(r => r.mp_subscription_status === 'paused').length || 0;
  
  const currentMonth = new Date();
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  
  const mpPaidThisMonth =
    payments
      ?.filter(
        p =>
          p.status === 'paid' &&
          p.payment_date &&
          new Date(p.payment_date) >= monthStart &&
          p.mp_payment_id
      )
      .reduce((sum, p) => sum + p.amount, 0) || 0;
  
  return {
    totalRestaurants,
    activeRestaurants,
    trialRestaurants,
    suspendedRestaurants,
    monthlyRevenue,
    pendingPayments,
    overduePayments,
    mpActiveSubscriptions,
    mpPendingSubscriptions,
    mpPausedSubscriptions,
    mpPaidThisMonth,
  };
}