"use client";

import { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api';
import { IoMdSend } from 'react-icons/io';
import useChatWebSocket from './useChatWebSocket';
import Input from '@/components/Input';

interface PageProps {
  params: {
    user: string;
  };
}

interface Message {
  sender_id: number;
  message: string;
}

export default function Page({ params }: PageProps) {
  const user = parseInt(params.user);

  const { messages, sendMessage } = useChatWebSocket(user);
  const [newMessage, setNewMessage] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessage(newMessage);
      setNewMessage("");
    }
  }

  useEffect(() => {
    apiGet(`user/${user}`)
      .then(data => setReceiverUsername(data.username));
  }, [user]);

  return (
    <div className="w-full">
      <div className="h-[90%]">
        {
          messages.map((message: Message, idx: number) => {
            console.log(message);
            console.log(user);

            return (
              <div key={idx} className={`${message.sender_id === user ? 'bg-white-10' : 'bg-primary ml-auto'} p-4 rounded-md mt-2 w-fit`}>
                <h2 className={`font-bold ${message.sender_id === user ? 'text-[#8dba6a]' : ''}`}>{message.sender_id === user ? receiverUsername : "Você"}</h2>
                <p>{message.message}</p>
              </div>
            );
          })
        }
      </div>

      <div className="w-[70%] m-auto flex flex-row">
        <Input className="!rounded-3xl p-2 w-full" placeholder="Mensagem" onChange={e => setNewMessage(e.target.value)} />
        <button className="text-primary flex items-center justify-center p-2" onClick={handleSendMessage}>
          <IoMdSend className="h-10 w-10" />
        </button>
      </div>
    </div>
  )
}