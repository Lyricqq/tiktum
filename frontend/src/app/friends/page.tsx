"use client";

import { useEffect, useState } from "react";

// Типы для данных
interface User {
  id: string;
  username: string;
}

interface FriendRequest {
  id: string;
  sender: User;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      fetch(`http://localhost:4000/friends/${userId}`)
        .then((res) => res.json())
        .then(setFriends);

      fetch(`http://localhost:4000/friends/pending/${userId}`)
        .then((res) => res.json())
        .then(setRequests);
    }
  }, []);

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:4000/users/search?query=${search}`);
    setSearchResults(await res.json());
  };

  const handleSendRequest = async (receiverId: string) => {
    const senderId = localStorage.getItem("userId");
    if (senderId) {
      await fetch("http://localhost:4000/friends/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId }),
      });
    }
  };

  const handleRequestAction = async (requestId: string, accept: boolean) => {
    await fetch(`http://localhost:4000/friends/handle-request/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accept }),
    });
  };

  return (
    <div>
      <h1>Друзья</h1>
      <input
        type="text"
        placeholder="Поиск по логину"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Поиск</button>
      <h2>Результаты поиска</h2>
      {searchResults.map((user) => (
        <div key={user.id}>
          <p>{user.username}</p>
          <button onClick={() => handleSendRequest(user.id)}>Добавить в друзья</button>
        </div>
      ))}
      <h2>Заявки в друзья</h2>
      {requests.map((request) => (
        <div key={request.id}>
          <p>{request.sender.username} хочет добавить вас в друзья</p>
          <button onClick={() => handleRequestAction(request.id, true)}>Принять</button>
          <button onClick={() => handleRequestAction(request.id, false)}>Отклонить</button>
        </div>
      ))}
      <h2>Ваши друзья</h2>
      {friends.map((friend) => (
        <div key={friend.id}>
          <p>{friend.username}</p>
        </div>
      ))}
    </div>
  );
}
