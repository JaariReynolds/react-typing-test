import { Timestamp } from "firebase/firestore";

export interface UserDocument {
    email: string,
    username: string,
    testSummaries: TestSummary[],
    creationDate: Timestamp,
    level: Level
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

export interface Level {
    currentLevel: number,
    experience: Experience
}

export interface Experience {
    currentExperience: number,
    requiredExperience: number
}

export interface TimedScoreDocument {
    username: string,
    testType: string,
    testLengthSeconds: number,
    wpm: number,
    accuracy: number,
    consistency: number,
    submissionDate: Timestamp,
}

export interface WordCountScoreDocument {
    username: string,
    testType: string,
    wordCount: number,
    testLengthSeconds: number,
    wpm: number,
    accuracy: number,
    consistency: number,
    submissionDate: Timestamp
}

export interface FunboxTimedScoreDocument {
    username: string,
    testType: string,
    testMode: string,
    testLengthSeconds: number,
    wpm: number,
    accuracy: number,
    consistency: number,
    submissionDate: Timestamp,
}

export interface FunboxWordCountScoreDocument {
    username: string,
    testType: string,
    testMode: string,
    wordCount: number,
    testLengthSeconds: number,
    wpm: number,
    accuracy: number,
    consistency: number,
    submissionDate: Timestamp
}