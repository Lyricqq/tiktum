"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Ошибка авторизации: Неправильный логин или пароль");
      }

      const data = await res.json();
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("defaultSection", data.defaultSection);
      router.push(`/${data.defaultSection}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <h1>Авторизация</h1>
      <input
        type="text"
        placeholder="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Войти</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
      </p>
    </div>
  );
}

