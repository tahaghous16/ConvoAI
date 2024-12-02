import { useRef } from "react";

let ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  let inputRef = useRef();

  let handleForSubmit = (e) => {
    e.preventDefault();
    let userMessage = inputRef.current.value.trim();

    // Prevent submitting if message is empty
    if (!userMessage) return;

    // Clear the input field after submitting the message
    inputRef.current.value = "";

    // Ensure we're updating state correctly
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", text: userMessage },
    ]);

    setTimeout(
      () =>
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { role: "model", text: "thinking..." },
        ]),
      generateBotResponse([
        ...chatHistory,
        { role: "user", text: userMessage },
      ]),
      600
    );
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleForSubmit}>
      <input
        type="text"
        ref={inputRef}
        placeholder="Type Here..."
        className="message-input"
        required
      />
      <button className="material-symbols-outlined">send</button>
    </form>
  );
};

export default ChatForm;
