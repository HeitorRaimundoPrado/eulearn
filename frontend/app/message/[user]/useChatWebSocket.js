import { useEffect, useState } from 'react';

const useChatWebSocket = (userId) => {
  const [socket, setSocket] =   useState(null);
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const chatSocket = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_WS_URI}/ws/chat/${userId}/?token=${localStorage.getItem("access_token")}`)

    chatSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data)
      setMessages(prevMessages => [...prevMessages, data])
    }

    chatSocket.onclose = (e) => {
      console.error('Chat socket closed unexpectedly');
    }

    setSocket(chatSocket);

    return () => {
      chatSocket.close()
    }
  }, [userId])

  const sendMessage = (messageContent) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message: messageContent }))
    }
  }

  return { messages, sendMessage } 
}

export default useChatWebSocket;
