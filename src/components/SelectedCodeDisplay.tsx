import React, { useState } from 'react';
import type { SelectedCode } from '../types/census';

interface SelectedCodeDisplayProps {
  selectedCode: SelectedCode | null;
  onReset: () => void;
}

export function SelectedCodeDisplay({ selectedCode, onReset }: SelectedCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (selectedCode && selectedCode.code) {
      navigator.clipboard.writeText(selectedCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!selectedCode) {
    return null;
  }

  return (
    <div className="bg-green-50 rounded-lg shadow-md p-6 border-2 border-green-500">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-900">
          Selected Schedule B Code
        </h3>
        <button
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-gray-800 underline focus:outline-none"
        >
          Start New Search
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-2 bg-white border border-green-300 rounded font-mono text-lg font-bold text-green-900">
              {selectedCode.code}
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              {copied ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </span>
              ) : (
                'Copy'
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <div className="px-4 py-2 bg-white border border-green-300 rounded text-gray-900">
            {selectedCode.description}
          </div>
        </div>

        {selectedCode.uom && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit of Measure
            </label>
            <div className="px-4 py-2 bg-white border border-green-300 rounded text-gray-900">
              {selectedCode.uom}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
