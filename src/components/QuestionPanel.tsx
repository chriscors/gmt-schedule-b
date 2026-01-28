import React, { useState } from 'react';
import type { Interaction, InteractionAttribute } from '../types/census';

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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tell Us More About Your Product
      </h3>
      
      <p className="text-gray-700 mb-4">
        {question.name || question.question || 'Please select an option:'}
      </p>

      <div className="space-y-2 mb-6">
        {question.attrs && question.attrs.map((option) => {
          const isSelected = selectedOptions.some(opt => opt.id === option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => handleOptionToggle(option)}
              disabled={disabled}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-blue-300 bg-white text-gray-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option.name}</span>
                {isSelected && (
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={disabled || selectedOptions.length === 0}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
