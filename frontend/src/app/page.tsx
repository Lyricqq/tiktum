"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      router.push("/settings"); // Перенаправляем авторизованных пользователей
    }
  }, [router]);

  return (
    <div>
      <h1>Добро пожаловать на Tiktum!</h1>
      <a href="/login">
        <button>Войти</button>
      </a>
      <a href="/register">
        <button>Зарегистрироваться</button>
      </a>
    </div>
  );
}
