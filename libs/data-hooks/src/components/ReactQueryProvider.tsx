// libs/data-hooks/src/components/ReactQueryProvider.tsx

// libs/data-hooks/src/components/ReactQueryProvider.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// ❌ ELIMINAR ESTA IMPORT
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const ReactQueryProvider = ({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* ❌ ELIMINADO */}
    </QueryClientProvider>
  );
};