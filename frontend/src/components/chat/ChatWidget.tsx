"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { ArrowDown, Bot as BotIcon, SendHorizontal, X, MessageSquare } from "lucide-react";
import { useChatSound } from "@/hooks/useChatSound";
import ChatHeader from "./ChatHeader"; 

interface Message {
  id: number;
  type: "bot" | "user";
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

// --- STATIC CONSTANTS & HELPERS ---
const SUGGESTION_POOL = [
  "Who can participate in Suprathon?",
  "What are the submission requirements?",
  "What were the judging criteria?",
  "Who were the judges?",
  "Will I get a certificate?",
  "Is plagiarism allowed?",
  "How to register for the Hackathon?",
  "Is registration free?",
  "Who can I contact for doubts or technical issues?",
  "Is it fully online?",
  "Can participants register for multiple domains?",
  "Is a college ID or Bonafide certificate required?",
  "Can participants change their domain after registering?",
  "Can beginners win SuPrathon?",
  "What mentorship is available during the hackathon?",
  "Which projects have a high chance to win?"
];

const getRandomSuggestions = (count = 3, exclude?: string) => {
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
      <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline underline-offset-4 decoration-blue-200 hover:decoration-blue-600 transition-all">
        {part}
      </a>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};

// --- SUB-COMPONENTS ---
const BotAvatar = () => (
  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 shadow-lg shadow-zinc-200">
    <BotIcon size={18} className="text-blue-500" />
  </div>
);

const TypingIndicator = () => (
  <div className="flex gap-3 items-start px-2">
    <BotAvatar />
    <div className="bg-zinc-100/80 backdrop-blur-sm p-4 rounded-3xl rounded-tl-none shadow-sm border border-white">
      <div className="flex items-center gap-1.5 h-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true); 
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      text: "Hello! I'm your Suprathon guide. How can I help you today?",
      timestamp: new Date(),
      suggestions: ["Team size", "Domain", "Prize Pool"]
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const { isSoundEnabled, toggleSound, playNotification } = useChatSound();

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // --- SCROLL LOGIC ---
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // --- TEXTAREA AUTO-RESIZE ---
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
        text: res.data.reply || "I'm having trouble thinking. Try again?",
        timestamp: new Date(),
        suggestions: getRandomSuggestions(3, messageText)
      };
      setMessages((prev) => [...prev, botMessage]);
      
      // Only play sound if enabled and the window is actually open
      if (isSoundEnabled) {
        playNotification();
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: "bot", text: "Something went wrong.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes soft-open {
          0% { transform: translateY(20px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .q-window {
           background: #ffffff;
           border-radius: 40px;
           box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.2);
           animation: soft-open 0.5s cubic-bezier(0.16, 1, 0.3, 1);
           transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .q-tail {
          position: absolute;
          bottom: -8px;
          right: 35px;
          width: 30px;
          height: 20px;
          background: white;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          z-index: -1;
        }
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { 
          background: #e4e4e7; 
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>

      {/* Launcher */}
      {!open && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
          {showWelcome && (
            <div className="mb-4 mr-1 bg-zinc-900 text-white px-6 py-4 rounded-[26px] rounded-br-none shadow-2xl border border-zinc-800 text-sm font-medium animate-bounce relative max-w-[220px] text-center leading-tight">
              <button 
                onClick={() => setShowWelcome(false)} 
                className="absolute -top-2 -left-2 bg-blue-600 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
              >
                <X size={10} />
              </button>
              Hey! Need help? I'm your Suprathon AI
              <div className="absolute -bottom-1 right-0 w-3 h-3 bg-zinc-900 [clip-path:polygon(100%_0,0_0,100%_100%)]"></div>
            </div>
          )}

          <button 
            onClick={() => { setOpen(true); setShowWelcome(false); }} 
            className="h-16 w-16 bg-zinc-900 rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 border-4 border-white outline outline-1 outline-zinc-200"
          >
            <MessageSquare size={24} className="text-blue-500" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {open && (
        <div className={`fixed z-50 transition-all duration-500 ${isMaximized ? "inset-0 flex items-center justify-center p-4 sm:p-10" : "bottom-12 right-8 w-[calc(100vw-4rem)] sm:w-[420px]"}`}>
          <div className={`relative q-window flex flex-col border border-zinc-100 overflow-hidden ${isMaximized ? "w-full h-full max-w-6xl shadow-3xl" : "h-[820px] max-h-[92vh] w-full"}`}>
            
            {/* Header - Padding adjusted for ChatHeader integration */}
            <div className="bg-white border-b border-zinc-50">
              <ChatHeader 
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
                isSoundEnabled={isSoundEnabled}
                toggleSound={toggleSound}
                onClose={() => setOpen(false)}
              />
            </div>

            {/* Message Body */}
            <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scroll bg-gradient-to-b from-white via-white to-zinc-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[88%] ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {msg.type === "bot" && <BotAvatar />}
                    <div className="flex flex-col gap-2">
                      <div className={`px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
                        msg.type === "bot" 
                        ? "bg-zinc-100 text-zinc-800 rounded-[24px_24px_24px_4px] border border-zinc-200/50" 
                        : "bg-blue-600 text-white rounded-[24px_24px_4px_24px] shadow-blue-100"
                      }`}>
                        {renderMessageWithLinks(msg.text)}
                      </div>
                      
                      {msg.type === "bot" && msg.suggestions && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {msg.suggestions.map((s, idx) => (
                            <button key={idx} onClick={() => sendMessage(s)} className="px-5 py-2 text-[13px] font-semibold rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all shadow-sm">
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                      <span className="text-[10px] text-zinc-400 px-2 font-bold uppercase tracking-widest">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {loading && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            {/* Footer */}
            <div className={`bg-white border-t border-zinc-100 transition-all ${isMaximized ? "p-10" : "p-8 pt-4 pb-12"}`}>
              <div className="flex items-center gap-3 bg-zinc-100 rounded-[2.5rem] p-2 pr-3 focus-within:bg-white focus-within:ring-2 ring-blue-500/20 transition-all border border-transparent focus-within:border-zinc-200">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  className="flex-1 bg-transparent px-5 py-3 text-[14px] outline-none resize-none max-h-[150px] text-zinc-900 placeholder:text-zinc-400 font-medium"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className={`h-12 w-12 flex items-center justify-center rounded-full transition-all ${
                    input.trim() && !loading ? "bg-zinc-900 text-blue-500 shadow-xl scale-100 active:scale-90" : "bg-zinc-200 text-zinc-400"
                  }`}
                >
                  <SendHorizontal size={22} />
                </button>
              </div>
              <div className="flex justify-center items-center gap-2 mt-6 opacity-40">
                <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                <p className="text-[10px] text-zinc-900 font-bold tracking-[0.2em] uppercase">Secured by Suprathon AI</p>
              </div>
            </div>

            {!isMaximized && <div className="q-tail" />}

            {showScrollBtn && (
              <button 
                onClick={() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" })} 
                className="absolute right-8 bottom-44 bg-zinc-900 text-blue-500 p-3 rounded-full shadow-2xl hover:bg-black transition-all animate-bounce z-10 border border-zinc-700"
              >
                <ArrowDown size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;