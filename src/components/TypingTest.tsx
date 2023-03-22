/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-key */
/* eslint-disable linebreak-style */
import React, { useEffect, useState, useRef } from "react"; 
import { testWordsGenerator } from "../functions/testWordsGenerators";
import { CompletionStatus, Word, Letter, TestWords } from "../interfaces/WordStructure";

const SPACEBAR = "Spacebar";

interface IProps {
    testWords: TestWords,
    setTestWords: React.Dispatch<React.SetStateAction<TestWords>>,	
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

	const containsIncorrect = (letterArray: Letter[]): boolean => {
		const isIncorrectWord = letterArray.reduce((accumulator, letterObject) => {
			if (letterObject.status === CompletionStatus.Incorrect) 
				return true;
			return accumulator;
		}, false);
		
		return isIncorrectWord;
	};

	// add additional letter to letter array, set wordstatus to incorrect
	const addAdditionalLetter = (wordObject: Word, character: string): Word => {
		const newLetter: Letter = {letter: character, status: CompletionStatus.Incorrect};
		const letterArray = wordObject.word;
		letterArray.push(newLetter);
		return {...wordObject, word: letterArray, status: CompletionStatus.Incorrect, errorCountSoft: wordObject.errorCountSoft + 1};
	};

	// remove additional letter from letter array, set new wordstatus accordingly 
	const removeAdditionalLetter = (wordObject: Word): Word => {
		const letterArray = wordObject.word;
		if (letterArray.length > 0) 
			letterArray.pop();

		const wordStatus = containsIncorrect(letterArray) ? CompletionStatus.Incorrect : CompletionStatus.Correct;

		return {...wordObject, word: letterArray, status: wordStatus};
	};

	// remove existing letter status from letter array, set new wordstatus accordingly 
	const removeExistingLetter = (wordObject: Word, inputWord: string): Word => {
		const removedLetter = {...wordObject.word[inputWord.length]};
		removedLetter.status = CompletionStatus.None;

		const letterArray = wordObject.word;
		letterArray[inputWord.length] = removedLetter;

		const wordStatus = containsIncorrect(letterArray) ? CompletionStatus.Incorrect : CompletionStatus.None;
		return {...wordObject, word: letterArray, status: wordStatus};
	};

	// update existing letter status from letter array, set new wordstatus accordingly 
	const addExistingLetter = (wordObject: Word, currentInputWord: string): Word => {
		let wordStatus = CompletionStatus.None;
		let softErrors = 0;
		const currentInputLetterIndex = currentInputWord.length - 1; 

		const updatedWord = wordObject.word.map((letterObject, letterIndex) => {
			console.log(`compared ${letterObject.letter} to ${currentInputWord[currentInputLetterIndex]} at index ${currentInputLetterIndex}`);
			// if not the index of current input character, return same object
			if (letterIndex !== currentInputLetterIndex) {
				return letterObject;
			}

			// if end of the word and every letter before that is correct, set wordstatus to correct aswell
			if (letterObject.letter === currentInputWord[letterIndex] && wordObject.originalLength === currentInputWord.length && wordObject.status === CompletionStatus.None) {
				wordStatus = CompletionStatus.Correct;
				return {...letterObject, status: CompletionStatus.Correct};
			}

			// if letter is correct, set corrrect letter. if word previously set to incorrect, keep it as incorrect
			if (letterObject.letter === currentInputWord[letterIndex]) {
				if (wordObject.status === CompletionStatus.Incorrect) 
					wordStatus = CompletionStatus.Incorrect;
		
				return {...letterObject, status: CompletionStatus.Correct};
			}

			// if letter, at any point in the word, is typed incorrectly, set wordstatus to incorrect as well
			if (letterObject.letter !== currentInputWord[letterIndex]) {
				wordStatus = CompletionStatus.Incorrect;
				softErrors += 1;				
				return {...letterObject, status: CompletionStatus.Incorrect};			
			}

			// hopefully will never hit this, but need it because i have no default return and am just unsure if the above cases cover everything
			return letterObject;
			
		});

		return {...wordObject, word: updatedWord, status: wordStatus, errorCountSoft: wordObject.errorCountSoft + softErrors};
	};

	// figure out what to do based on input
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!testRunning) {
			startTestStopWatch();
		}     

		// if spacebar pressed, insert current word to array, clear current word, clear pressed keys just in case
		if (pressedKeys[pressedKeys.length-1] === SPACEBAR && e.target.value.trim().length > 0) { // (.length - 1) means its the only character currently pressed at the time
			//calculateWordCompletion();
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

		let currentTestWord = testWords.words[inputWordsArray.length];

		// if backspacing an existing character
		if (pressedKeys[pressedKeys.length - 1] === "Backspace" && currentInputWord.length > 0 && currentInputWord.length <= testWords.words[inputWordsArray.length].originalLength) {
			console.log("removing status on previous letter");
			//handleExistingLetter(e.target.value, false);    
			currentTestWord = removeExistingLetter(currentTestWord, e.target.value);
		} 
		// if backspacing an additional character    
		else if (pressedKeys[pressedKeys.length - 1] === "Backspace" && currentInputWord.length > testWords.words[inputWordsArray.length].originalLength) {
			console.log("backspacing an additional letter");
			//handleAdditionalLetter(e.target.value, false);
			currentTestWord = removeAdditionalLetter(currentTestWord);
		} 
		// if updating an existing character
		else if (e.target.value.length <= testWords.words[inputWordsArray.length].originalLength) {
			console.log("updating status on existing letter");
			//handleExistingLetter(e.target.value, true);
			currentTestWord = addExistingLetter(currentTestWord, e.target.value);
		} 
		// if adding/updating an additional character
		else if (e.target.value.length > testWords.words[inputWordsArray.length].originalLength) {
			console.log("adding additional letter");
			//handleAdditionalLetter(e.target.value, true);
			currentTestWord = addAdditionalLetter(currentTestWord, e.target.value.slice(-1));
		}

		const newTestWords = testWords.words;
		newTestWords[inputWordsArray.length] = currentTestWord;

		setTestWords(previousState => (
			{...previousState, words: newTestWords}
		));
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
                       
						<span>Word: {word.wordString}, Status: {word.status}, OriginalLength: {word.originalLength},  ErrorCountSoft: {word.errorCountSoft}, ErrorCountHard: {word.errorCountHard}</span>
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