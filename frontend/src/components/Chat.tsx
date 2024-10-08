"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import BASE_URL from "@/Helper";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNamePopup, setShowNamePopup] = useState(true);
  const messagesEndRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const stompClientRef = useRef(null);

  const setupWebSocket = useCallback(() => {
    if (stompClientRef.current) return;

    console.log("Setting up WebSocket connection...");
    const socket = new SockJS(BASE_URL);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("Connected to WebSocket");
      client.subscribe("/topic/messages", (message) => {
        console.log("Received message from server:", message.body);
        if (message.body) {
          setMessages((prev) => [...prev, JSON.parse(message.body)]);
        }
      });
    });

    stompClientRef.current = client;
  }, []);

  useEffect(() => {
    setupWebSocket();

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        console.log("Disconnecting from WebSocket...");
        stompClientRef.current.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
  }, [setupWebSocket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      console.log("Scrolled to the latest message");
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (stompClientRef.current && newMessage.trim() && username.trim() && !isSending) {
      console.log("Preparing to send message:", newMessage);
      setIsSending(true);

      const message = { sender: username, content: newMessage };

      stompClientRef.current.send("/app/sendMessage", {}, JSON.stringify(message));
      console.log("Sent message to server:", message);

      setNewMessage("");
      setIsSending(false);
    } else {
      console.log("Message not sent: Either no username, no message, or already sending");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("Enter key pressed. Sending message...");
      handleSendMessage();
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    console.log("Toggled dark mode. Current mode:", isDarkMode ? "Light" : "Dark");
  };

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (username.trim()) {
      console.log("Username set:", username);
      setShowNamePopup(false);
    } else {
      console.log("Username not set: Input is empty");
    }
  };

  if (showNamePopup) {
    return (
      <div
        className={`fixed inset-0 bg-opacity-50 ${isDarkMode ? "bg-gray-900" : "bg-gray-200"
          } flex items-center justify-center`}
      >
        <form
          onSubmit={handleSetUsername}
          className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } p-8 rounded-lg shadow-lg`}
        >
          <h2 className="text-2xl font-bold mb-4">Welcome to the Chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 rounded outline-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Join Chat
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-2xl h-[600px] flex flex-col ${isDarkMode
        ? "dark bg-gray-800 text-white"
        : "bg-[#eee] text-gray-800"
        } shadow-lg rounded-lg overflow-hidden`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold">Chat Room</h2>
        <div className="flex items-center">
          <span className="mr-4">Hi, {username}!</span>
          <button onClick={toggleDarkMode} className="p-2 rounded-full">
            <i className={`ri-${isDarkMode ? "sun" : "moon"}-line text-xl`}></i>
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === username ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${msg.sender === username
                ? "bg-blue-500 text-white"
                : "bg-red-400 dark:bg-gray-300"
                }`}
            >
              <p className="font-semibold">{msg.sender}</p>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-grow p-2 rounded border outline-none border-gray-300 dark:border-gray-600 ${isDarkMode ? "bg-gray-700" : "text-black"
            }`}
        />
        <button
          onClick={handleSendMessage}
          disabled={isSending}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <i className="ri-send-plane-fill mr-2"></i>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
