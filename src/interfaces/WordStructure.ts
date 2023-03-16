// each letter/word can have an associated completion status
export enum CompletionStatus {
    None = 0, 
    Correct = 1,
    Incorrect = 2
  }
  
// each letter has its own status that can be calculated after the letter has been compared
export class Letter {
    letter: string = ""
    status: CompletionStatus = CompletionStatus.None

    constructor(letter: string, status?: CompletionStatus) {
        this.letter = letter
        this.status = (status === undefined) ? CompletionStatus.None : status
    }
}

// each word has its own status that can be calculated after the entire word has been compared
export class Word {
    word: Letter[] = []
    wordString: string = ""
    status: CompletionStatus = CompletionStatus.None
    originalLength: number = 0
    errorCount: number = 0

    // create a letter object for each character in the word
    constructor(word: string, status?: CompletionStatus) {
        this.wordString = word
        this.originalLength = word.length
        this.status = (status === undefined) ? CompletionStatus.None : status

        for (const letter of word) {
            this.word.push(new Letter(letter))
        }
    }
}

// can add the test results to this e.g. accuracy, wpm, errors, typing consistency, etc.
export interface TestWords {
    words: Word[]
    errorCount: number
    timeElapsedMilliSeconds: number

    // // currently not used but might be useful in the future 
    // constructor(wordArray?: Word[]) {
    //     this.words = (wordArray === undefined) ? [] : wordArray
    // }
    
} 


