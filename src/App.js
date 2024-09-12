import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const webSocketRef = useRef(null);

  useEffect(() => {
    webSocketRef.current = new WebSocket('ws://localhost:8080/tutorial'); // Reemplaza con tu URL

    webSocketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    webSocketRef.current.onmessage = (event) => {
      setMessages([...messages, event.data]);
    };

    webSocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    webSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(messageInput);
      setMessageInput('');
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  };

  return (
    <div>
      {/* Mostrar mensajes */}
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}

      {/* Input para enviar mensajes */}
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
}

export default App;
