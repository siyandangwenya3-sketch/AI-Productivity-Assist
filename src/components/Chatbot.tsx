import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot, Trash2 } from 'lucide-react';
import { generateChatResponse } from '@/lib/ai-engine';
import { supabase, type ChatMessage } from '@/lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SESSION_ID = `session-${Date.now()}`;

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI Workplace Assistant. I can help you with email drafting, meeting notes, task scheduling, research summarization, and general productivity tips. What would you like help with today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const userText = input;
    setInput('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 500));
    const response = generateChatResponse(userText);
    const assistantMessage: Message = { id: `assistant-${Date.now()}`, role: 'assistant', content: response };
    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);

    await supabase.from('chat_history').insert([
      { session_id: SESSION_ID, role: 'user', content: userText },
      { session_id: SESSION_ID, role: 'assistant', content: response },
    ]);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your AI Workplace Assistant. How can I help you today?",
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
            <MessageSquare className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Workplace Assistant</h2>
            <p className="text-sm text-slate-500">Interactive chat for workplace queries and productivity guidance</p>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                msg.role === 'user' ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                {msg.role === 'user' ? (
                  <User className="h-4 w-4 text-blue-600" />
                ) : (
                  <Bot className="h-4 w-4 text-orange-600" />
                )}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-700'
              }`}>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100">
                <Bot className="h-4 w-4 text-orange-600" />
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 animate-pulse text-orange-400" />
                  <span className="text-sm text-slate-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about emails, meetings, scheduling, research, or productivity..."
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Help me write an email', 'How do I prioritize tasks?', 'Tips for better meetings', 'Productivity tips'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 transition hover:bg-slate-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
