
export interface Question {
  id: number;
  text: string;
  options: string[];
  type: 'single' | 'multiple' | 'text';
}

export interface SurveyState {
  currentStep: number;
  answers: Record<number, string | string[]>;
  isCompleted: boolean;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
