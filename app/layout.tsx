import './globals.css'

export const metadata = {
  title: 'ChatGPT Clone',
  description: 'A simple ChatGPT-like interface',
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