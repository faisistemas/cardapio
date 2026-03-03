import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  console.log("Rodando cron job: marcar pagamentos overdue");

  const { error } = await supabaseClient
    .from("subscription_payments")
    .update({ status: "overdue" })
    .eq("status", "pending")
    .lt("due_date", new Date().toISOString());

  if (error) {
    console.error("Erro ao atualizar pagamentos overdue:", error);
    return new Response("Erro ao atualizar", { status: 500 });
  }

  return new Response("Pagamentos overdue atualizados com sucesso", { status: 200 });
});
