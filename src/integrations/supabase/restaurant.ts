import { supabase } from "@/integrations/supabase/client";

export async function getRestaurantIdForCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { data, error } = await supabase
    .from("restaurant_admins")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .maybeSingle(); // <-- aceita 0 ou 1 linha

  if (error) {
    console.error("Erro ao buscar restaurante:", error);
    throw new Error("Erro ao buscar restaurante do usuário");
  }

  if (!data) {
    // Usuário não é admin
    return null;
  }

  return data.restaurant_id;
}