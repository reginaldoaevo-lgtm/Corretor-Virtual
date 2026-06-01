"use client";

import { useState } from 'react';
import { AIResponse } from '../types';
import { generateRadarResponse, analyzeAllContacts, GlobalAnalysisItem } from '../services/geminiService';

export const useAI = () => {
  const [conversation, setConversation] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalAnalyses, setGlobalAnalyses] = useState<GlobalAnalysisItem[]>([]);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [analysisImage, setAnalysisImage] = useState<string | null>(null);
  const [analysisAudio, setAnalysisAudio] = useState<string | null>(null);

  const handleGenerate = async (contactName: string, property: string) => {
    if (!conversation.trim() && !analysisImage && !analysisAudio) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateRadarResponse(conversation, contactName, property, analysisImage || undefined, analysisAudio || undefined);
      setAiResponse(response);
      return response;
    } catch (error: any) {
      console.error("Erro no handleGenerate:", error);
      setError(error.message || "Erro ao processar análise da IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalAnalysis = async (contacts: any[]) => {
    setIsGlobalLoading(true);
    setError(null);
    try {
      const analyses = await analyzeAllContacts(contacts);
      setGlobalAnalyses(analyses);
      return analyses;
    } catch (error: any) {
      console.error("Erro no handleGlobalAnalysis:", error);
      setError(error.message || "Erro ao processar análise global.");
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
    error,
    setError,
    handleGenerate,
    handleGlobalAnalysis,
    copyToClipboard,
    analysisImage,
    setAnalysisImage,
    analysisAudio,
    setAnalysisAudio
  };
};
