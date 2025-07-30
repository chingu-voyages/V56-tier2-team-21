
import './App.css'; // You can remove this if unused
import ChatbotIcon from '@/components/ChatbotIcon';
import Chatform from '@/components/Chatform';
import ChatMessage from '@/components/ChatMessage';
import { useRef, useState, useEffect } from 'react';
import { hospitalInfo } from '@/components/hosptalInfo'; // Adjust the import path as needed

import { MessageCircle, X } from 'lucide-react'; // better icons

type ChatMessageType = {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  hideInChat?: boolean;
};

function App() {
  const [chatHistory, setchatHistory] = useState<ChatMessageType[]>([
    {
      role: 'model',
      text: hospitalInfo,
      hideInChat: true,
    },
  ]);

  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const [showChatbot, setshowChatbot] = useState<boolean>(false);

  const generateBotResponse = async (history: ChatMessageType[]) => {
    const updateHistory = (text: string, isError: boolean = false) => {
      setchatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== 'Thinking...'),
        { role: 'model', text, isError },
      ]);
    };

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || 'Something went wrong');
      }

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .trim();

      updateHistory(apiResponseText);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        updateHistory('Sorry, something went wrong.', true);
      }
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Chatbot Button */}
      <button
        onClick={() => setshowChatbot((prev) => !prev)}
        className="bg-white hover:bg-white text-white rounded-full p-3 shadow-lg transition duration-300"
      >
        {showChatbot ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chatbot Popup */}
      {showChatbot && (
        <div className="mt-3 w-[350px] max-h-[60vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-white text-white flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-2">
              <ChatbotIcon />
            </div>
            <button onClick={() => setshowChatbot(false)} className="text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div
            ref={chatBodyRef}
            className="flex-1 bg-gray-100 p-3 overflow-y-auto space-y-2"
          >
            <div className="flex gap-2 items-start">
              <ChatbotIcon />
              <p className="bg-white rounded-lg px-4 py-2 shadow text-sm">
                Hey there 👋<br />
                How can I help you today?
              </p>
            </div>

            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          {/* Footer */}
          <div className="bg-white border-t p-2">
            <Chatform
              chatHistory={chatHistory}
              setchatHistory={setchatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
