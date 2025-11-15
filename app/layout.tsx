import './globals.css'

export const metadata = {
  title: 'Neuro Insight',
  description: 'Customer Behaviour Intelligence Engine',
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