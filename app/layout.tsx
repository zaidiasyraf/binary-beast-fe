import './globals.css'

export const metadata = {
  title: 'BB Neuro Clone',
  description: 'A simple chat AI interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}