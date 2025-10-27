import { LazyMotion, domAnimation } from "@/lib/framer-motion";

import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export default async function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </SessionProvider>
  );
}
