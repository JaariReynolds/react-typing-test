export interface UserDocument {
    email: string,
    username: string,
    selectedPaletteIndex: number,
    testSummaries: TestTypeSummary[],
    creationDate: Date,
}

export interface TimedScoreDocument {
    userId: string,
    testLengthMilliseconds: number,
    wpm: number,
    accuracy: number,
    submissionDate: Date
}

export interface WordCountScoreDocument {
    userId: string,
    wordCount: number,
    testLengthMilliseconds: number,
    wpm: number,
    accuracy: number,
    submissionDate: Date
}

export interface TestTypeSummary {
    submissionCount: number,
    averageWpm: number,
    averageAccuracy: number,
    averageConsistency: number,
    highestWpm: number
}