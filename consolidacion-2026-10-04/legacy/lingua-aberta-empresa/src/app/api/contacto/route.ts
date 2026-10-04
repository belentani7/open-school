import {NextResponse} from 'next/server';
export async function POST(req:Request){
 const f=await req.formData();
 console.log('CONTACTO:',f.get('nombre'),f.get('email'));
 return NextResponse.json({ok:true});}
