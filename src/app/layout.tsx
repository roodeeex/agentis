import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agentis | Where Autonomy Meets Chain',
  description: 'The definitive, on-chain registry for autonomous AI agents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-bg-primary text-text-primary">
          {children}
        </div>
      </body>
    </html>
  )
} 