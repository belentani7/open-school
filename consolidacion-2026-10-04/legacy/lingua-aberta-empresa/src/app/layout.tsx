import './globals.css'
export const metadata={title:'lingua-aberta | Empresa Belentani'};
export default function R({children}:{children:React.ReactNode}){return(<html lang='es'><body><header><span className='logo'>BELENTANI</span><nav><a href='/'>Inicio</a><a href='/precios'>Precios</a><a href='/panel'>Panel</a><a href='/contacto'>Contacto</a></nav></header><main>{children}</main><footer><a href='/legal/aviso'>Aviso</a> · <a href='/legal/privacidad'>Privacidad</a> · <a href='/legal/cookies'>Cookies</a></footer></body></html>);}
