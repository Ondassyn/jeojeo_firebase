import { Timestamp } from "firebase/firestore";
import { Round } from "./round";

export interface Game {
  uid: string;
  author: string;
  title: string;
  createdAt: Timestamp;
  rounds: Round[];
}
