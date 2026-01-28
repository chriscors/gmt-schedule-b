'use client'

import React, { useState } from 'react';
import type { Interaction, InteractionAttribute } from '../types/census';
import { Check, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuestionPanelProps {
  question: Interaction | null;
  onSubmit: (selectedOptions: InteractionAttribute[]) => void;
  disabled?: boolean;
}

export function QuestionPanel({ question, onSubmit, disabled = false }: QuestionPanelProps) {
  const [selectedOptions, setSelectedOptions] = useState<InteractionAttribute[]>([]);

  if (!question) return null;

  const handleOptionToggle = (option: InteractionAttribute) => {
    setSelectedOptions(prev => {
      const isSelected = prev.some(opt => opt.id === option.id);
      if (isSelected) {
        return prev.filter(opt => opt.id !== option.id);
      } else {
        // For single-select, replace the selection
        // If multi-select is needed, change to: return [...prev, option];
        return [option];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedOptions.length > 0) {
      onSubmit(selectedOptions);
      setSelectedOptions([]);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 sm:p-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Tell Us More About Your Product
          </h3>
          <p className="text-muted-foreground text-base leading-relaxed">
            {question.name || question.question || 'Please select an option:'}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {question.attrs && question.attrs.map((option) => {
          const isSelected = selectedOptions.some(opt => opt.id === option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => handleOptionToggle(option)}
              disabled={disabled}
              className={cn(
                "w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200",
                "flex items-center justify-between gap-4",
                isSelected
                  ? "border-primary bg-primary/5 text-foreground shadow-sm"
                  : "border-border bg-background hover:border-primary/50 hover:bg-accent text-foreground",
                disabled && "opacity-50 cursor-not-allowed",
                !disabled && "cursor-pointer"
              )}
            >
              <span className="font-medium text-base flex-1">{option.name}</span>
              {isSelected && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={disabled || selectedOptions.length === 0}
        className={cn(
          "w-full px-6 py-3.5",
          "bg-primary text-primary-foreground font-semibold rounded-lg",
          "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed",
          "transition-all duration-200",
          "shadow-sm hover:shadow-md"
        )}
      >
        Continue
      </button>
    </div>
  );
}
