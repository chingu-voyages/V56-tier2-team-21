import { useRef } from "react";
import type { FormEvent } from "react";
import { SendHorizonal } from 'lucide-react';

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
 
    <form onSubmit={handleFormSubmit} className="flex items-center gap-2 w-full">
  <input
    ref={inputRef}
    type="text"
    placeholder="Message..."
    required
    className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none   text-sm"
  />
  <button
    type="submit"
    className="bg-violet-900 hover:bg-violet-700 text-white p-2 rounded-full transition duration-300"
    aria-label="Send message"
  >
    <SendHorizonal className="w-5 h-5" />
  </button>
</form>
  );
};

export default Chatform;
