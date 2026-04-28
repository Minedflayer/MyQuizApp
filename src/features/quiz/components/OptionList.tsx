//import HapticButton from "../../../shared/components/HapticButton";

interface OptionListProps {
  currentIndex: number;
  options: string[];
  correctIndex: number;
  selectedOptionIndex: number | null;
  isRevealing: boolean;
  status: string;
  submitAnswer: (index: number) => void;
}
