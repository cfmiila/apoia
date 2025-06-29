"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginSecreto() {
  const router = useRouter();

  useEffect(() => {
    const adminUser = { tipo: "admin", nome: "Admin Teste" };
    localStorage.setItem("user", JSON.stringify(adminUser));
    router.push("/dashboard-adm");
  }, []);

  return <p>Logando como admin...</p>;
}
