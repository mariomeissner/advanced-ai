"use client";

import { useRef, useState } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { GitIcon, MasonryIcon, VercelIcon } from "@/components/icons";
import Link from "next/link";
import { useChat } from "ai/react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { messages, handleSubmit, input, setInput, append } = useChat();
  const [promptMode, setPromptMode] = useState("Standard");

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    {
      title: "How many 'r's",
      label: "are in the word strawberry?",
      action: "How many 'r's are in the word strawberry?",
    },
  ];

  return (
    <div className="flex flex-row justify-center h-dvh bg-white dark:bg-zinc-900">
      <div className={cn("flex flex-col w-full", messages.length === 0 ? 'justify-center' : 'justify-between pb-20')}>
        <div
          ref={messagesContainerRef}
          className={cn("flex flex-col gap-6 w-dvw items-center", messages.length > 0 ? 'h-full overflow-y-scroll' : '')}
        >
          {messages.length === 0 && (
            <motion.div className="px-4 w-full md:w-[500px] md:px-0">
              <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
                <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                  <VercelIcon size={16} />
                  <span>+</span>
                  <MasonryIcon />
                </p>
                <p className="text-center">
                  Multi-step generations with gpt-4o-mini (
                  <Link
                    className="text-blue-500 dark:text-blue-400"
                    href="https://openai.com"
                    target="_blank"
                  >
                    OpenAI
                  </Link>
                  ) and the{" "}
                  <Link
                    className="text-blue-500 dark:text-blue-400"
                    href="https://sdk.vercel.ai"
                    target="_blank"
                  >
                    AI SDK
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((message, i) => {
            return (
              <Message
                key={message.id}
                role={message.role}
                content={message.content}
                toolInvocations={message.toolInvocations}
                reasoningMessages={[]}
              ></Message>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <form
            className="flex flex-col gap-2 relative items-center w-full px-4 md:px-0"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-2 w-full md:max-w-[500px]">
              <select
                value={promptMode}
                onChange={(e) => setPromptMode(e.target.value)}
                className="bg-zinc-100 rounded-md px-2 py-1.5 outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 w-[120px]"
              >
                <option value="Standard">Standard</option>
                <option value="Advanced">Advanced</option>
              </select>
              <input
                ref={inputRef}
                className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
                placeholder="Send a message..."
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
              />
            </div>
          </form>

          {messages.length === 0 && (
            <div className="grid sm:grid-cols-1 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px]">
              {suggestedActions.map((suggestedAction, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  key={index}
                  className={index > 1 ? "hidden sm:block" : "block"}
                >
                  <button
                    onClick={async () => {
                      append({
                        role: "user",
                        content: suggestedAction.action,
                      });
                    }}
                    className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                  >
                    <span className="font-medium">{suggestedAction.title}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {suggestedAction.label}
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
