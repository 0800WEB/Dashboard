"use client"; // Esto indica que el componente es del lado del cliente

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (token) {
      // Si hay un token, redirige al dashboard
      router.push("/dashboard");
    } else {
      // Si no hay token, redirige a la página de inicio de sesión
      router.push("/signin");
    }
  }, [router]);

  return null; // No necesitas renderizar nada aquí, solo redirigir
};

export default HomePage;
