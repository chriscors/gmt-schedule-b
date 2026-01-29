'use client'

import { useState } from 'react';
import type { SelectedCode } from '../types/census';
import { Check, Copy, RotateCcw, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { callFMScript } from '@proofkit/webviewer';

interface SelectedCodeDisplayProps {
  selectedCode: SelectedCode | null;
  onReset: () => void;
}

export function SelectedCodeDisplay({ selectedCode, onReset }: SelectedCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (selectedCode?.code) {
      navigator.clipboard.writeText(selectedCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Call FileMaker script with Schedule B code and description
      callFMScript('Handle Schedule B Callback', {
        schedule_b_code: selectedCode.code,
        Schedule_b_description: selectedCode.description || ''
      });
    }
  };

  if (!selectedCode) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl shadow-lg p-6 sm:p-8 border-2 border-green-500/30">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Selected Schedule B Code
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Your classification code</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <RotateCcw className="w-4 h-4" />
            New Search
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
              Code
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-5 py-3.5 bg-background border-2 border-green-500/30 rounded-lg font-mono text-xl font-bold text-green-700 dark:text-green-400 shadow-sm">
                {selectedCode.code}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  "px-5 py-3.5 rounded-lg font-medium transition-all duration-200",
                  "flex items-center gap-2 min-w-[120px] justify-center",
                  copied
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
              Description
            </label>
            <div className="px-5 py-3.5 bg-background border border-border rounded-lg text-foreground shadow-sm">
              {selectedCode.description}
            </div>
          </div>

          {selectedCode.uom && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                Unit of Measure
              </label>
              <div className="px-5 py-3.5 bg-background border border-border rounded-lg text-foreground shadow-sm">
                {selectedCode.uom}
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
