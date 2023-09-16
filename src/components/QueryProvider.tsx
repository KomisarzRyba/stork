"use client";

import { FC, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const QueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
