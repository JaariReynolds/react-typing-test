import { collection } from "firebase/firestore";
import { database } from "./firebase";

export const USERS = "users";
export const WORDCOUNT_SCORES = "wordCountScores";
export const TIMED_SCORES = "timedScores";
export const WORDCOUNT_LEADERBOARD = "wordCountLeaderboard";
export const TIMED_LEADERBOARD = "timedLeaderboard";

export const usersCollectionRef = collection(database, USERS);
export const wordCountScoresCollectionRef = collection(database, WORDCOUNT_SCORES);
export const timedScoresCollectionRef = collection(database, TIMED_SCORES);
export const wordCountLeaderboardCollectionRef = collection(database, WORDCOUNT_LEADERBOARD);
export const timedLeaderboardCollectionRef = collection(database, TIMED_LEADERBOARD);
