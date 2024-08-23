"use client";

import { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api';
import useChatWebSocket from './useChatWebSocket'

export default function Page({ params }) {
  const user = parseInt(params.user)


  const { messages, sendMessage } = useChatWebSocket(user);
  const [newMessage, setNewMessage] = useState("")
  const [receiverUsername, setReceiverUsername] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessage(newMessage)
      setNewMessage("");
    }
  }

  useEffect(() => {
    apiGet(`user/${user}`)
    .then(data => setReceiverUsername(data.username))
  }, [])


  return (
    <div>
    {
      messages.map((message, idx) => {
        console.log(message)
        console.log(user)

        return (
          <div key={idx} className={`${message.sender_id === user ? 'bg-gray-300' : '' }`}>
            <h2>{message.sender_id === user ? receiverUsername : "Você"}</h2>
            <p>{message.message}</p>
          </div>

          )
      })
    }

    <input onChange={e => setNewMessage(e.target.value)} />
    <button onClick={handleSendMessage}>Enviar mensagem</button>
    </div>
  )
}
