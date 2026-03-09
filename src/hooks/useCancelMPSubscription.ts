// import { useMutation } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";

// type CancelSubscriptionParams = {
//   restaurantId: string;
//   resellerId: string;
// };

// export function useCancelMPSubscription() {
//   return useMutation({
//     mutationFn: async (params: CancelSubscriptionParams) => {
//       // Pega a sessão atual
//       const { data: { session }, error: sessionError } = await supabase.auth.getSession();

//       if (sessionError) {
//         throw new Error("Erro ao obter sessão: " + sessionError.message);
//       }
//       if (!session) {
//         throw new Error("Usuário não está logado.");
//       }

//       // Chama a função com o token JWT no cabeçalho
//       const { data, error } = await supabase.functions.invoke(
//         "mercadopago-cancel-subscription",
//         {
//           body: params,
//           headers: {
//             Authorization: `Bearer ${session.access_token}`,
//           },
//         }
//       );

//       if (error) throw error;
//       if (data?.error) throw new Error(data.error);

//       return data;
//     },
//   });
// }
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type CancelSubscriptionParams = {
  restaurantId: string;
  resellerId: string;
};

export function useCancelMPSubscription() {
  return useMutation({
    mutationFn: async (params: CancelSubscriptionParams) => {
      // Chama a função sem exigir sessão
      const { data, error } = await supabase.functions.invoke(
        "mercadopago-cancel-subscription",
        {
          body: params,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (error) {
        console.error("Erro Supabase:", error);
        throw new Error(error.message || "Erro ao cancelar assinatura");
      }

      if (data?.error) {
        console.error("Erro da função:", data.error);
        throw new Error(data.error);
      }

      return data;
    },
  });
}
