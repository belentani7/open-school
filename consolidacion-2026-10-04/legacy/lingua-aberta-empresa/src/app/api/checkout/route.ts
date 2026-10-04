import {NextResponse} from 'next/server';
export async function POST(req:Request){
 const f=await req.formData();
 const plan=String(f.get('plan')||'Pro');
 const key=process.env.STRIPE_SECRET_KEY;
 if(!key){return NextResponse.json({ok:false,plan,
  msg:'Configura STRIPE_SECRET_KEY para cobrar de verdad.'});}
 const Stripe=(await import('stripe')).default;
 const s=new Stripe(key);
 const ses=await s.checkout.sessions.create({mode:'payment',
  line_items:[{price_data:{currency:'eur',
  product_data:{name:'Plan '+plan},unit_amount:2900},quantity:1}],
  success_url:process.env.NEXT_PUBLIC_URL+'/panel',
  cancel_url:process.env.NEXT_PUBLIC_URL+'/precios'});
 return NextResponse.redirect(ses.url as string);}
