import { initialDutyStations } from "@src/lib/constant";
import "@src/styles/globals.css";
import { TeacherRosterProvider } from "@src/utils/context";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TeacherRosterProvider initialDutyStations={initialDutyStations}>
        <Component {...pageProps} />
      </TeacherRosterProvider>
    </QueryClientProvider>
  );
}
