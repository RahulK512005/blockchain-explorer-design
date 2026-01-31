import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { SidebarProvider } from '@/components/layout/sidebar-context'
import { MainContent } from '@/components/layout/main-content'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Quai Vision Spark - Blockchain Explorer',
  description: 'Modern blockchain explorer for the Quai network with real-time data visualization and analytics',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased min-h-screen bg-background">
        <SidebarProvider>
          <Header />
          <div className="flex">
            <Sidebar />
            <MainContent>
              {children}
            </MainContent>
          </div>
        </SidebarProvider>
        <Analytics />
      </body>
    </html>
  )
}
