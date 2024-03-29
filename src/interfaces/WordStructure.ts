/* eslint-disable linebreak-style */

import { TestMode, TestType } from "../enums";


// each letter/word can have an associated completion status
export enum CompletionStatus {
    None = 0, 
    Correct = 1,
    Incorrect = 2
  }

export enum LetterActiveStatus {
	Inactive = 0,
	Active = 1,
	ActiveLast = 2 // when the word is complete and the current 'letter' is anticipating a 'spacebar'
}
  
// each letter has its own status that can be calculated after the letter has been compared
export class Letter {
	letter = "";
	status: CompletionStatus = CompletionStatus.None;
	active = LetterActiveStatus.Inactive;

	constructor(letter: string, active: LetterActiveStatus, status?: CompletionStatus) {
		this.letter = letter;
		this.active = active;
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
	active = false;
	isLastWordInLine = false;

	// create a letter object for each character in the word
	constructor(word: string, status?: CompletionStatus) {
		this.wordString = word;
		this.originalLength = word.length;
		this.status = (status === undefined) ? CompletionStatus.None : status;

		for (const letter of word) {
			this.word.push(new Letter(letter, LetterActiveStatus.Inactive));
		}
	}
}

export interface NumberPair {
	interval: number;
	wpm: number;
}

// can add the test results to this e.g. accuracy, wpm, errors, typing consistency, etc.
export interface TestInformation {
    words: Word[]
    errorCountHard: number // ONLY submitted incorrect character strokes
    errorCountSoft: number // submitted AND backspaced incorrect character strokes
    characterCount: number // number of characters (including spaces) in the test
	keyPressCount: number // number of (actually pressed) character-contributing keys for the test
    timeElapsedMilliSeconds: number
	rawWPMArray: NumberPair[] // WPM (not averaged) at each second of the test
	currentAverageWPMArray: NumberPair[]
	averageWPM: number // wpmArray averaged
	accuracy: number // (characterCount - errorCountHard) / characterCount
	consistency: number
	experience: number
	testType: TestType,
	testMode: TestMode,
	includeNumbers: boolean,
	includePunctuation: boolean
} 


