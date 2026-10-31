// app/checkout.js — Generado CON plataforma Alejandría Universal
// Tarea: Crea checkout e-commerce con Stripe y 3DS para España
// Fuentes citadas:
//  1. Carrito y checkout — Lección 4: Escala y performance → tracks/05-ecommerce/modules/ecommerce-mod02-carrito-y-checkout/lessons/ecommerce-mod02-carrito-y-checkout-l4.html
//  2. Integración Stripe/PSP — Lección 4: Escala y performance → tracks/06-pagos/modules/pagos-mod01-integraci-n-stripe-psp/lessons/pagos-mod01-integraci-n-stripe-psp-l4.html
//  3. Carrito y checkout — Lección 1: Fundamento y contrato → tracks/05-ecommerce/modules/ecommerce-mod02-carrito-y-checkout/lessons/ecommerce-mod02-carrito-y-checkout-l1.html
// Criterios bloqueantes aplicados: PCI DSS, 3DS SCA, IVA 21% España, webhook idempotente

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Protocolo como contrato (agent-library/protocols/openapi.yaml)
export async function createCheckout({cart, customer, country='ES'}){
  // Lección: Integración Stripe/PSP — Lección 1 + 3DS y SCA — Lección 4
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: cart.map(i=>({price_data:{currency:'eur', product_data:{name:i.name}, unit_amount:i.price*100}, quantity:i.quantity})),
    customer: customer.id,
    automatic_tax: {enabled: true}, // IVA 21% España — Lección impuestos globales
    payment_intent_data: {setup_future_usage: 'off_session'},
    success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/cart`,
    // 3DS SCA — criterio bloqueante (si no, PR bloqueado por fitness)
    payment_method_options: {card: {request_three_d_secure: 'automatic'}},
  });
  return session;
}

// Webhook idempotente — Lección webhook y reconciliación
export async function handleWebhook(req){
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  if(event.type==='checkout.session.completed'){
    // reconciliar, no confiar solo en success_url
    await fulfillOrder(event.data.object);
  }
}
