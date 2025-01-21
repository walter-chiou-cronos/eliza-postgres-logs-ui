'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from '@/app/queryClient'
import type * as React from 'react'
import { Provider as ChakraProvider } from "@/components/ui/provider"


export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  )
}
