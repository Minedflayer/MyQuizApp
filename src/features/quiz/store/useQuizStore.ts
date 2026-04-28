import { create } from "zustand";
import { supabase } from "../../../shared/lib/supabase"; // Adjust path if needed

// Quiz list interface
export interface Quizinfo {
  id: string;
  title: string;
  difficulty: string;
}
//Structure of a single question
export interface Question {
  id: string;
  text: string;
  correctIndex: number;
  options: string[];
}

// Define state and store
interface QuizState {
  // State for choosing quiz in home screen list
  availableQuizzes: Quizinfo[];
  isFetchingList: boolean;
  questions: Question[];
  currentIndex: number;
  score: number;
  status: "idle" | "loading" | "countdown" | "active" | "finished" | "error";
  errorMessage: string | null;
  selectedOptionIndex: number | null; // Tracks what the user has tapped
  isRevealing: boolean; // Screen locks during animation
  timeLeft: number;

  // Actions (functions)
  startActiveQuestion: () => void;
  fetchQuizList: () => Promise<void>;
  fetchAndStartQuiz: (quizId: string) => Promise<void>;
  submitAnswer: (selectedIndex: number) => void;
  nextQuestion: () => void;
  reset: () => void;
  tick: () => void;
}

// Creating the store
export const useQuizStore = create<QuizState>((set, get) => ({
  availableQuizzes: [],
  isFetchingList: false,
  questions: [],
  currentIndex: 0,
  score: 0,
  status: "idle",
  errorMessage: null,
  selectedOptionIndex: null,
  isRevealing: false,
  timeLeft: 30,

  tick: () => {
    const state = get();
    if (state.isRevealing || state.status !== "active") return;

    if (state.timeLeft > 0) {
      set({ timeLeft: state.timeLeft - 1 });
    } else {
      // No time left
      get().submitAnswer(-1);
    }
  },

  fetchQuizList: async () => {
    set({ isFetchingList: true });
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, difficulty")
        .order("created_at", { ascending: false });
      if (error) throw error;
      set({ availableQuizzes: data || [], isFetchingList: false });
    } catch (error) {
      console.error("Failed to fetch quizzes: ", error);
      set({ isFetchingList: false });
    }
  },

  /**
   * Fetches a quiz and its questions from Supabase, then initializes the quiz state
   * for gameplay. Performs a nested query to retrieve the quiz with all related questions
   * and options, transforms the data to match the local Question interface, and updates
   * the store with the formatted questions, reset score, and active status.
   *
   * @param quizId - The ID of the quiz to fetch and start
   * @throws Sets error state if quiz is not found or Supabase query fails
   */
  fetchAndStartQuiz: async (quizId: string) => {
    set({ status: "loading", errorMessage: null });

    // Nested Supabase query
    try {
      const { data: quizData, error } = await supabase
        .from("quizzes")
        .select(
          `
          id,
          title,
          questions (
            id,
            text,
            options (
              id,
              text,
              is_correct
            )
          )
        `,
        )
        .eq("id", quizId) // Match only rows where column is equal to value.
        .single();

      if (error) throw error;
      if (!quizData || !quizData.questions) throw new Error("No quiz found");

      // Map the database data exactly to your interface
      const formattedQuestions: Question[] = quizData.questions.map(
        (q: any) => {
          const correctIndex = q.options.findIndex(
            (opt: any) => opt.is_correct === true,
          );

          return {
            id: q.id, // Grab the ID from the database
            text: q.text,
            options: q.options.map((opt: any) => opt.text),
            correctIndex: correctIndex !== -1 ? correctIndex : 0, // Matched your property name
          };
        },
      );

      set({
        questions: formattedQuestions,
        status: "countdown",
        currentIndex: 0,
        score: 0,
        timeLeft: 30,
      });
    } catch (err: any) {
      console.error("Supabase fetch error:", err.message);
      set({ status: "error", errorMessage: err.message });
    }
  },

  submitAnswer: (selectedIndex: number) => {
    const state = get();
    if (state.isRevealing) return;
    const currentQuestion = state.questions[state.currentIndex];
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    set({
      isRevealing: true,
      selectedOptionIndex: selectedIndex,
      score: isCorrect ? state.score + 1 : state.score,
    });
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentIndex + 1;

    if (nextIndex < state.questions.length) {
      set({
        currentIndex: nextIndex,
        isRevealing: false, // Unlock screen for new question
        selectedOptionIndex: null, // reset previous answer
        timeLeft: 30,
        status: "countdown",
      });
    } else {
      set({
        status: "finished",
        isRevealing: false, // clean up
        selectedOptionIndex: null, // clean up
        timeLeft: 30,
      });
    }
  },

  startActiveQuestion: () => {
    set({ status: "active", timeLeft: 30 });
  },

  reset: () =>
    set({
      status: "idle",
      currentIndex: 0,
      score: 0,
      questions: [],
      errorMessage: null,
      selectedOptionIndex: null,
      isRevealing: false,
      timeLeft: 30, // <-- Reset
    }),
}));
