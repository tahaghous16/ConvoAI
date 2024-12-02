import { useState, useEffect, useRef } from "react";
import ChatBotIcon from "./Components/ChatBotIcon";
import ChatForm from "./Components/ChatForm";
import ChatMessage from "./Components/ChatMessage";

let App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef(null); // Create a reference for the chat body

  let generateBotResponse = async (history) => {
    let updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "thinking..."),
        { role: "model", text },
      ]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      let response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      let data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong :(");
      let apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.log(error);
    }
  };

  // Scroll to the bottom of the chat body whenever new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]); // Trigger every time chat history updates

  return (
    <div className="container">
      <div className="chatbot-popup">
        {/* ChatBot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">ConvoAI</h2>
          </div>
        </div>

        {/* ChatBot Body */}
        <div className="chat-body" ref={chatBodyRef}>
          <div className="message bot-message">
            <ChatBotIcon />
            <p>
              Hey there👋🏻
              <br /> How can I help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chat Footer */}
        <div className="chat-footer">
          <ChatForm
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
            chatHistory={chatHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
