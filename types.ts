
export interface CalorieAnalysis {
  foodName: string;
  totalCalories: number;
  macros: {
    protein: { value: number; unit: string };
    carbohydrates: { value: number; unit: string };
    fat: { value: number; unit: string };
  };
  confidenceScore: number;
  disclaimer: string;
}

export enum ProcessState {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export interface AppState {
    processState: ProcessState;
    imageFile: File | null;
    imagePreviewUrl: string | null;
    analysisResult: CalorieAnalysis | null;
    error: string | null;
}
