/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-key */
/* eslint-disable linebreak-style */
import React, { useEffect, useState, useRef } from "react"; 
import { testWordsGenerator } from "../functions/testWordsGenerators";
import { CompletionStatus, Letter, TestWords } from "../interfaces/WordStructure";

const SPACEBAR = "Spacebar";

interface IProps {
    testWords: TestWords,
    setTestWords: (prop: TestWords) => void,
    testLength: number,
    numbers: boolean,
    punctuation: boolean
    reset: boolean
}

const TypingTest = ({testWords, setTestWords, testLength, numbers, punctuation, reset}: IProps) => {
	const [currentInputWord, setCurrentInputWord] = useState<string>("");
	const [inputWordsArray, setInputWordsArray] = useState<string[]>([]);

	const [testRunning, setTestRunning] = useState<boolean>(false);
	const [testTimeMilliSeconds, setTestTimeMilliSeconds] = useState<number>(0);
	const [intervalId, setIntervalId] = useState<NodeJS.Timer|null>(null);
    
	const [pressedKeys, setPressedKeys] = useState<string[]>([]); // array because more than 1 key can be held down at once
	const [quickReset, setQuickReset] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// randomise words, reset states if dependencies change
	useEffect(() => {
      
		setTestWords(testWordsGenerator(testLength, numbers, punctuation));
		if (inputRef.current) {
			inputRef.current.focus();
		}
        
		setInputWordsArray([]);
		setCurrentInputWord("");
		setPressedKeys([]);
		stopTestStopWatch();
		setTestTimeMilliSeconds(0);

		console.log("randomise test words, reset states");
        
	}, [testLength, numbers, punctuation, reset, quickReset]);

   
	// TEST IS FINISHED
	useEffect(() => {
		if (inputWordsArray.length === testWords.words.length) {
			console.log(`"Length of test = ${inputWordsArray.length}"`);
			stopTestStopWatch();
		}

	}, [inputWordsArray.length]);


	const startTestStopWatch = (): void => {
		if (intervalId !== null) return;

		setTestRunning(true);
		const id = setInterval(() => {
			setTestTimeMilliSeconds(previousTime => previousTime + 10);
		}, 10);
		setIntervalId(id);
	};

	const stopTestStopWatch = (): void => {
		if (intervalId === null) return;

		setTestWords({...testWords, timeElapsedMilliSeconds: testTimeMilliSeconds, errorCountHard: calculateTotalErrors()});
		clearInterval(intervalId);       
		setTestRunning(false);
		setIntervalId(null);
		console.log(testWords);
	};

	const calculateTotalErrors = (): number => {
		return testWords.words.reduce((total, word) => total + word.errorCountHard, 0);
        
	};

	const handleCtrlBackspace = () => {
		const updatedTestWords = testWords.words.map((wordObject, wordIndex) => {
			if (wordIndex !== inputWordsArray.length) {
				return wordObject;
			}

			const updatedLetters = wordObject.word
				.filter((letter, index) => {
					return index < wordObject.originalLength;
				})
				.map(letterObject => {
					return {...letterObject, status: CompletionStatus.None};
				});
            
			return {...wordObject, word: updatedLetters, status: CompletionStatus.None};
		});
		setTestWords({...testWords, words: updatedTestWords});
	};

	// when 'submitting' a word that has less characters than expected, assign a status to the remaining letters 
	const calculateWordCompletion = () => {
		let wordStatus = CompletionStatus.Correct;
		let wordErrorCount = 0;
		const updatedTestWords = testWords.words.map((wordObject, wordIndex) => {
			if (wordIndex !== inputWordsArray.length) {
				return wordObject;
			}
			const updatedLetters = wordObject.word.map(letterObject => {
				if (letterObject.status === CompletionStatus.None) {
					wordStatus = CompletionStatus.Incorrect;
					wordErrorCount += 1;
					return {...letterObject, status: CompletionStatus.Incorrect};
				} 
				else if (letterObject.status === CompletionStatus.Incorrect) {
					wordStatus = CompletionStatus.Incorrect;
					wordErrorCount +=1;
					return letterObject;
				} 
				else {
					return letterObject;
				}       
			});
            
			if (wordObject.wordString.length !== currentInputWord.length) {
				wordStatus = CompletionStatus.Incorrect;
			}
            
			return {...wordObject, word: updatedLetters, status: wordStatus, errorCount: wordErrorCount};
		});
        
        
		setTestWords({...testWords, words: updatedTestWords});
	};

	// this should be run every time a letter is added/removed
	const calculateActualWordCompletion = () => {
		// for each letter in the word
		// if it contains an incorrect, make word.status = incorrect
		// if inputword.length === word.original length and no incorrects, word.status = correct
		// if no incorrects but the word not finished yet, word.status = none

	};


	// when backspacing to the previous word, fix the status of letters that were auto-assigned a status because a letter wasn't typed for them
	const recalculateWordCompletion = (recoveredWord: string) => {
		const updatedWord = {...testWords.words[inputWordsArray.length]};

		const updatedLetters = updatedWord.word.map((letterObject, letterIndex) => {
			if (recoveredWord[letterIndex] === letterObject.letter && letterIndex < updatedWord.originalLength) {
				return {...letterObject, status: CompletionStatus.Correct}; 
			} 
			else if (recoveredWord[letterIndex] === undefined) {
				return {...letterObject, status: CompletionStatus.None};
			}

			return {...letterObject, status: CompletionStatus.Incorrect};
		});

		updatedWord.word = updatedLetters;
		const updatedTestWords = [...testWords.words];
		updatedTestWords[inputWordsArray.length] = {...updatedWord, status: CompletionStatus.None, errorCountHard: 0}; // always reset the word completion status to None, recalculate it when 'submitting' again
		setTestWords({...testWords, words: updatedTestWords});

	};

	// update the completionStatus on the currently active letter object 
	// character: true if a character pressed that adds length to the input
	const handleExistingLetter = (currentInput: string, character: boolean) => {      
		const currentWordLength = (character) ? currentInput.length-1 : currentInput.length; // letter compared to depends on if a character is added or if backspace is pressed
		const currentLetter = testWords.words[inputWordsArray.length].word[currentWordLength]; // get the current letter object from word object based on the input length
		const updatedWord = {...testWords.words[inputWordsArray.length]};

		let newStatus: CompletionStatus = CompletionStatus.None;
		let softError = testWords.errorCountSoft;
		if (character)
        
			if (currentInput.slice(-1) === currentLetter.letter) { // slice(-1) gets the newest input character
				newStatus = CompletionStatus.Correct;
			}
			else {
				newStatus = CompletionStatus.Incorrect;
				softError += 1;
			}

		updatedWord.word[currentWordLength] = {...updatedWord.word[currentWordLength], status: newStatus};
		const updatedTestWords = [...testWords.words];

        
		// calculate current word completion status 
		if (newStatus === CompletionStatus.Incorrect) {
			updatedTestWords[inputWordsArray.length] = {...updatedWord, status: CompletionStatus.Incorrect};
		} 
		else if (currentWordLength === updatedWord.originalLength && newStatus === CompletionStatus.Correct) {
			updatedTestWords[inputWordsArray.length] = {...updatedWord, status: CompletionStatus.Correct};
		}
		else {
			updatedTestWords[inputWordsArray.length] = {...updatedWord, status: CompletionStatus.None};
		}
  
		setTestWords({...testWords, words: updatedTestWords, errorCountSoft: softError});

	};

	// add or remove an additional letter object
	// character: true = adding a letter, false = removing
	const handleAdditionalLetter = (currentInput: string, character: boolean) => {
		const additionalLetter: Letter = {letter: currentInput.slice(-1), status: CompletionStatus.Incorrect};
		const updatedWord = {...testWords.words[inputWordsArray.length]};
		const updatedTestWords = [...testWords.words];

		let softError = testWords.errorCountSoft;
		if (character) {
			updatedWord.word.push(additionalLetter);
			softError += 1;
		}
		else {
			updatedWord.word.pop();
		}

		updatedTestWords[inputWordsArray.length] = updatedWord;  
		setTestWords({...testWords, words: updatedTestWords, errorCountSoft: softError });
	};

	// figure out what to do based on input
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!testRunning) {
			startTestStopWatch();
		}     

		// if spacebar pressed, insert current word to array, clear current word, clear pressed keys just in case
		if (pressedKeys[pressedKeys.length-1] === SPACEBAR && e.target.value.trim().length > 0) { // (.length - 1) means its the only character currently pressed at the time
			calculateWordCompletion();
			setInputWordsArray([...inputWordsArray, currentInputWord]);
			setCurrentInputWord("");
			setPressedKeys([]);
			return;
		}     

		if (e.target.value.slice(-1) === " ") {
			return;
		}

		setCurrentInputWord(e.target.value);
        
		// if holding control and then pressing a key that would have otherwise triggered this function call, return because it shouldnt ever count (i think)
		// ctrl + backspace handled in handleKeyDown()
		if (pressedKeys.includes("Control")) { 
			return;
		}

		// if backspacing an existing character
		if (pressedKeys[pressedKeys.length - 1] === "Backspace" && currentInputWord.length > 0 && currentInputWord.length <= testWords.words[inputWordsArray.length].originalLength) {
			console.log("removing status on previous letter");
			handleExistingLetter(e.target.value, false);      
		} 
		// if backspacing an additional character    
		else if (pressedKeys[pressedKeys.length - 1] === "Backspace" && currentInputWord.length > testWords.words[inputWordsArray.length].originalLength) {
			console.log("backspacing an additional letter");
			handleAdditionalLetter(e.target.value, false);    
		} 
		// if updating an existing character
		else if (e.target.value.length <= testWords.words[inputWordsArray.length].originalLength) {
			console.log("updating status on existing letter");
			handleExistingLetter(e.target.value, true);
		} 
		// if adding/updating an additional character
		else if (e.target.value.length > testWords.words[inputWordsArray.length].originalLength) {
			console.log("adding additional letter");
			handleAdditionalLetter(e.target.value, true);
		}

	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        
		// if tab, disable
		if (e.key === "Tab") {
			e.preventDefault();
			setPressedKeys([...pressedKeys, e.key]);        
			return;   
		}
		// if tab + enter pressed (tab first), reset test
		if (pressedKeys.length === 1 && pressedKeys.includes("Tab") && e.key === "Enter" ) {
			console.log("tab + enter pressed");
			setQuickReset(() => !quickReset);
			return;
		}
		// if shift + backspace pressed (shift first), clear the status on all letters in the input/word
		if (pressedKeys.length === 1 && pressedKeys.includes("Control") && e.key === "Backspace" && currentInputWord.length > 0) {
			console.log("ctrl + backspace pressed");
			handleCtrlBackspace();
			setCurrentInputWord("");
			return;
		}
		// if spacebar, need a special case as its key is an empty string ("")
		if (e.key === " " && !pressedKeys.includes(SPACEBAR)) { 
			setPressedKeys([...pressedKeys, SPACEBAR]);
			return;
		} 
		
		// if backspace when input is empty, bring back previous word as the current word IF that word is incorrect
		if (e.key === "Backspace" && currentInputWord.length === 0 && inputWordsArray.length > 0 && testWords.words[inputWordsArray.length-1].status === CompletionStatus.Incorrect) {
			const inputWordsCopy = inputWordsArray;
			const recoveredWord: string = inputWordsCopy.pop()!;
			setInputWordsArray([...inputWordsCopy]);
			setCurrentInputWord(recoveredWord);
			recalculateWordCompletion(recoveredWord);
			e.preventDefault(); // disable backspace to not also delete the last letter of the inserted word
			return;
		}

		// keep this at the bottom 
		if (!pressedKeys.includes(e.key)) { // add key to the "pressed" array if not already
			setPressedKeys([...pressedKeys, e.key]);         
			return;  
		}  
	};

	const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// if spacebar, need special check
		if (e.key === " ") {
			setPressedKeys(prevKeys => prevKeys.filter(key => key !== SPACEBAR));
			return;
		}
        
		// remove any other key from the "pressed" array
		setPressedKeys(prevKeys => prevKeys.filter(key => key !== e.key ));
	};

	return (    
		<>
			<div>
				{testWords.words.map(word => {return <span>{word.wordString} </span>;})}
			</div>

			<div className="text-black">
				<input 
					type="text"
					ref={inputRef}
					value={currentInputWord}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onKeyUp={handleKeyUp}
				/>
			</div>

			<div>
                PressedKeys: 
				{pressedKeys.map(key => {return <span>{key} </span>;})}
                Len: {pressedKeys.length}
			</div>
			<div>currentInputWord: {currentInputWord}</div>
			<div>
                inputWordsArray:
				{inputWordsArray.map(word => {return <span>{word} </span>;})}
			</div>
			<div>
                errorCount: {testWords.errorCountHard}
			</div>
			<div>
                testTime: {testTimeMilliSeconds/1000}, 
			</div>
			<div>
                testRunning: {testRunning.toString()}
			</div>
			<div>
                ErrorCountHard: {testWords.errorCountHard}, ErrorCountSoft: {testWords.errorCountSoft}, testWordsTestTime: {testWords.timeElapsedMilliSeconds}, CharacterCount: {testWords.characterCount}
			</div>
			<div>
				{testWords.words.map(word => (
					<pre>
                       
						<span>Word: {word.wordString}, Status: {word.status}, OriginalLength: {word.originalLength}, ErrorCount: {word.errorCountHard}</span>
						{word.word.map(letter => (
							<pre>
								{JSON.stringify(letter)}
							</pre>
						))}
                        
					</pre>
				))}
			</div>
		</>  
	);
};

export default TypingTest;