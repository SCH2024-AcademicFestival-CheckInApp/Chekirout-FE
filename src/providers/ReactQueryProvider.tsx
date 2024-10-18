"use client"

import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query'
import { useState } from 'react'

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary>
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
  )
}