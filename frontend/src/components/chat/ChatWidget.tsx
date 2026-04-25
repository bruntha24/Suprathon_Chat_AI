"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { ArrowDown, X, Maximize2, Minimize2, SendHorizontal, Volume2, VolumeX } from "lucide-react";
import RobotAnimation from "./RobotAnimation";
import { useChatSound } from "@/hooks/useChatSound";

interface Message {
  id: number;
  type: "bot" | "user";
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

// --- 1. STATIC CONSTANTS & HELPERS (Defined outside to fix scope errors) ---

const SUGGESTION_POOL = [
  "Who can participate in Suprathon?",
  "What are the submission requirements?",
  "What were the judging criteria?",
  "Who were the judges?",
  "Will I get a certificate for participating?",
  "Will I get an internship?",
  "Is plagiarism allowed?",
  "Who can I contact for doubts or technical issues?",
  "Will the event be fully online?",
  "Can participants change their domain after registering?",
  "Can beginners win SuPrathon?",
  "What are the prizes?",
  "What mentorship is available during the hackathon?",
  "What type of project has the best chance of winning?",
];

const getRandomSuggestions = (count = 4, exclude?: string) => {
  const filtered = exclude 
    ? SUGGESTION_POOL.filter(s => s !== exclude) 
    : SUGGESTION_POOL;
    
  return [...filtered]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const renderMessageWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) =>
    urlRegex.test(part) ? (
      <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:opacity-80 transition break-all text-primary">
        {part}
      </a>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};

// --- 2. SUB-COMPONENTS ---

const BotAvatar = () => (
  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm overflow-hidden">
    <RobotAnimation size={30} />
  </div>
);

const TypingIndicator = () => (
  <div className="flex gap-2 items-start">
    <BotAvatar />
    <div className="bg-muted p-3" style={{ borderRadius: "18px 18px 18px 4px" }}>
      <div className="flex items-center gap-1 h-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// --- 3. MAIN COMPONENT ---

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      text: "Hi! I'm your AI Assistant. How can I help you today?",
      timestamp: new Date(),
      suggestions: ["How to apply?", "Team size", "What are the domains?"]
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const { isSoundEnabled, toggleSound, playNotification } = useChatSound();

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollBtn(scrollTop + clientHeight < scrollHeight - 50);
  };

  const sendMessage = async (textOverride?: string) => {
    const messageText = textOverride || input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      text: messageText,
      timestamp: new Date()
    };

    // Update state: Clear suggestions from all previous messages and add user message
    setMessages((prev) => 
  prev.map(m => ({ ...m, suggestions: undefined } as Message)).concat(userMessage)
);

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/chat", { message: messageText });

      const botMessage: Message = {
        id: Date.now() + 1,
        type: "bot",
        text: res.data.reply || "I'm sorry, I couldn't process that.",
        timestamp: new Date(),
        suggestions: getRandomSuggestions(4, messageText)
      };

      setMessages((prev) => [...prev, botMessage]);
      playNotification();
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: "bot", text: "Connection error. Please try again.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        .chat-bubble-text { white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere; }
        .chat-textarea { resize: none; overflow-y: auto; min-height: 36px; max-height: 120px; line-height: 1.5; }

        /* Floating launcher styles */
        @keyframes launcher-pulse-ring {
          0%   { transform: scale(1);    opacity: 0.7; }
          70%  { transform: scale(1.55); opacity: 0;   }
          100% { transform: scale(1.55); opacity: 0;   }
        }
        .chat-launcher {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-launcher-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(59, 130, 246, 0.45);
          animation: launcher-pulse-ring 2s ease-out infinite;
          pointer-events: none;
        }
        .chat-launcher-btn {
          position: relative;
          height: 64px;
          width: 64px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45), 0 2px 8px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          outline: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .chat-launcher-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(37, 99, 235, 0.6), 0 2px 8px rgba(0,0,0,0.2);
        }
        .chat-launcher-btn:active { transform: scale(0.97); }
        .chat-launcher-tooltip {
          position: absolute;
          right: 72px;
          top: 50%;
          transform: translateY(-50%);
          background: #172554;
          color: #eff6ff;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
          padding: 6px 12px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }
        .chat-launcher-tooltip::after {
          content: '';
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: #172554;
        }
        .chat-launcher:hover .chat-launcher-tooltip { opacity: 1; }
      `}</style>

      {/* Launcher */}
      {!open && (
        <div className="chat-launcher">
          <span className="chat-launcher-ring" aria-hidden="true" />
            <button
              id="chat-launcher-btn"
              aria-label="Open chat support"
              onClick={() => setOpen(true)}
              className="chat-launcher-btn"
            >
              <RobotAnimation size={52} />
            </button>
          <span className="chat-launcher-tooltip">Chat with us!</span>
        </div>
      )}

      {/* Window */}
      {open && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
          <div className={`relative flex flex-col bg-background shadow-2xl border border-border overflow-hidden transition-all duration-500 ease-in-out ${isMaximized ? "w-full h-full sm:w-[800px] sm:h-[85vh]" : "w-full h-full sm:w-[420px] sm:h-[600px]"} sm:rounded-[24px]`}>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
              <button onClick={() => setIsMaximized(!isMaximized)} className="p-2 rounded-full hover:bg-muted"><Maximize2 size={16} /></button>
              <div className="flex gap-2">
                <button onClick={toggleSound} className="p-2 rounded-full hover:bg-muted">{isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
                <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-muted"><X size={18} /></button>
              </div>
            </div>

            {/* Body */}
            <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-background">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"}`}>
                  <div className={`flex gap-2 items-start ${msg.type === "user" ? "flex-row-reverse" : "flex-row"} max-w-[85%]`}>
                    {msg.type === "bot" && <BotAvatar />}
                    <div className="flex flex-col gap-1">
                      <div className={`p-3 text-sm chat-bubble-text shadow-sm ${msg.type === "bot" ? "bg-muted text-foreground rounded-[18px_18px_18px_4px]" : "bg-primary text-primary-foreground rounded-[18px_18px_4px_18px]"}`}>
                        {renderMessageWithLinks(msg.text)}
                      </div>
                      {msg.type === "bot" && msg.suggestions && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.suggestions.map((s, idx) => (
                            <button key={idx} onClick={() => sendMessage(s)} className="px-3 py-1.5 text-xs font-medium rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all">
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                      <span className="text-[10px] text-muted-foreground px-1">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {loading && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  placeholder="Ask me something..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="chat-textarea flex-1 rounded-2xl border border-input bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${input.trim() && !loading ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}
                >
                  <SendHorizontal size={18} />
                </button>
              </div>
            </div>

            {showScrollBtn && (
              <button onClick={() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" })} className="absolute right-6 bottom-24 bg-primary text-white p-2 rounded-full shadow-lg animate-bounce">
                <ArrowDown size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;