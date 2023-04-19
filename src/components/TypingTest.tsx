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
    punctuation: boolean,
    reset: boolean,
	setShowResultsComponent: React.Dispatch<React.SetStateAction<boolean>>,
	testRunning: boolean,
	setTestRunning: React.Dispatch<React.SetStateAction<boolean>>,
	testTimeMilliSeconds: number,
	setTestTimeMilliSeconds: React.Dispatch<React.SetStateAction<number>>,
	setTestCompletionPercentage: React.Dispatch<React.SetStateAction<number>>,
	testComplete: boolean,
	setTestComplete: React.Dispatch<React.SetStateAction<boolean>>
}

const TypingTest = ({testWords, setTestWords, testLength, numbers, punctuation, reset, setShowResultsComponent, testRunning, setTestRunning, testTimeMilliSeconds, setTestTimeMilliSeconds, setTestCompletionPercentage, testComplete, setTestComplete}: IProps) => {
	const [currentInputWord, setCurrentInputWord] = useState<string>("");
	const [inputWordsArray, setInputWordsArray] = useState<string[]>([]);
	const [intervalId, setIntervalId] = useState<NodeJS.Timer|null>(null);	
	const [pressedKeys, setPressedKeys] = useState<string[]>([]); // array because more than 1 key can be held down at once
	const [quickReset, setQuickReset] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [lastWord, setLastWord] = useState<boolean>(false);
	const [opacity, setOpacity] = useState<number>(1);

	const opacityStyle = {
		"--typing-test-opacity": opacity,
	} as React.CSSProperties;

	// randomise words, reset states if dependencies change
	useEffect(() => {
		setOpacity(0);
		stopTestStopWatch();
		setTestTimeMilliSeconds(0);
		setTestComplete(false);
		
		setShowResultsComponent(false);
		setInputWordsArray([]);
		setCurrentInputWord("");
		setPressedKeys([]);		

		// small delay to have a opacity fade-in-out when the test is reset
		setTimeout(() => {
			setTestWords(testWordsGenerator(testLength, numbers, punctuation));
			if (inputRef.current) {
				inputRef.current.focus();
			}
			
			setOpacity(1);
			console.log("randomise test words, reset states");
		}, 150);
	
	}, [testLength, numbers, punctuation, reset, quickReset]);

	// calculates percentage of test completed (for completion bar) whenever the test is updated
	useEffect(() => {
		const totalInputLetters = inputWordsArray.reduce((total, word) => {
			return total + word.length; 
		}, currentInputWord.length + inputWordsArray.length);

		setTestCompletionPercentage(totalInputLetters / testWords.characterCount * 100);

	}, [inputWordsArray, currentInputWord]);

	// test is finished when pressing space on last word or if the last word is correct - using checkLastWord()
	useEffect(() => {
		if (inputWordsArray.length === testWords.words.length) {
			stopTestStopWatch();
			return;
		}

		if (inputWordsArray.length === testWords.words.length - 1) 
			setLastWord(true);			
		else 
			setLastWord(false);			
	}, [inputWordsArray.length]);

	const checkLastWord = () => {
		const lastWord = testWords.words[testWords.words.length - 1];
		if (lastWord.status === CompletionStatus.Correct) 
			stopTestStopWatch();
	};

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

		setTestWords({...testWords, timeElapsedMilliSeconds: testTimeMilliSeconds, errorCountHard: calculateTotalErrorsHard(), errorCountSoft: calculateTotalErrorsSoft()});
		setTestComplete(true);
		setShowResultsComponent(true);
		clearInterval(intervalId);       
		setTestRunning(false);
		setIntervalId(null);
		console.log(testWords);
	};

	// calculate the total num of hard errors in a word after pressing 'space'
	const calculateWordErrorsHard = (wordIndex: number) => {
		const wordObject = testWords.words[wordIndex];

		// if the word isn't finished, set remaining letters to incorrect 
		wordObject.word = wordObject.word.map(letter => {
			if (letter.status === CompletionStatus.None) {
				wordObject.status = CompletionStatus.Incorrect;
				return {...letter, status: CompletionStatus.Incorrect};
			}
			
			return letter;
		});

		// tally total number of hard errors
		const wordErrorCount = wordObject.word.reduce((total, letter) => {
			if (letter.status === CompletionStatus.Incorrect) 
				total += 1;
			
			return total;
		}, 0);

		const newWordObject: Word = {...wordObject, errorCountHard: wordErrorCount};
		const newTestWords = testWords.words;
		newTestWords[wordIndex] = newWordObject;
		setTestWords(previousState => ({
			...previousState, words: newTestWords
		}));
	};

	// when going back to the previous incorrect word, recalculate the letter statuses IF less letters than the word
	const recalculateLettersStatus = (inputWord: string, wordIndex: number) => {

		// clear current status of letters in the word 
		const wordObject = testWords.words[wordIndex];
		wordObject.word = wordObject.word.map(letter => {
			return {...letter, status: CompletionStatus.None};
		});

		// re-set the status of letters based on the recovered word
		wordObject.word = wordObject.word.map((letterObject, letterIndex) => {
			if (letterIndex >= inputWord.length) 
				return letterObject;

			if (inputWord[letterIndex] === letterObject.letter) 
				return {...letterObject, status: CompletionStatus.Correct};
			else 
				return {...letterObject, status: CompletionStatus.Incorrect};
			
		});

		// recalculate word correctness based on letters
		wordObject.status = containsIncorrect(wordObject.word) ? CompletionStatus.Incorrect : CompletionStatus.None; 

		const newTestWords = testWords.words;
		newTestWords[wordIndex] = wordObject;
		setTestWords(previousState => ({
			...previousState, words: newTestWords
		}));

	};

	const calculateTotalErrorsHard = (): number => {
		return testWords.words.reduce((total, word) => total + word.errorCountHard, 0);
	};

	const calculateTotalErrorsSoft = (): number => {
		return testWords.words.reduce((total, word) => total + word.errorCountSoft, 0);
	};

	// should clear every character's status in the current word + remove additional letters
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

	// used when backspacing a letter and checking if the new word is correct/incorrect
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
			//console.log(`compared ${letterObject.letter} to ${currentInputWord[currentInputLetterIndex]} at index ${currentInputLetterIndex}`);
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
			calculateWordErrorsHard(inputWordsArray.length);
			setInputWordsArray([...inputWordsArray, currentInputWord]);
			setCurrentInputWord("");
			setPressedKeys([]);
			return;
		}     

		// if i still somehow get passed the previous check, do another check :) 
		if (e.target.value.slice(-1) === " ") { 
			return;
		}

		// hard limit on word length to not clog up the screen with incorrect letters
		if (e.target.value.length == 15) { 
			return;
		}

		// if holding control and then pressing a key that would have otherwise triggered this function call, return because it shouldnt ever count (i think)
		// ctrl + backspace handled in handleKeyDown(), ctrl + z DISABLED
		if (pressedKeys.includes("Control")) { 
			return;
		}

		setCurrentInputWord(e.target.value);
        

		let currentTestWord = testWords.words[inputWordsArray.length];
		
		// #region Character Handling Block
		// if backspacing an existing character
		if (pressedKeys[pressedKeys.length - 1] === "Backspace" && currentInputWord.length > 0 && currentInputWord.length <= testWords.words[inputWordsArray.length].originalLength) {
			//console.log("removing status on previous letter");
			currentTestWord = removeExistingLetter(currentTestWord, e.target.value);
		} 
		// if backspacing an additional character    
		else if (pressedKeys[pressedKeys.length - 1] === "Backspace" && currentInputWord.length > testWords.words[inputWordsArray.length].originalLength) {
			//console.log("backspacing an additional letter");
			currentTestWord = removeAdditionalLetter(currentTestWord);
		} 
		// if updating an existing character
		else if (e.target.value.length <= testWords.words[inputWordsArray.length].originalLength) {
			//console.log("updating status on existing letter");
			currentTestWord = addExistingLetter(currentTestWord, e.target.value);
		} 
		// if adding/updating an additional character
		else if (e.target.value.length > testWords.words[inputWordsArray.length].originalLength) {
			//console.log("adding additional letter");
			currentTestWord = addAdditionalLetter(currentTestWord, e.target.value.slice(-1));
		}

		const newTestWords = testWords.words;
		newTestWords[inputWordsArray.length] = currentTestWord;

		setTestWords(previousState => (
			{...previousState, words: newTestWords}
		));
		// #endregion

		if (lastWord) checkLastWord();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// if tab, disable
		if (e.key === "Tab") {
			e.preventDefault();
			if (!pressedKeys.includes("Tab"))
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
			setLastWord(false);

			if (recoveredWord.length < testWords.words[inputWordsCopy.length].originalLength) 
				recalculateLettersStatus(recoveredWord, inputWordsCopy.length);		

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

	const letterColour = (completionStatus: CompletionStatus) => {
		switch (completionStatus) {
		case CompletionStatus.None:
			return "base-text-colour";
		case CompletionStatus.Correct:
			return "correct-text-colour";
		case CompletionStatus.Incorrect:
			return "incorrect-text-colour";
		} 
	};

	return (    
		<div className="typing-test">
			<div className="text-field-container">
				<input 
					type="text"
					ref={inputRef}
					value={currentInputWord}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onKeyUp={handleKeyUp}
					className="text-field"
					disabled={testComplete}
					
				/>
			</div>
			<div style={opacityStyle} className="words-container">
				{testWords.words.map(word => {
					return (
						<div className="word">
							{word.word.map(letter => {
								return (
									<span className={`letter ${letterColour(letter.status)}`}>
										{letter.letter}
									</span>
								);}
							)}
						</div> 
					);
				})}
			</div>
						
			{/* <div>CharacterCount = {testWords.characterCount}</div> */}
			
			
			{/* <div>
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
				lastWord: {lastWord.toString()}
			</div>
			<div>
                ErrorCountHard: {testWords.errorCountHard}, ErrorCountSoft: {testWords.errorCountSoft}, testWordsTestTime: {testWords.timeElapsedMilliSeconds}, CharacterCount: {testWords.characterCount}
			</div> */}
			{/* <div>
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
			</div> */}
		</div>  
	);
};

export default TypingTest;