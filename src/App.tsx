import React, { useState } from 'react';
import { useClassify } from './hooks/useClassify';
import { useScheduleBFind } from './hooks/useScheduleBFind';
import { SearchInput } from './components/SearchInput';
import { KnownCharacteristics } from './components/KnownCharacteristics';
import { QuestionPanel } from './components/QuestionPanel';
import { ScheduleBTable } from './components/ScheduleBTable';
import { SelectedCodeDisplay } from './components/SelectedCodeDisplay';
import type { SelectedCode } from './types/census';
import './index.css';

function App() {
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

  const isLoading = state === 'loading';
  const showQuestions = state === 'questioning';
  const showResults = state === 'complete' && !selectedCode;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Schedule B Code Search
          </h1>
          <p className="text-gray-600">
            Find the correct Schedule B classification code for your product
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Search Input */}
          {!selectedCode && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <SearchInput
                onSearch={handleSearch}
                disabled={isLoading || showQuestions}
              />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Processing your request...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 rounded-lg shadow-md p-6 border-2 border-red-500">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Error
              </h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Try Again
              </button>
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
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                  <p className="text-yellow-800">
                    Could not load Schedule B codes: {scheduleBError}
                  </p>
                </div>
              )}
              
              <ScheduleBTable
                scheduleData={scheduleData}
                onSelect={handleCodeSelect}
                loading={scheduleBLoading}
              />

              {!scheduleBLoading && scheduleData && (
                <div className="text-center">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 underline focus:outline-none"
                  >
                    Start a new search
                  </button>
                </div>
              )}
            </>
          )}

          {/* Product Description Display */}
          {productDescription && !selectedCode && (
            <div className="text-sm text-gray-600 text-center">
              Searching for: <span className="font-semibold">{productDescription}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
