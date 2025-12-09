'use client';

import {
  QueryClient,
  QueryClientProvider,
  QueryOptions,
} from '@tanstack/react-query';
import * as React from 'react';
import { Toaster } from 'react-hot-toast';

import api from '@/lib/api';
import { ThemeProvider } from '@/components/theme-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
  const { data } = await api.get(`${queryKey?.[0]}`);
  return data;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <Toaster position='top-center' />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
