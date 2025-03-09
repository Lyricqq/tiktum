"use client";

import { useState, useEffect } from "react";

// Интерфейс для описания данных трека
interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export default function MusicPage() {
  const [tracks, setTracks] = useState<Track[]>([]); // Список треков
  const [title, setTitle] = useState<string>(""); // Название трека
  const [artist, setArtist] = useState<string>(""); // Исполнитель трека
  const [file, setFile] = useState<File | null>(null); // Загружаемый файл
  const userId = localStorage.getItem("userId"); // Идентификатор пользователя

  // Получение списка треков пользователя
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:4000/music/${userId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Ошибка загрузки треков: ${res.status}`);
          }
          return res.json();
        })
        .then(setTracks)
        .catch((error) => console.error("Ошибка:", error));
    }
  }, [userId]);

  // Обработчик загрузки файла
  const handleFileUpload = async () => {
    if (userId && file) {
      try {
        const formData = new FormData();
        formData.append("ownerId", userId); // ID пользователя
        formData.append("title", title); // Название трека
        formData.append("artist", artist); // Исполнитель
        formData.append("file", file); // Файл

        // Отправка данных на сервер
        const response = await fetch("http://localhost:4000/music/upload-file", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Ошибка загрузки трека: ${response.status}`);
        }

        // Обновление списка треков после успешной загрузки
        const res = await fetch(`http://localhost:4000/music/${userId}`);
        if (!res.ok) {
          throw new Error(`Ошибка обновления списка треков: ${res.status}`);
        }
        setTracks(await res.json());
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
      }
    }
  };

  return (
    <div>
      <h1>Музыка</h1>
      <h2>Моя музыка</h2>
      {tracks.length === 0 ? (
        <p>Треки отсутствуют</p>
      ) : (
        tracks.map((track) => (
          <div key={track.id}>
            <p>
              {track.title} - {track.artist}
            </p>
            <audio controls>
              <source src={`http://localhost:4000${track.url}`} type="audio/mpeg" />
              Ваш браузер не поддерживает воспроизведение аудио.
            </audio>
          </div>
        ))
      )}
      <h2>Загрузить трек</h2>
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Исполнитель"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      />
      <button onClick={handleFileUpload}>Загрузить</button>
    </div>
  );
}
