"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AppPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>("");
  const [defaultSection, setDefaultSection] = useState<string>("settings");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedDefaultSection = localStorage.getItem("defaultSection");
    if (!storedUserId) {
      router.push("/login");
    } else {
      setUserId(storedUserId);
      if (storedDefaultSection) {
        setDefaultSection(storedDefaultSection);
      }
    }
  }, [router]);

  const updateDefaultSection = async (section: string) => {
    if (!userId) return;

    try {
      const res = await fetch("http://localhost:4000/auth/update-default-section", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: parseInt(userId), defaultSection: section }),
      });

      if (res.ok) {
        localStorage.setItem("defaultSection", section);
        setDefaultSection(section);
      }
    } catch (error) {
      console.error("Ошибка обновления раздела по умолчанию:", error);
    }
  };

  return (
    <div>
      <h1>Привет, пользователь #{userId}!</h1>
      <p>Текущий раздел по умолчанию: {defaultSection}</p>
      <div>
        <h3>Выберите раздел по умолчанию:</h3>
        <button onClick={() => updateDefaultSection("settings")}>Настройки</button>
        <button onClick={() => updateDefaultSection("profile")}>Профиль</button>
        <button onClick={() => updateDefaultSection("music")}>Музыка</button>
        <button onClick={() => updateDefaultSection("friends")}>Друзья</button>
        <button onClick={() => updateDefaultSection("chats")}>Чаты</button>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("userId");
          localStorage.removeItem("defaultSection");
          router.push("/");
        }}
      >
        Выйти
      </button>
    </div>
  );
}
