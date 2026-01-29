'use client'

import { useState } from 'react';
import { useClassify } from '../hooks/useClassify';
import { useScheduleBFind } from '../hooks/useScheduleBFind';
import { SearchInput } from './SearchInput';
import { KnownCharacteristics } from './KnownCharacteristics';
import { QuestionPanel } from './QuestionPanel';
import { ScheduleBTable } from './ScheduleBTable';
import { SelectedCodeDisplay } from './SelectedCodeDisplay';
import type { SelectedCode } from '../types/census';
import { Loader2, AlertCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { callFMScript } from '@proofkit/webviewer';

export default function App() {
  const [selectedCode, setSelectedCode] = useState<SelectedCode | null>(null);
  
  const {
    state,
    error,
    productDescription,
    currentQuestion,
    knownCharacteristics,
    hsCode,
    startClassification,
    submitAnswer,
    reset,
  } = useClassify();

  const {
    loading: scheduleBLoading,
    error: scheduleBError,
    scheduleData,
  } = useScheduleBFind(hsCode);

  const handleSearch = (description: string) => {
    setSelectedCode(null);
    startClassification(description);
  };

  const handleCodeSelect = (code: SelectedCode) => {
    setSelectedCode(code);
  };

  const handleReset = () => {
    setSelectedCode(null);
    reset();
  };

  const handleCancel = () => {
    // Call FileMaker script to close window
    callFMScript('close window');
  };

  const isLoading = state === 'loading';
  const showQuestions = state === 'questioning';
  const showResults = state === 'complete' && !selectedCode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 sm:pt-4 pb-2 sm:pb-12">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Search Input */}
          {!selectedCode && (
            <div className="bg-card rounded-xl shadow-sm border border-border p-2 sm:p-8 backdrop-blur-sm">
              <SearchInput
                onSearch={handleSearch}
                disabled={isLoading || showQuestions}
              />
            </div>
          )}

          {/* Product Description Display */}
          {productDescription && !selectedCode && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Searching for:</span>
              <span className="font-semibold text-foreground px-3 py-1 bg-primary/10 rounded-full">
                {productDescription}
              </span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Processing your request...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border-2 border-destructive/20 rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Error
                  </h3>
                  <p className="text-destructive/90 mb-4">{error}</p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Known Characteristics */}
          {knownCharacteristics.length > 0 && !selectedCode && (
            <KnownCharacteristics characteristics={knownCharacteristics} />
          )}

          {/* Question Panel */}
          {showQuestions && (
            <QuestionPanel
              question={currentQuestion}
              onSubmit={submitAnswer}
              disabled={isLoading}
            />
          )}

          {/* Selected Code Display */}
          {selectedCode && (
            <SelectedCodeDisplay
              selectedCode={selectedCode}
              onReset={handleReset}
            />
          )}

          {/* Schedule B Results */}
          {showResults && (
            <>
              {scheduleBError && (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Could not load Schedule B codes: {scheduleBError}
                    </p>
                  </div>
                </div>
              )}
              
              <ScheduleBTable
                scheduleData={scheduleData}
                onSelect={handleCodeSelect}
                loading={scheduleBLoading}
              />

              {!scheduleBLoading && scheduleData && (
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-muted-foreground hover:text-foreground underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 transition-colors"
                  >
                    Start a new search
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Cancel Button - Always visible at bottom right */}
      <button
        type="button"
        onClick={handleCancel}
        className={cn(
          "fixed bottom-4 right-4 px-5 py-3.5 rounded-lg font-medium transition-all duration-200",
          "flex items-center gap-2 shadow-lg z-50",
          "bg-red-600 text-white hover:bg-red-700 hover:shadow-xl",
          "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        )}
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
    </div>
  );
}
