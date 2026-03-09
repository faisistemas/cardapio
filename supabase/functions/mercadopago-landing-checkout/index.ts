// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CheckoutRequest {
  resellerId: string;
  planId: string;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body: CheckoutRequest = await req.json();
    const { resellerId, planId, name, email, phone, businessName, businessType } = body;

    console.log("Params recebidos:", { resellerId, planId });

    if (!resellerId || !planId || !name || !email) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: resellerId, planId, name, email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: reseller, error: resellerError } = await supabaseClient
      .from("resellers")
      .select("id, mp_access_token, mp_integration_enabled, company_name, name")
      .eq("id", resellerId)
      .single();

    console.log("Resultado reseller:", { reseller, resellerError });

    if (resellerError || !reseller) {
      return new Response(JSON.stringify({ error: "Revendedor não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!reseller.mp_integration_enabled || !reseller.mp_access_token) {
      return new Response(
        JSON.stringify({ error: "Mercado Pago não configurado para este revendedor" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Buscar plano com logs
    const { data: plan, error: planError } = await supabaseClient
      .from("subscription_plans")
      .select("id, name, monthly_fee, setup_fee, description, reseller_id, is_active")
      .eq("id", planId)
      .eq("reseller_id", resellerId)
      // .eq("is_active", true) // comentado temporariamente para testar
      .single();

    console.log("Resultado da query de plano:", { plan, planError });

    if (planError || !plan) {
      return new Response(JSON.stringify({ error: "Plano não encontrado ou inativo" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: newLead, error: insertError } = await supabaseClient
      .from("landing_page_leads")
      .insert({
        reseller_id: resellerId,
        plan_id: planId,
        name,
        email,
        phone,
        business_name: businessName,
        business_type: businessType,
        status: "pending",
      })
      .select("id")
      .single();

    console.log("Resultado lead:", { newLead, insertError });

    if (insertError || !newLead) {
      return new Response(JSON.stringify({ error: "Erro ao criar lead" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const leadId = newLead.id;
    const totalAmount = (plan.setup_fee || 0) + (plan.monthly_fee || 0);

    if (totalAmount <= 0) {
      return new Response(JSON.stringify({ error: "Valor do plano inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const preferenceData = {
      items: [
        {
          id: plan.id,
          title: `Assinatura ${plan.name}`,
          description: plan.description || `Plano ${plan.name}`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: totalAmount,
        },
      ],
      payer: { name, email },
      external_reference: `lead_${leadId}`,
      back_urls: {
        success: `${Deno.env.get("SUPABASE_URL")}/?payment=success&lead=${leadId}`,
        failure: `${Deno.env.get("SUPABASE_URL")}/?payment=failure&lead=${leadId}`,
        pending: `${Deno.env.get("SUPABASE_URL")}/?payment=pending&lead=${leadId}`,
      },
      auto_return: "approved",
    };

    console.log("Criando preferência Mercado Pago:", preferenceData);

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${reseller.mp_access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferenceData),
    });

    const mpResult = await mpResponse.json();
    console.log("Resposta Mercado Pago:", mpResult);

    if (!mpResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Erro ao criar pagamento no Mercado Pago", details: mpResult }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        leadId,
        preferenceId: mpResult.id,
        initPoint: mpResult.init_point,
        sandboxInitPoint: mpResult.sandbox_init_point,
        totalAmount,
        planName: plan.name,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.log("Erro inesperado:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
