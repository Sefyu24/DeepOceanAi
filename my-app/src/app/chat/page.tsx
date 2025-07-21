"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/navbar";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollElement) {
          setTimeout(() => {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }, 100);
        }
      }
    };

    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
          {/* Header */}
          <div className="border-b border-border py-4 px-4 flex-shrink-0">
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              AI Research Assistant
            </h1>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center px-4">
                  <div className="space-y-6 max-w-md">
                    <Bot className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-2">
                        How can I help you today?
                      </h3>
                      <p className="text-muted-foreground">
                        Ask me anything about your research documents
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pb-32">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`w-full ${
                        message.role === "assistant"
                          ? "bg-muted/50"
                          : ""
                      }`}
                    >
                      <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            {message.role === "assistant" ? (
                              <div className="w-8 h-8 bg-chart-2 rounded-full flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary-foreground" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-chart-5 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-primary-foreground" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            {message.role === "assistant" ? (
                              <div className="prose prose-gray dark:prose-invert max-w-none">
                                <ReactMarkdown
                                  components={{
                                    p: ({ children }) => (
                                      <p className="mb-4 text-foreground">
                                        {children}
                                      </p>
                                    ),
                                    ul: ({ children }) => (
                                      <ul className="mb-4 ml-6 list-disc text-foreground">
                                        {children}
                                      </ul>
                                    ),
                                    ol: ({ children }) => (
                                      <ol className="mb-4 ml-6 list-decimal text-foreground">
                                        {children}
                                      </ol>
                                    ),
                                    li: ({ children }) => (
                                      <li className="mb-1">{children}</li>
                                    ),
                                    h1: ({ children }) => (
                                      <h1 className="text-xl font-bold mb-4 text-foreground">
                                        {children}
                                      </h1>
                                    ),
                                    h2: ({ children }) => (
                                      <h2 className="text-lg font-bold mb-3 text-foreground">
                                        {children}
                                      </h2>
                                    ),
                                    h3: ({ children }) => (
                                      <h3 className="text-base font-bold mb-2 text-foreground">
                                        {children}
                                      </h3>
                                    ),
                                    code: ({ children }) => (
                                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                                        {children}
                                      </code>
                                    ),
                                    pre: ({ children }) => (
                                      <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                                        {children}
                                      </pre>
                                    ),
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <div className="text-foreground whitespace-pre-wrap">
                                {message.content}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="w-full bg-muted/50">
                      <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="flex gap-4">
                          <div className="w-8 h-8 bg-chart-2 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div className="flex space-x-1 items-center">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 flex-shrink-0 bg-background">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message AI Research Assistant..."
                    disabled={isLoading}
                    className="w-full pr-12 py-3 rounded-xl border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg w-8 h-8"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AI Research Assistant can make mistakes. Check important info.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
