"use client";

import { useState } from 'react';
import { AIResponse } from '../types';
import { generateEliteResponse, analyzeAllContacts, GlobalAnalysisItem } from '../services/geminiService';

export const useAI = () => {
  const [conversation, setConversation] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalAnalyses, setGlobalAnalyses] = useState<GlobalAnalysisItem[]>([]);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [analysisImage, setAnalysisImage] = useState<string | null>(null);

  const handleGenerate = async (contactName: string, property: string) => {
    if (!conversation.trim() && !analysisImage) return;
    
    setIsLoading(true);
    try {
      const response = await generateEliteResponse(conversation, contactName, property, analysisImage || undefined);
      setAiResponse(response);
      return response;
    } catch (error: any) {
      console.error("Erro no handleGenerate:", error);
      // Removed alert for better iframe compatibility
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalAnalysis = async (contacts: any[]) => {
    setIsGlobalLoading(true);
    try {
      const analyses = await analyzeAllContacts(contacts);
      setGlobalAnalyses(analyses);
    } catch (error: any) {
      console.error("Erro no handleGlobalAnalysis:", error);
      // Removed alert for better iframe compatibility
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse.idealResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return {
    conversation,
    setConversation,
    aiResponse,
    setAiResponse,
    isLoading,
    globalAnalyses,
    isGlobalLoading,
    copied,
    handleGenerate,
    handleGlobalAnalysis,
    copyToClipboard,
    analysisImage,
    setAnalysisImage
  };
};
