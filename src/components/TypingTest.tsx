/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-key */
/* eslint-disable linebreak-style */
import React, { useEffect, useState, useRef } from "react"; 
import { testWordsGenerator } from "../functions/testWordsGenerators";
import { CompletionStatus, Word, Letter, TestWords, NumberPair } from "../interfaces/WordStructure";
import { TestType } from "../App";
import { LetterActiveStatus } from "../interfaces/WordStructure";
import { calculateCorrectCharacters } from "../functions/calculateCorrectCharacters";

const SPACEBAR = "Spacebar";
const TRANSITION_DELAY = 200;
const TIMED_TEST_LENGTH = 40;
const WORDS_TO_ADD = 10;
const AVERAGE_WORD_LENGTH = 5; // standard length used to calculate WPM

interface IProps {
    testWords: TestWords,
    setTestWords: React.Dispatch<React.SetStateAction<TestWords>>,	
    testLengthWords: number,
	testLengthSeconds: number,
	testType: TestType,
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
	setTestComplete: React.Dispatch<React.SetStateAction<boolean>>,
	testFocused: boolean,
	setTestFocused: React.Dispatch<React.SetStateAction<boolean>>,
	pressedKeys: string[],
	setPressedKeys: React.Dispatch<React.SetStateAction<string[]>>,
	averageWPM: number,
	setAverageWPM: React.Dispatch<React.SetStateAction<number>>,
	setWPMOpacity: React.Dispatch<React.SetStateAction<number>>,
}


