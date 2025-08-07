import type { FC } from "react";

interface ChatMessageType {
  role: "user" | "model";
  text: string;
  isError?: boolean;
  hideInChat?: boolean;
}

interface ChatMessageProps {
  chat: ChatMessageType;
}

const ChatMessage: FC<ChatMessageProps> = ({ chat }) => {
  if (chat.hideInChat) return null;

  return (
    
    <div
  className={`flex items-start gap-2 mb-2 ${
    chat.role === 'model' ? 'justify-start' : 'justify-end'
  }`}
>

  <div
    className={`max-w-[80%] px-4 py-2 rounded-lg text-sm shadow ${
      chat.role === 'model'
        ? chat.isError
          ? 'bg-red-100 text-red-800'
          : 'bg-white text-gray-800'
        : 'bg-violet-900 text-white'
    }`}
  >
    <p className="whitespace-pre-wrap break-words">{chat.text}</p>
  </div>
</div>

  );
};

export default ChatMessage;
