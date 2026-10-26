import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'open-school — Instituto educativo digital universal',
  description: 'Cursos modulares, certificaciones verificables, accesibilidad WCAG, offline-first',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}