const TypingTest = ({testWords, setTestWords, testLengthWords, testLengthSeconds, testType, numbers, punctuation, reset, setShowResultsComponent, testRunning, setTestRunning, testTimeMilliSeconds, setTestTimeMilliSeconds, setTestCompletionPercentage, testComplete, setTestComplete, testFocused, setTestFocused, pressedKeys, setPressedKeys, averageWPM, setAverageWPM, setWPMOpacity}: IProps) => {
	const [currentInputWord, setCurrentInputWord] = useState<string>("");
	const [inputWordsArray, setInputWordsArray] = useState<string[]>([]);
	const [intervalId, setIntervalId] = useState<NodeJS.Timer|null>(null);	
	const [quickReset, setQuickReset] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [lastWord, setLastWord] = useState<boolean>(false);
	const [opacity, setOpacity] = useState<number>(1);
	const totalCorrectCharactersRef = useRef(0);
	const previousSecondCorrectCharactersRef = useRef(0);
	const [keyPressCount, setKeyPressCount] = useState<number>(0);
	const [testWPMArray, setTestWPMArray] = useState<NumberPair[]>([]);
	const [currentAverageWPMArray, setCurrentAverageWPMArray] = useState<NumberPair[]>([]);


	const opacityStyle = {
		"--typing-test-opacity": opacity,
	} as React.CSSProperties;

	// randomise words, reset states if dependencies change
	useEffect(() => {
		totalCorrectCharactersRef.current = 0;
		previousSecondCorrectCharactersRef.current = 0;
		setOpacity(0);
		stopTestStopWatch();
		setTestComplete(false);
		setInputWordsArray([]);
		setCurrentInputWord("");
		setPressedKeys([]);	
		setShowResultsComponent(false);
		setLastWord(false);
		setAverageWPM(0);
		setWPMOpacity(0);
		setKeyPressCount(0);

		switch (testType) {
		case TestType.Words:
			setTestTimeMilliSeconds(0);
			setTestCompletionPercentage(0);
			break;
		case TestType.Time:
			setTestTimeMilliSeconds(testLengthSeconds * 1000);
			setTestCompletionPercentage(100);
			break;
		}

		// small delay to have a opacity fade-in-out when the test is reset
		setTimeout(() => {
			switch (testType) {
			case TestType.Words:
				setTestWords(testWordsGenerator(testLengthWords, numbers, punctuation));
				break;
			case TestType.Time:
				setTestWords(testWordsGenerator(TIMED_TEST_LENGTH, numbers, punctuation));
				break;
			}

			totalCorrectCharactersRef.current = 0;
			previousSecondCorrectCharactersRef.current = 0;
			setTestWPMArray([]);
			setCurrentAverageWPMArray([]);


			if (inputRef.current) {
				inputRef.current.focus();
				setTestFocused(true);
			}
			
			setOpacity(1);
			console.log("randomise test words, reset states");
		}, 210);
	
	}, [testLengthWords, testLengthSeconds, testType, numbers, punctuation, reset, quickReset]);

	useEffect(() => {
		// calculates percentage of test completed (FOR WORD-LENGTH TEST) whenever the test is updated
		if (testType === TestType.Words && testRunning) {
			const totalInputLetters = inputWordsArray.reduce((total, word) => {
				
				return total + word.length; 
			}, currentInputWord.length + inputWordsArray.length);
	
			setTestCompletionPercentage(totalInputLetters / testWords.characterCount * 100);
		}

		// setting the currently active letter, used for the text caret
		const newTestWords = testWords.words.map((wordObject, wordIndex) => {
			const newTestWord = wordObject.word.map((letterObject, letterIndex) => {
				if (letterIndex === currentInputWord.length && wordIndex === inputWordsArray.length) {
					return {...letterObject, active: LetterActiveStatus.Active}; // caret on left of letter
				} 
				else if (letterIndex === currentInputWord.length - 1 && wordIndex === inputWordsArray.length && currentInputWord.length >= wordObject.originalLength) {
					return {...letterObject, active: LetterActiveStatus.ActiveLast}; // caret on right of letter
				}
				else {
					return {...letterObject, active: LetterActiveStatus.Inactive}; // no caret
				}
			});

			if (wordIndex === inputWordsArray.length) {
				return {...wordObject, word: newTestWord, active: true};
			}
			else {
				return {...wordObject, word: newTestWord, active: false};
			}
		});

		setTestWords({...testWords, words: newTestWords});
	}, [inputWordsArray, currentInputWord]);

	useEffect(() => {
		if (!testRunning) return;
		// calculates percentage of test completed (FOR TIME-LENGTH TEST)
		if (testType === TestType.Time) {
			setTestCompletionPercentage(testTimeMilliSeconds / (testLengthSeconds * 1000) * 100);

			if (testTimeMilliSeconds <= 0) {
				stopTestStopWatch();
				setTestComplete(true);
			}
		}

		// every second, calculate and store in an array the WPM for THAT second only (not averaged yet)
		if (testTimeMilliSeconds % 1000 === 0) {

			previousSecondCorrectCharactersRef.current = totalCorrectCharactersRef.current;
			totalCorrectCharactersRef.current = calculateCorrectCharacters(testWords) + inputWordsArray.length;
		
			const currentSecondCorrectCharacters = totalCorrectCharactersRef.current - previousSecondCorrectCharactersRef.current;
			const currentSecondWPM = currentSecondCorrectCharacters / AVERAGE_WORD_LENGTH * 60;
			setTestWPMArray([...testWPMArray, {interval: (testTimeMilliSeconds/1000), wpm: currentSecondWPM}]);	
		}
	}, [testTimeMilliSeconds]);

	useEffect(() => {
		// calculates the average WPM every time a new (raw) wpm is stored for that second
		if (testWPMArray.length === 0) return; // no average to store on the 0th second

		const elapsedTimeSeconds = testTimeMilliSeconds / 1000;
		
		// 
		if (testType === TestType.Time) {
			const averageWPM = Math.round(testWPMArray.reduce((total, current) => total + current.wpm, 0) / (testLengthSeconds - elapsedTimeSeconds));
			setAverageWPM(averageWPM);
			setCurrentAverageWPMArray([...currentAverageWPMArray, {interval: elapsedTimeSeconds, wpm: averageWPM}]);
		}
		else if (testType === TestType.Words) {
			const averageWPM = Math.round(testWPMArray.reduce((total, current) => total + current.wpm, 0) / elapsedTimeSeconds);
			setAverageWPM(averageWPM);
			setCurrentAverageWPMArray([...currentAverageWPMArray, {interval: elapsedTimeSeconds, wpm: averageWPM}]);
		}
	}, [testWPMArray]);

	useEffect(() => {
		if (testRunning && testType === TestType.Words) {
			// test is finished when pressing space on last word (FOR WORD-LENGTH TEST)
			if (inputWordsArray.length === testWords.words.length) {
				setTestComplete(true);
				return;
			}

			if (inputWordsArray.length === testWords.words.length - 1) 
				setLastWord(true);			
			else 
				setLastWord(false);		
		}
		else if (testRunning && testType === TestType.Time) {
			// add words to the end of the word array if almost reaching the current limit (FOR TIME-LENGTH TEST)
			if (inputWordsArray.length === testWords.words.length - WORDS_TO_ADD) {
				const extraTestWords = testWordsGenerator(WORDS_TO_ADD, numbers, punctuation);
				setTestWords(prevTestWords => ({ 
					...prevTestWords,
					words: [...prevTestWords.words, ...extraTestWords.words],
					characterCount: prevTestWords.characterCount + extraTestWords.characterCount
				}));
			}
		}
	}, [inputWordsArray.length]);

	// only show results component (after a short delay) when the test is completed
	useEffect(() => {
		if (testComplete === true) {
			stopTestStopWatch();
			finaliseTest();
			setTimeout(() => {
				setShowResultsComponent(true);
			}, TRANSITION_DELAY);
		} else {
			setShowResultsComponent(false);
		}
	}, [testComplete]);

	const finaliseTest = (): void => {
		// store values into the test object that have been calculated here before sending to Results component
		setTestWords({
			...testWords,
			errorCountHard: calculateTotalErrorsHard(),
			errorCountSoft: calculateTotalErrorsSoft(),
			timeElapsedMilliSeconds: (testType === TestType.Time ? testLengthSeconds * 1000 : testTimeMilliSeconds),
			keyPressCount: keyPressCount,
			wpmArray: testWPMArray,
			currentAverageWPMArray: currentAverageWPMArray,
			averageWPM:	averageWPM
		});
	};

	// const calculateCorrectCharacters = (): void => {
	// 	// gets the number of correct letters in each word in the test
	// 	let totalCorrectLetters = 0;
	// 	testWords.words.map(wordObject => {
	// 		const totalForWord = wordObject.word.reduce((total, letter) => {
	// 			if (letter.status === CompletionStatus.Correct) 
	// 				total += 1;
	// 			return total;
	// 		}, 0);
	// 		totalCorrectLetters += totalForWord;
	// 	});

		
	// };
	
	// test can also be finished if last word in the test is fully correct (FOR WORD-LENGTH TEST)
	const checkLastWord = (): void => {
		if (testType !== TestType.Words) return;
		const lastWord = testWords.words[testWords.words.length - 1];
		if (lastWord.status === CompletionStatus.Correct) {
			setTestComplete(true);
		}
	};

	const startTestStopWatch = (): void => {
		if (intervalId !== null) return;
		
		setTestRunning(true);
		let id;

		switch (testType) {
		case TestType.Words:
			id = setInterval(() => {
				setTestTimeMilliSeconds(previousTime => previousTime + 50);
			}, 50);
			break;
		case TestType.Time:	
			id = setInterval(() => {
				setTestTimeMilliSeconds(previousTime => previousTime - 50);
			}, 50);
			break;		
		}
		setIntervalId(id);
	};

	const stopTestStopWatch = (): void => {
		if (intervalId === null) return;

		setTestWords({...testWords, timeElapsedMilliSeconds: testTimeMilliSeconds, errorCountHard: calculateTotalErrorsHard(), errorCountSoft: calculateTotalErrorsSoft()});

		setTimeout(() => {
			setTestRunning(false);
		}, TRANSITION_DELAY);

		clearInterval(intervalId);       
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
		const newLetter: Letter = {letter: character, status: CompletionStatus.Incorrect, active: LetterActiveStatus.Active};
		const letterArray = wordObject.word;
		letterArray.push(newLetter);
		
		setKeyPressCount(prev => prev + 1);

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

		setKeyPressCount(prev => prev + 1);

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
			setKeyPressCount(prev => prev + 1);
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
			currentTestWord = removeExistingLetter(currentTestWord, e.target.value);
		} 
		// if backspacing an additional character    
		else if (pressedKeys[pressedKeys.length - 1] === "Backspace" && currentInputWord.length > testWords.words[inputWordsArray.length].originalLength) {
			currentTestWord = removeAdditionalLetter(currentTestWord);
		} 
		// if updating an existing character
		else if (e.target.value.length <= testWords.words[inputWordsArray.length].originalLength) {
			currentTestWord = addExistingLetter(currentTestWord, e.target.value);
		} 
		// if adding/updating an additional character
		else if (e.target.value.length > testWords.words[inputWordsArray.length].originalLength) {
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

	const letterActive = (activeStatus: LetterActiveStatus) => {
		if (testComplete) return ""; // hide caret when test finished

		switch (activeStatus) {
		case LetterActiveStatus.Active:
			return "active";
		case LetterActiveStatus.Inactive:
			return "";
		case LetterActiveStatus.ActiveLast:
			return "active-last";
		}
	};

	const blinkingCaret = (letter: Letter) => {
		if (letter.active === LetterActiveStatus.Active || letter.active === LetterActiveStatus.ActiveLast) {
			if (!testRunning || (testRunning && !testFocused)) {
				return "awaiting-input";
			}
			return "";
		}		
		return "";			
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
					onFocus={() => setTestFocused(true)}
					
				/>
			</div>
			{/* <div>keypresscount: {keyPressCount}</div>
			<div>totalCorrectCharactersRef={totalCorrectCharactersRef.current}</div>
			<div>previousSecondCorrectCharactersRef={previousSecondCorrectCharactersRef.current}</div>
	
			
			<div>test1: {testWPMArray.map(numberPair => {
				return (
					<div>{numberPair.interval}: {numberPair.wpm}</div>
				);
			})}
			</div> */}

			<div style={opacityStyle} className="words-container">
				{testWords.words.map(word => {
					return (
						<div className="word">
							{word.word.map(letter => {
								return (
									
									<span className={`letter ${letterColour(letter.status)} ${blinkingCaret(letter)} ${letterActive(letter.active)} 
										`}>
										{letter.letter}
									</span>
									
								);}
							)}
						</div> 
					);
				})}
			</div>
			{/* <div>testTimeMilliSeconds:{testTimeMilliSeconds}</div> */}
						
			{/* <div>CharacterCount = {testWords.characterCount}</div> */}
			
			{/* 			
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
				lastWord: {lastWord.toString()}
			</div> */}
			{/* <div>
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