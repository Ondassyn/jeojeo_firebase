export interface Player {
  uid?: number;
  name: string;
  score: number;
  answer: string;
  isCorrect: boolean | null; // null = not answered, true = correct, false = incorrect
  color: string;
}
