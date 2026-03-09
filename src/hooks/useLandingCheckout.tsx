
// import { useMutation } from '@tanstack/react-query';
// import { useToast } from '@/hooks/use-toast';

// interface CheckoutParams {
//   resellerId: string;
//   planId: string;
//   name: string;
//   email: string;
//   phone?: string;
//   businessName?: string;
//   businessType?: string;
// }

// interface CheckoutResponse {
//   success: boolean;
//   leadId: string;
//   preferenceId: string;
//   initPoint: string;
//   sandboxInitPoint?: string;
//   totalAmount: number;
//   planName: string;
//   error?: string;
// }

// export function useLandingCheckout() {
//   const { toast } = useToast();

//   return useMutation({
//     mutationFn: async (params: CheckoutParams): Promise<CheckoutResponse> => {
//       console.log('Creating checkout with params:', params);
// console.log("Checkout params:", params);

// //       const response = await fetch(
// //   "https://ttoxupujpljbkkdgcgpv.supabase.co/functions/v1/mercadopago-landing-checkout",
// //   {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(params),
// //   }
// // );
// const response = await fetch(
//   `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mercadopago-landing-checkout`,
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
//     },
//     body: JSON.stringify(params),
//   }
// );

//       const result = await response.json();

//       if (!response.ok) {
//         console.error('Checkout error:', result.error);
//         throw new Error(result.error || "Erro ao criar checkout");
//       }

//       if (result.error) {
//         throw new Error(result.error);
//       }

//       return result as CheckoutResponse;
//     },
//     onSuccess: (data) => {
//       toast({
//         title: 'Checkout criado!',
//         description: `Redirecionando para pagamento do plano ${data.planName}...`,
//       });

//       if (data.initPoint) {
//         window.location.href = data.initPoint;
//       }
//     },
//     onError: (error: Error) => {
//       console.error('Checkout mutation error:', error);
//       toast({
//         title: 'Erro ao criar checkout',
//         description: error.message,
//         variant: 'destructive',
//       });
//     }
//   });
// }
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useLandingCheckout() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params) => {
      console.log("Checkout params:", params);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mercadopago-landing-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(params),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Checkout error:", result.error);
        throw new Error(result.error || "Erro ao criar checkout");
      }

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Checkout criado!",
        description: `Redirecionando para pagamento do plano ${data.planName}...`,
      });

      if (data.initPoint) {
        window.location.href = data.initPoint;
      }
    },
    onError: (error) => {
      console.error("Checkout mutation error:", error);
      toast({
        title: "Erro ao criar checkout",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
