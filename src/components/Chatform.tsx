import { useRef } from "react";
import type { FormEvent } from "react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface ChatformProps {
  setchatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  generateBotResponse: (history: ChatMessage[]) => void;
  chatHistory: ChatMessage[];
}

const Chatform: React.FC<ChatformProps> = ({ setchatHistory, generateBotResponse, chatHistory }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Update chat history with user's message
    setchatHistory((history) => [...history, { role: "user", text: userMessage }]);

    setTimeout(() => {
      setchatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);

      // Generate bot response using updated history
      generateBotResponse([
        ...chatHistory,
        { role: "user", text: `Using the detail provided above, please address this query: ${userMessage}` },
      ]);
    }, 600);
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        required
        className="message-input"
      />
      <button type="submit" className="material-symbols-outlined">
        👆
      </button>
    </form>
  );
};

export default Chatform;
