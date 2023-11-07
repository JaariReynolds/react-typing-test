import { collection } from "firebase/firestore";
import { database } from "./firebase";

export const usersCollectionRef = collection(database, "users");
export const wordCountScoresCollectionRef = collection(database, "wordCountScores");
export const timedScoresCollectionRef = collection(database, "timedScores");
export const wordCountLeaderboardCollectionRef = collection(database, "wordCountLeaderboard");
export const timedLeaderboardCollectionRef = collection(database, "timedLeaderboard");
