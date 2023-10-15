export interface UserDocument {
    email: string,
    username: string,
    testSummaries: TestTypeSummary[],
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

export interface TestTypeSummary {
    submissionCount: number,
    averageWpm: number,
    averageAccuracy: number,
    averageConsistency: number,
    highestWpm: number
}