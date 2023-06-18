/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-key */
/* eslint-disable linebreak-style */
import React, { useEffect, useState, useRef, RefObject } from "react"; 
import { testWordsGenerator } from "../functions/wordGeneration/testWordsGenerators";
import { CompletionStatus, TestWords, NumberPair } from "../interfaces/WordStructure";
import { TestType } from "../App";
import { calculateCorrectCharacters } from "../functions/calculations/calculateCorrectCharacters";
import { calculateTotalErrorsHard, calculateTotalErrorsSoft, calculateWordErrorsHard } from "../functions/calculations/calculateErrors";
import { removeAdditionalLetter, removeExistingLetter} from "../functions/letterHandling/removeLetter";
import { addExistingLetter, addAdditionalLetter } from "../functions/letterHandling/addLetter";
import { calculateLettersStatus } from "../functions/calculations/calculateLetterStatus";
import { ctrlBackspace } from "../functions/letterHandling/ctrlBackspace";
import { updateActiveLetter } from "../functions/letterHandling/updateActiveLetter";
import { TRANSITION_DELAY } from "../App";
import { TypingTestWords } from "./TypingTestWords";
import { TypingTestInput } from "./TypingTestInput";

const SPACEBAR = "Spacebar";

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
	inputRef: RefObject<HTMLInputElement>,
	showResultsComponent: boolean,
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
	setComponentOpacity: React.Dispatch<React.SetStateAction<number>>
}


