/* eslint-disable linebreak-style */
// each letter/word can have an associated completion status
export enum CompletionStatus {
    None = 0, 
    Correct = 1,
    Incorrect = 2
  }
  
// each letter has its own status that can be calculated after the letter has been compared
export class Letter {
	letter = "";
	status: CompletionStatus = CompletionStatus.None;

	constructor(letter: string, status?: CompletionStatus) {
		this.letter = letter;
		this.status = (status === undefined) ? CompletionStatus.None : status;
	}
}

// each word has its own status that can be calculated after the entire word has been compared
export class Word {
	word: Letter[] = [];
	wordString = "";
	status: CompletionStatus = CompletionStatus.None;
	originalLength = 0;
	errorCountHard = 0;
	errorCountSoft = 0;

	// create a letter object for each character in the word
	constructor(word: string, status?: CompletionStatus) {
		this.wordString = word;
		this.originalLength = word.length;
		this.status = (status === undefined) ? CompletionStatus.None : status;

		for (const letter of word) {
			this.word.push(new Letter(letter));
		}
	}
}

// can add the test results to this e.g. accuracy, wpm, errors, typing consistency, etc.
export interface TestWords {
    words: Word[]
    errorCountHard: number // ONLY submitted incorrect character strokes
    errorCountSoft: number // submitted AND backspaced incorrect character strokes
    characterCount: number
    keystrokeCharacterCount: number
    timeElapsedMilliSeconds: number
} 


