import { Question } from "./question";

export interface Round {
  uid: string;
  title: string;
  order: number;
  questions: Question[];
  isExpanded?: boolean;
}
