"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthSession from "@/components/hooks/useAuthSession";
import LoadingIndicator from "@/components/loadingIndicator";

export default function Home() {
  useAuthSession();
  const router = useRouter();

  useEffect(() => {
    router.push("/users");
  }, [router]);

  return (
    <>
      <LoadingIndicator />
    </>
  );
}