const TypingTest = ({testWords, setTestWords, testLengthWords, testLengthSeconds, testType, numbers, punctuation, reset, inputRef, showResultsComponent, setShowResultsComponent, testRunning, setTestRunning, testTimeMilliSeconds, setTestTimeMilliSeconds, setTestCompletionPercentage, testComplete, setTestComplete, testFocused, setTestFocused, pressedKeys, setPressedKeys, averageWPM, setAverageWPM, setWPMOpacity, setComponentOpacity}: IProps) => {
	const [currentInputWord, setCurrentInputWord] = useState<string>("");
	const [inputWordsArray, setInputWordsArray] = useState<string[]>([]);
	const [intervalId, setIntervalId] = useState<NodeJS.Timer|null>(null);	
	const [lastWord, setLastWord] = useState<boolean>(false);
	const [opacity, setOpacity] = useState<number>(1);
	const totalCorrectCharactersRef = useRef(0);
	const previousSecondCorrectCharactersRef = useRef(0);
	const [keyPressCount, setKeyPressCount] = useState<number>(0);
	const [testWPMArray, setTestWPMArray] = useState<NumberPair[]>([]);
	const [currentAverageWPMArray, setCurrentAverageWPMArray] = useState<NumberPair[]>([]);
	const [showWords, setShowWords] = useState<string>("block");

	const [potentialSpanShiftCount, setPotentialSpanShiftCount] = useState<number>(0);

	const opacityStyle = {
		"--typing-test-opacity": opacity,
		"--test-words-display": showWords
	} as React.CSSProperties;

	useEffect(() => {
		if (!testComplete) {		
			setShowWords("block");		
		}
		if (testComplete) {
			setOpacity(0);
			setTimeout(() => {
				setShowWords("none");
			}, 200);
		}	
	}, [showResultsComponent, testComplete]);

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
		setPotentialSpanShiftCount(0);

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
			setPotentialSpanShiftCount(1);

			if (inputRef.current) {
				inputRef.current.focus();
				setTestFocused(true);
			}
			
			setOpacity(1);
			console.log("randomise test words, reset states");
		}, TRANSITION_DELAY + 10);
	
	}, [testLengthWords, testLengthSeconds, testType, numbers, punctuation, reset]);

	useEffect(() => {
		// calculates percentage of test completed (FOR WORD-LENGTH TEST) whenever the test is updated
		if (testType === TestType.Words && testRunning) {
			if (lastWord && currentInputWord.length == 0) return; // don't run this useEffect after pressing 'space' pretty much

			const currentOriginalWordLength = testWords.words[inputWordsArray.length].originalLength;
			const currentWordLength = (currentInputWord.length > currentOriginalWordLength) ? currentOriginalWordLength : currentInputWord.length;

			// for stored words, return the original length regardless if the user-pressed character count is different
			const totalInputLetters = inputWordsArray.reduce((total, word, wordIndex) => {
				return total + testWords.words[wordIndex].originalLength; 
			}, currentWordLength + inputWordsArray.length); // inputwordsarray.length = spacebar presses (included in keypresscount)
			
			setTestCompletionPercentage(totalInputLetters / testWords.characterCount * 100);
		}

		// setting the currently active letter, used for the text caret	
		const newTestWords = updateActiveLetter(testWords, currentInputWord, inputWordsArray);

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
			// store new wpm array in variable here so we can also use it in the if else below
			const newTestWPMArray = [...testWPMArray, {interval: testLengthSeconds - (testTimeMilliSeconds/1000), wpm: currentSecondWPM}];
			setTestWPMArray(newTestWPMArray);	

			const elapsedTimeSeconds = testTimeMilliSeconds / 1000;

			if (testType === TestType.Time) {
				const averageWPM = Math.round(newTestWPMArray.reduce((total, current) => total + current.wpm, 0) / (testLengthSeconds - elapsedTimeSeconds));
				setAverageWPM(averageWPM);
				setCurrentAverageWPMArray([...currentAverageWPMArray, {interval: testLengthSeconds - elapsedTimeSeconds, wpm: averageWPM}]);
			}
			else if (testType === TestType.Words) {
				const averageWPM = Math.round(newTestWPMArray.reduce((total, current) => total + current.wpm, 0) / elapsedTimeSeconds);
				setAverageWPM(averageWPM);
				setCurrentAverageWPMArray([...currentAverageWPMArray, {interval: elapsedTimeSeconds, wpm: averageWPM}]);
			}
		}
	}, [testTimeMilliSeconds]);

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
				setPotentialSpanShiftCount(prev => prev + 1);
			}
		}
	}, [inputWordsArray.length]);

	// only show results component (after a short delay) when the test is completed
	useEffect(() => {
		if (testType == TestType.Words && testComplete) {
			setTestCompletionPercentage(100);
		}

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

	// store values into the test object that have been calculated here before sending to Results component
	const finaliseTest = (): void => {
		setTestWords({
			...testWords,
			errorCountHard: calculateTotalErrorsHard(testWords),
			errorCountSoft: calculateTotalErrorsSoft(testWords),
			timeElapsedMilliSeconds: (testType === TestType.Time ? testLengthSeconds * 1000 : testTimeMilliSeconds),
			keyPressCount: keyPressCount,
			rawWPMArray: testWPMArray,
			currentAverageWPMArray: currentAverageWPMArray,
			averageWPM:	averageWPM
		});
	};

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

		setTimeout(() => {
			setTestRunning(false);
		}, TRANSITION_DELAY);

		clearInterval(intervalId);       
		setIntervalId(null);
		console.log(testWords);
	};

	// calculate the total num of hard errors in a word after pressing 'space'
	const updateWordErrorsHard = (wordIndex: number) => {
		const newTestWords = testWords.words;
		newTestWords[wordIndex] = calculateWordErrorsHard(wordIndex, testWords);
		setTestWords(previousState => ({
			...previousState, words: newTestWords
		}));
	};

	// when going back to the previous incorrect word, recalculate the letter statuses IF less letters than the word
	const recalculateLettersStatus = (inputWord: string, wordIndex: number) => {
		setTestWords(previousState => ({
			...previousState, words: calculateLettersStatus(inputWord, wordIndex, testWords)
		}));
	};

	// should clear every character's status in the current word + remove additional letters
	const handleCtrlBackspace = () => {
		setCurrentInputWord("");
		setTestWords({...testWords, words: ctrlBackspace(testWords, inputWordsArray)});
	};

	// figure out what to do based on input
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!testRunning) {
			startTestStopWatch();
		}     

		// if spacebar pressed, insert current word to array, clear current word, clear pressed keys just in case
		if (pressedKeys[pressedKeys.length-1] === SPACEBAR && e.target.value.trim().length > 0) { // (.length - 1) means its the only character currently pressed at the time
			updateWordErrorsHard(inputWordsArray.length);
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
			setPotentialSpanShiftCount(prev => prev + 1);
		} 
		// if updating an existing character
		else if (e.target.value.length <= testWords.words[inputWordsArray.length].originalLength) {
			currentTestWord = addExistingLetter(currentTestWord, e.target.value);
			setKeyPressCount(prev => prev + 1);
		} 
		// if adding/updating an additional character
		else if (e.target.value.length > testWords.words[inputWordsArray.length].originalLength) {
			currentTestWord = addAdditionalLetter(currentTestWord, e.target.value.slice(-1));
			setPotentialSpanShiftCount(prev => prev + 1);
			setKeyPressCount(prev => prev + 1);
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
		if (e.key === "Tab") {
			setComponentOpacity(1);   
			if (!pressedKeys.includes("Tab")) 
				setPressedKeys([...pressedKeys, e.key]);     
			
			return;   
		}

		// if shift + backspace pressed (shift first), clear the status on all letters in the input/word
		if (pressedKeys.length === 1 && pressedKeys.includes("Control") && e.key === "Backspace" && currentInputWord.length > 0) {
			console.log("ctrl + backspace pressed");
			handleCtrlBackspace();
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

	return (    
		<div style={opacityStyle} className="typing-test">
			
			<TypingTestInput inputRef={inputRef} currentInputWord={currentInputWord} handleChange={handleChange} handleKeyDown={handleKeyDown} handleKeyUp={handleKeyUp} testComplete={testComplete} setTestFocused={setTestFocused}/>

			<TypingTestWords testWords={testWords} setTestWords={setTestWords} testRunning={testRunning} testComplete={testComplete} testFocused={testFocused} potentialSpanShiftCount={potentialSpanShiftCount}/>
			

			{/* <div>
				potential shift count: {potentialSpanShiftCount}
			</div> */}
			{/* <div>
				wordarray: {testWPMArray.map(pair => {
					return (
						<span>{pair.interval}: {pair.wpm}, </span>
					);
				})}
			</div>
			<div>
				currentaveragearray: {currentAverageWPMArray.map(pair => {
					return (
						<span>{pair.interval}: {pair.wpm}, </span>
					);
				})}
			</div> */}
		</div>  
	);
};

export default TypingTest;