

import ChatbotIcon from '@/components/ChatbotIcon';
import Chatform from '@/components/Chatform';
import ChatMessage from '@/components/ChatMessage';
import { useRef, useState, useEffect } from 'react';
import { hospitalInfo } from '@/components/hosptalInfo';

type ChatMessageType = {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  hideInChat?: boolean;
};

function Chatbot() {
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
        throw new Error(data.error.message || 'something went wrong');
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
    <div className="fixed bottom-4 right-9 z-50">
      {/* Toggle Button - show only when chatbot is closed */}
      {!showChatbot && (
        <button
          onClick={() => setshowChatbot(true)}
          className="bg-white hover:bg-violet-400 rounded-full p-3 shadow-md"
        >
          <img src="bot.png" alt="Chatbot" className="w-8 h-8" />
        </button>
      )}

      {/* Chatbot Window */}
      {showChatbot && (
        <div className="mt-4 bg-white shadow-lg rounded-xl flex flex-col w-[330px] h-[60vh] max-h-[90vh] animate-fade-in">
          {/* Header */}
          <div className="bg-violet-900 text-white flex items-center justify-between px-2 py-1 rounded-t-xl">
            <div className="flex items-center gap-2">
              <ChatbotIcon />
            </div>
            <button
              onClick={() => setshowChatbot(false)}
              className="text-white text-4xl"
            >
              ×
            </button>
          </div>

          {/* Chat Body */}
          <div
            ref={chatBodyRef}
            className="flex-1 overflow-y-auto px-4 py-2 bg-gray-100 space-y-2 scroll-smooth"
          >
            <div className="flex items-start gap-2">
              <ChatbotIcon />
              <p className="bg-white p-3 rounded-lg shadow text-sm text-gray-800">
                Hey there 👋<br />
                How can I help you today?
              </p>
            </div>

            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-3 bg-white">
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

export default Chatbot;
