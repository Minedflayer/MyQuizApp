import { Question } from "./store/useQuizStore";

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    text: "Which language is used for React Native?",
    options: ["Java", "Swift", "JavaScript", "C++"],
    correctIndex: 2,
  },
  {
    id: "2",
    text: "What does 'Expo' help with?",
    options: ["Cooking", "App Development", "Space Travel", "Mining"],
    correctIndex: 1,
  },
];
