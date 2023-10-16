export interface UserDocument {
    email: string,
    username: string,
    testSummaries: TestSummary[],
    creationDate: Date,
}

export interface TimedScoreDocument {
    username: string,
    testLengthMilliseconds: number,
    wpm: number,
    accuracy: number,
    consistency: number,
    submissionDate: Date
}

export interface WordCountScoreDocument {
    username: string,
    wordCount: number,
    testLengthMilliseconds: number,
    wpm: number,
    accuracy: number,
    consistency: number,
    submissionDate: Date
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