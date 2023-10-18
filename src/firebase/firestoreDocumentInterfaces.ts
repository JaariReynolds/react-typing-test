import { Timestamp } from "firebase/firestore";

export interface UserDocument {
    email: string,
    username: string,
    testSummaries: TestSummary[],
    creationDate: Timestamp,
}

export interface TimedScoreDocument {
    username: string,
    testLengthSeconds: number,
    wpm: number,
    accuracy: number,
    consistency: number,
    submissionDate: Timestamp
}

export interface WordCountScoreDocument {
    username: string,
    wordCount: number,
    testLengthSeconds: number,
    wpm: number,
    accuracy: number,
    consistency: number,
    submissionDate: Timestamp
}

export interface TestSummary {
    testType: string,
    testLength: number, // either wordCount or testLength(seconds)
    submissionCount: number,
    averageWpm: number,
    averageAccuracy: number,
    averageConsistency: number,
    highestWpm: number
}