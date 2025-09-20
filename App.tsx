
import React, { useState, useCallback } from 'react';
import { CalorieAnalysis, AppState, ProcessState } from './types';
import { analyzeImageForCalories } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import CalorieResult from './components/CalorieResult';
import Loader from './components/Loader';
import { LogoIcon, GithubIcon } from './components/Icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    processState: ProcessState.IDLE,
    imageFile: null,
    imagePreviewUrl: null,
    analysisResult: null,
    error: null,
  });

  const resetState = useCallback(() => {
    setAppState({
      processState: ProcessState.IDLE,
      imageFile: null,
      imagePreviewUrl: null,
      analysisResult: null,
      error: null,
    });
  }, []);

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    if (file && previewUrl) {
      setAppState({
        ...appState,
        processState: ProcessState.IDLE,
        imageFile: file,
        imagePreviewUrl: previewUrl,
        analysisResult: null,
        error: null,
      });
    }
  };

  const handleAnalyzeClick = async () => {
    if (!appState.imageFile) {
      setAppState(prev => ({ ...prev, error: 'Please upload an image first.' }));
      return;
    }

    setAppState(prev => ({ ...prev, processState: ProcessState.LOADING, error: null, analysisResult: null }));

    try {
      const reader = new FileReader();
      reader.readAsDataURL(appState.imageFile);
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          const result = await analyzeImageForCalories(base64String, appState.imageFile!.type);
          setAppState(prev => ({
            ...prev,
            processState: ProcessState.SUCCESS,
            analysisResult: result,
          }));
        } else {
            throw new Error("Could not convert file to base64.");
        }
      };
      reader.onerror = () => {
        throw new Error("Error reading the image file.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setAppState(prev => ({ ...prev, processState: ProcessState.ERROR, error: `Analysis failed: ${errorMessage}` }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center p-4 transition-colors duration-300">
      <header className="w-full max-w-4xl flex justify-between items-center py-4">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Calorie Vision
          </h1>
        </div>
        <a href="https://github.com/google/genai-projects" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
          <GithubIcon />
        </a>
      </header>
      
      <main className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Upload a Food Image to Begin</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Our AI will analyze the image and provide an estimated calorie and macronutrient breakdown.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-6">
              <ImageUploader 
                onImageChange={handleImageChange}
                previewUrl={appState.imagePreviewUrl}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                 <button
                  onClick={handleAnalyzeClick}
                  disabled={!appState.imageFile || appState.processState === ProcessState.LOADING}
                  className="w-full flex-1 bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  {appState.processState === ProcessState.LOADING ? 'Analyzing...' : 'Analyze Image'}
                </button>
                {(appState.imageFile || appState.analysisResult) && (
                  <button
                    onClick={resetState}
                    className="w-full sm:w-auto bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-offset-slate-800 transition-colors duration-300"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="min-h-[200px] flex items-center justify-center">
              {appState.processState === ProcessState.LOADING && <Loader />}
              {appState.processState === ProcessState.ERROR && <p className="text-red-500 text-center">{appState.error}</p>}
              {appState.processState === ProcessState.SUCCESS && appState.analysisResult && (
                <CalorieResult result={appState.analysisResult} />
              )}
               {appState.processState === ProcessState.IDLE && !appState.analysisResult && (
                <div className="text-center text-slate-500 dark:text-slate-400 p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                  <p>Analysis results will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full max-w-4xl text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        <p>Powered by the Gemini API. Calorie estimates are for informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
