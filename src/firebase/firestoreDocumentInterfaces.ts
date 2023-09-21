export interface UserDocument {
    email: string,
    username: string,
    selectedPaletteIndex: number,
    testSummaries: TestTypeSummary[],
    creationDate: Date,
}

export interface TestTypeSummary {
    submissionCount: number,
    averageWpm: number,
    averageAccuracy: number,
    averageConsistency: number,
    highestWpm: number
}