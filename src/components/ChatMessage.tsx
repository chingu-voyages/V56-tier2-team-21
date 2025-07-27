import ChatbotIcon from "./ChatbotIcon";
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
      className={`message ${chat.role === "model" ? "bot" : "user"}-message ${
        chat.isError ? "error" : ""
      }`}
    >
      {chat.role === "model" && <ChatbotIcon />}
      <p className="message-text">{chat.text}</p>
    </div>
  );
};

export default ChatMessage;
