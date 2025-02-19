"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ログインページにリダイレクト
    router.push('/login');
  }, [router]);
}