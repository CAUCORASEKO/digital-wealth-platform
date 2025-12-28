// apps/web/src/components/ai-chat/AICopilotSidebar.tsx


import { useState, useRef, useEffect } from 'react';
import { useContextPortfolioData } from '@web3-ai-copilot/data-hooks';
import { useWallet } from '@web3-ai-copilot/wallet';

import { ChatMessage } from './ChatMessage';
import { IChatMessage } from '../../types';
import { useSendAiMessageMutation } from '../../queries/useAiGateway';
import { userChatStore } from '../../store/userChatStore';
import { useAdvisoryView } from '../../hooks/useAdvisoryView';

import {
  Drawer,
  Typography,
  Button,
  Input,
  LucideIcons,
  Loader,
  useTheme,
} from '@e-burgos/tucu-ui';

export function AICopilotSidebar() {
  const { mode } = useTheme();
  const advisoryView = useAdvisoryView();

  const { mutateAsync: sendAiMessage, isPending: isLoading } =
    useSendAiMessageMutation();

  const {
    chatOpen,
    setChatOpen,
    getMessages,
    addMessage,
    clearHistory,
    setCurrentWalletAddress,
    currentWalletAddress,
  } = userChatStore();

  const { address } = useWallet();
  const { data: portfolioData } = useContextPortfolioData();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Messages scoped per wallet
  const messages = getMessages(address);

  // Sync wallet context
  useEffect(() => {
    if (address !== currentWalletAddress) {
      setCurrentWalletAddress(address ?? null);
    }
  }, [address, currentWalletAddress, setCurrentWalletAddress]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    /**
     * Inject context ONLY on first message.
     * This context is invisible to the user and sent only to the backend.
     */
    const contextualizedContent =
      messages.length === 0
        ? `Context: User is currently viewing the "${advisoryView}" section.\n\n${input}`
        : input;

    const internalUserMessage: IChatMessage = {
      role: 'user',
      content: contextualizedContent,
    };

    // Store clean message for UI
    addMessage(
      {
        role: 'user',
        content: input,
      },
      address
    );

    setInput('');

    try {
      const assistantMessage = await sendAiMessage({
        messages: [...messages, internalUserMessage],
        portfolioData: portfolioData || null,
      });

      addMessage(assistantMessage, address);
    } catch (error) {
      console.error('AI error:', error);
      addMessage(
        {
          role: 'assistant',
          content:
            'Sorry, I encountered an error while analyzing your data.',
        },
        address
      );
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear chat history?')) {
      clearHistory(address);
    }
  };

  return (
    <Drawer
      title="AI Advisory Assistant"
      isOpen={chatOpen}
      setIsOpen={setChatOpen}
      type="sidebar"
      position="right"
      className="relative w-full md:w-[450px]!"
    >
      {/* Clear history */}
      {messages.length > 0 && (
        <div className="fixed top-[32px] right-[60px] z-10">
          <Button
            tooltip="Clear chat history"
            variant="ghost"
            shape="pill"
            size="mini"
            onClick={handleClearHistory}
          >
            <LucideIcons.Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-4 mb-12">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Typography tag="h3">
              Advisory assistant ready for your {advisoryView} view
            </Typography>
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-center my-10">
            <Loader />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-light-dark">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about your ${advisoryView}…`}
            autoComplete="off"
            className={`w-full ${
              mode === 'dark'
                ? 'text-gray-200!'
                : 'text-gray-800!'
            }`}
          />
          <Button
            shape="circle"
            variant="transparent"
            onClick={handleSend}
            disabled={isLoading}
          >
            <LucideIcons.SendHorizonal />
          </Button>
        </div>
      </div>
    </Drawer>
  );
}