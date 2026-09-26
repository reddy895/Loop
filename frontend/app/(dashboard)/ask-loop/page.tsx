'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { SentimentBadge } from '@/components/ui/Badges';
import { mockInitialChatMessages, mockRetrievedSources } from '@/lib/mockData';
import { useFeedbackContext } from '@/context/FeedbackContext';
import { ChatMessage, RetrievedSource } from '@/types';
import {
  Send,
  Sparkles,
  Quote,
  Bot,
  User,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

export default function AskLoopPage() {
  const { isRetrieved, openRetrieveModal } = useFeedbackContext();
  const [messages, setMessages] = useState<ChatMessage[]>(mockInitialChatMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSources, setSelectedSources] = useState<RetrievedSource[]>(mockRetrievedSources);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate AI response stream after 1.4s
    setTimeout(() => {
      setIsTyping(false);

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: `Analysis complete for query: "${textToSend}".\n\n- **Primary Sentiment Clustering**: 68% of customers express satisfaction with Ask LOOP precision, while 22% mention export streaming needs.\n- **Recommended Action**: Product team should address CSV export latency in the upcoming sprint.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: mockRetrievedSources
      };

      setMessages((prev) => [...prev, aiMsg]);
      setSelectedSources(mockRetrievedSources);
    }, 1400);
  };

  const samplePrompts = [
    'What are top customer complaints regarding billing & pricing?',
    'Summarize sentiment feedback regarding UX performance this week.',
    'Which integration connectors are most requested by enterprise teams?'
  ];

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="loop-card p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neutral-900 text-white border border-neutral-900 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
              Ask LOOP – AI Customer Intelligence
            </h1>
            <p className="text-xs text-neutral-600 font-sans">
              Query customer feedback using natural language vector search & sentiment synthesis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRetrieved && (
            <Button
              variant="primary"
              size="sm"
              icon={<FileSpreadsheet className="w-4 h-4" />}
              onClick={openRetrieveModal}
            >
              Retrieve CSV
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMessages(mockInitialChatMessages.slice(0, 1))}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reset Session
          </Button>
        </div>
      </div>

      {/* Main Split Layout: Left Chat Stream, Right Retrieved Sources Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column: Chat Conversation Stream & Question Box */}
        <div className="lg:col-span-2 flex flex-col loop-card p-4 sm:p-5 min-h-0">
          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 font-sans text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center border border-neutral-900 shrink-0 mt-1 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-xl text-xs sm:text-sm font-sans leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-neutral-900 text-white border border-neutral-900'
                        : 'bg-white text-neutral-900 border border-neutral-200 shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Sources Badge tag inside assistant response */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono-numbers">
                        <span className="font-semibold text-neutral-700 flex items-center gap-1">
                          <Quote className="w-3 h-3 text-neutral-900" /> {msg.sources.length} Feedback Sources Retrieved
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono-numbers mt-1 px-1">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center border border-neutral-800 shrink-0 mt-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator Animation */}
            {isTyping && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-neutral-200 p-3 rounded-xl flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-neutral-900 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-neutral-900 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-neutral-900 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs font-mono-numbers text-neutral-500 ml-2">Synthesizing vector data...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono-numbers shrink-0">
              Suggestions:
            </span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] font-sans px-2.5 py-1 rounded bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 hover:border-neutral-300 text-neutral-800 shrink-0 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Question Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-2 border-t border-neutral-200"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a question about customer feedback..."
              className="flex-1 bg-white text-neutral-900 border border-neutral-300 rounded-lg px-4 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputQuery.trim() || isTyping}
              icon={<Send className="w-4 h-4" />}
            >
              Ask LOOP
            </Button>
          </form>
        </div>

        {/* Right Column: Retrieved Sources Panel */}
        <div className="loop-card p-4 sm:p-5 flex flex-col min-h-0 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-neutral-900" />
              <h3 className="font-heading font-bold text-base text-neutral-900">
                Retrieved Sources Panel
              </h3>
            </div>
            <span className="text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded bg-neutral-900 text-white">
              {selectedSources.length} Citations
            </span>
          </div>

          <p className="text-xs text-neutral-500 font-sans">
            Verifiable customer quotes matched to your current AI query context:
          </p>

          <div className="space-y-3">
            {selectedSources.map((src) => (
              <div key={src.id} className="loop-card p-3 space-y-2 border-l-4 border-l-black">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900 truncate">
                    {src.customer}
                  </span>
                  <SentimentBadge sentiment={src.sentiment} />
                </div>

                <p className="text-xs font-sans italic text-neutral-800 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  "{src.quote}"
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono-numbers text-neutral-500 pt-1">
                  <span>Channel: {src.channel}</span>
                  <span>{src.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
