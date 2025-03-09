"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    setError(""); // Сброс ошибок

    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Ошибка регистрации: Пользователь уже существует");
      }

      router.push("/login"); // Перенаправление на страницу авторизации
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <h1>Регистрация</h1>
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
      <button onClick={handleRegister}>Зарегистрироваться</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Уже есть аккаунт? <a href="/login">Авторизуйтесь</a>
      </p>
    </div>
  );
}
