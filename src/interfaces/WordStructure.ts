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

    // // method to call when the word is "submitted" to the input array, calculates the overall completion based on each letter's completion
    // CalculateWordCompletion = () => {
    //     let completion: CompletionStatus = CompletionStatus.Correct

    //     this.word.map(letterObject => {
    //         switch (letterObject.status) {
    //             case CompletionStatus.Correct:
    //                 return 
    //             case CompletionStatus.Incorrect:
    //                 completion = CompletionStatus.Incorrect
    //                 return
    //             case CompletionStatus.None:
    //                 completion = CompletionStatus.Incorrect
    //                 letterObject.status = CompletionStatus.Incorrect
    //                 return       
    //         }
    //     })

    //     this.status = completion
    // }
}

// can add the test results to this e.g. accuracy, wpm, errors, typing consistency, etc.
export class TestWords {
    words: Word[] = []
    errorCount: number = 0

    // currently not used but might be useful in the future 
    constructor(wordArray?: Word[]) {
        this.words = (wordArray === undefined) ? [] : wordArray
    }
    
} 


