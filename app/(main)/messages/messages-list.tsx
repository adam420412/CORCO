"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendMessage, getConversations, getMessages } from "@/actions/messages";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  userId: string;
  userRole: string;
};

type Conversation = {
  oderId: string;
  otherName: string;
  lastMessage: string;
  unread: boolean;
};

type Message = {
  id: number;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
};

export const MessagesList = ({ userId, userRole }: Props) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, startTransition] = useTransition();

  const handleSend = () => {
    if (!messageText.trim() || !selectedUser) return;

    startTransition(async () => {
      try {
        await sendMessage(selectedUser, messageText);
        setMessageText("");
        toast.success("Wiadomość wysłana");
      } catch {
        toast.error("Nie udało się wysłać wiadomości");
      }
    });
  };

  return (
    <div className="flex gap-4 h-[600px] border rounded-xl overflow-hidden">
      {/* Conversations list */}
      <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
        <h2 className="font-semibold text-sm text-gray-500 mb-3 uppercase">
          Konwersacje
        </h2>
        {conversations.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">
            Brak konwersacji.
            <br />
            {userRole === "teacher"
              ? "Dodaj uczniów aby rozpocząć."
              : "Poczekaj na wiadomość od nauczyciela."}
          </p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.oderId}
              onClick={() => setSelectedUser(conv.oderId)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition ${
                selectedUser === conv.oderId
                  ? "bg-teal-100 border-teal-300 border"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="font-medium text-sm">{conv.otherName}</p>
              <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
            </button>
          ))
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      msg.senderId === userId
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex gap-2">
              <input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Napisz wiadomość..."
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={pending}
              />
              <Button
                onClick={handleSend}
                disabled={pending || !messageText.trim()}
                className="bg-teal-500 hover:bg-teal-600 rounded-full"
              >
                Wyślij
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Wybierz konwersację
          </div>
        )}
      </div>
    </div>
  );
};
