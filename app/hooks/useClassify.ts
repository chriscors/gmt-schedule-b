'use client'

import { useState, useCallback } from 'react';
import { classifyStart, classifyContinue } from '../lib/classifyApi';
import type { Interaction, InteractionAttribute, PotentialHeading } from '../types/census';

type ClassifyState = 'idle' | 'loading' | 'questioning' | 'complete' | 'error';

interface UseClassifyReturn {
  state: ClassifyState;
  error: string | null;
  productDescription: string;
  currentQuestion: Interaction | null;
  knownCharacteristics: Interaction[];
  hsCode: string | null;
  potentialHeadings: PotentialHeading[];
  startClassification: (description: string) => Promise<void>;
  submitAnswer: (selectedOptions: InteractionAttribute[]) => Promise<void>;
  reset: () => void;
}

/**
 * Hook to manage the classification state machine
 * States: idle -> loading -> questioning -> complete -> error
 */
export function useClassify(): UseClassifyReturn {
  const [state, setState] = useState<ClassifyState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [productDescription, setProductDescription] = useState('');
  
  // Current classification session data
  const [txId, setTxId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Interaction | null>(null);
  const [knownCharacteristics, setKnownCharacteristics] = useState<Interaction[]>([]);
  const [hsCode, setHsCode] = useState<string | null>(null);
  const [potentialHeadings, setPotentialHeadings] = useState<PotentialHeading[]>([]);

  /**
   * Start a new classification
   */
  const startClassification = useCallback(async (description: string) => {
    try {
      setState('loading');
      setError(null);
      setProductDescription(description);
      setKnownCharacteristics([]);
      setHsCode(null);
      setPotentialHeadings([]);

      const response = await classifyStart(description);
      
      setTxId(response.txId);
      
      if (response.hsCode) {
        // Classification complete immediately
        setHsCode(response.hsCode);
        setPotentialHeadings(response.potentialHeadings || []);
        setState('complete');
      } else if (response.currentItemInteraction) {
        // Need to ask questions
        setCurrentQuestion(response.currentItemInteraction);
        setKnownCharacteristics(response.knownInteractions || []);
        setState('questioning');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setState('error');
    }
  }, []);

  /**
   * Submit an answer to the current question
   */
  const submitAnswer = useCallback(async (selectedOptions: InteractionAttribute[]) => {
    if (!txId || !currentQuestion) {
      setError('Invalid state for submitting answer');
      setState('error');
      return;
    }

    try {
      setState('loading');
      setError(null);

      // Format the values as required by the API
      const values = selectedOptions.map(opt => ({
        first: opt.id,
        second: opt.name
      }));

      const response = await classifyContinue(
        txId,
        currentQuestion.id,
        values,
        productDescription
      );

      // Priority: Check for more questions FIRST, then check for completion
      // The API can return both potentialHeadings AND currentItemInteraction
      // We should continue asking questions if currentItemInteraction exists and is different
      
      if (response.currentItemInteraction && response.currentItemInteraction.id !== currentQuestion.id) {
        // More questions to answer (different question ID)
        setCurrentQuestion(response.currentItemInteraction);
        setKnownCharacteristics(response.knownInteractions || []);
        setState('questioning');
      } else if (response.hsCode) {
        // Classification complete with HS code
        setHsCode(response.hsCode);
        setPotentialHeadings(response.potentialHeadings || []);
        setKnownCharacteristics(response.knownInteractions || []);
        setState('complete');
      } else if (response.currentItemInteraction && response.currentItemInteraction.id === currentQuestion.id) {
        // Same question returned - this indicates we're stuck in a loop
        // If there are potential headings, use them to complete (this was the loop fix)
        if (response.potentialHeadings && response.potentialHeadings.length > 0) {
          // Same question but potential headings exist - use them to complete
          const headings = response.potentialHeadings;
          const headingWithoutX = headings.find((h: any) => {
            const code = typeof h === 'string' ? h : h.code;
            return code && !code.endsWith('x');
          });
          const selectedHeading = headingWithoutX || headings[0];
          const selectedCode = typeof selectedHeading === 'string' ? selectedHeading : selectedHeading.code;
          setHsCode(selectedCode);
          setPotentialHeadings(response.potentialHeadings);
          setKnownCharacteristics(response.knownInteractions || []);
          setState('complete');
        } else {
          throw new Error('Same question returned - possible API issue or invalid answer format');
        }
      } else if (response.potentialHeadings && response.potentialHeadings.length > 0 && !response.currentItemInteraction) {
        // Classification complete with potential headings (no more questions, no specific HS code)
        // Find the first potential heading that doesn't end in 'x' (wildcard codes don't work with Schedule B API)
        const headings = response.potentialHeadings;
        const headingWithoutX = headings.find((h: any) => {
          const code = typeof h === 'string' ? h : h.code;
          return code && !code.endsWith('x');
        });
        const selectedHeading = headingWithoutX || headings[0];
        const selectedCode = typeof selectedHeading === 'string' ? selectedHeading : selectedHeading.code;
        
        setHsCode(selectedCode);
        setPotentialHeadings(response.potentialHeadings);
        setKnownCharacteristics(response.knownInteractions || []);
        setState('complete');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setState('error');
    }
  }, [txId, currentQuestion, productDescription]);

  /**
   * Reset the classification state
   */
  const reset = useCallback(() => {
    setState('idle');
    setError(null);
    setProductDescription('');
    setTxId(null);
    setCurrentQuestion(null);
    setKnownCharacteristics([]);
    setHsCode(null);
    setPotentialHeadings([]);
  }, []);

  return {
    // State
    state,
    error,
    productDescription,
    
    // Classification data
    currentQuestion,
    knownCharacteristics,
    hsCode,
    potentialHeadings,
    
    // Actions
    startClassification,
    submitAnswer,
    reset,
  };
}
