import { create } from "zustand";

// Structure of a single question
export interface Question {
  id: string;
  text: string;
  correctIndex: number;
  options: string[];
  //category: string;
}

// Define the stores states and actions
interface QuizState {
  // State
  questions: Question[];
  currentIndex: number;
  score: number;
  userAnswers: number[];
  status: "idle" | "playing" | "finished";

  //Actions
  startQuiz: (questions: Question[]) => void;
  submitAnswer: (optionIndex: number) => void;
  nextQuestion: () => void;
  reset: () => void;
}

// Creating the store
export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  currentIndex: 0,
  score: 0,
  userAnswers: [],
  status: "idle",

  // Start new session with new questions
  startQuiz: (questions) =>
    set({
      questions,
      currentIndex: 0,
      score: 0,
      userAnswers: [],
      status: "playing",
    }),

  // Click handler for submit button
  submitAnswer: (optionIndex) =>
    set((state) => {
      const currentQuestion = state.questions[state.currentIndex];
      const isCorrect = currentQuestion.correctIndex === optionIndex;

      return {
        score: isCorrect ? state.score + 1 : state.score,
        userAnswers: [...state.userAnswers, optionIndex],
      };
    }),

  nextQuestion: () =>
    set((state) => {
      const isLastQuestion = state.currentIndex === state.questions.length - 1;

      if (isLastQuestion) {
        return { status: "finished" };
      }

      return { currentIndex: state.currentIndex + 1 };
    }),

  // Clear function
  reset: () =>
    set({
      status: "idle",
      questions: [],
      currentIndex: 0,
      score: 0,
      userAnswers: [],
    }),
}));
