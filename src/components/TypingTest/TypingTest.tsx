/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-key */
/* eslint-disable linebreak-style */
import "./typing-test.scss";

import React, { useEffect, useState, useRef, RefObject, memo } from "react"; 
import { testWordsGenerator } from "../../functions/wordGeneration/testWordsGenerators";
import { CompletionStatus, NumberPair } from "../../interfaces/WordStructure";
import { calculateCorrectCharacters } from "../../functions/calculations/calculateCorrectCharacters";
import { calculateTotalErrorsHard, calculateTotalErrorsSoft, calculateWordErrorsHard } from "../../functions/calculations/calculateErrors";
import { removeAdditionalLetter, removeExistingLetter} from "../../functions/letterHandling/removeLetter";
import { addExistingLetter, addAdditionalLetter } from "../../functions/letterHandling/addLetter";
import { calculateLettersStatus } from "../../functions/calculations/calculateLetterStatus";
import { ctrlBackspace } from "../../functions/letterHandling/ctrlBackspace";
import { updateActiveLetter } from "../../functions/letterHandling/updateActiveLetter";
import { TRANSITION_DELAY } from "../../App";
import { TypingTestWords, TypingTestWordsProps } from "./TypingTestWords";
import { TypingTestInput, TypingTestInputProps } from "./TypingTestInput";
import { TestType } from "../../enums";
import { useTestInformationContext } from "../../contexts/TestInformationContext";

const SPACEBAR = "Spacebar";
const TIMED_TEST_LENGTH = 70; // starting length of test (in words) for a timed test
const WORDS_TO_ADD = 20;
const AVERAGE_WORD_LENGTH = 5; // standard length used to calculate WPM
const AFK_SECONDS_THRESHOLD = 7;
const EXCLUDED_FINAL_MILLISECONDS = 400;

export interface TypingTestProps {
	reset: boolean,
	setReset: React.Dispatch<React.SetStateAction<boolean>>,
	inputRef: RefObject<HTMLInputElement>,
	testRunning: boolean,
	setTestRunning: React.Dispatch<React.SetStateAction<boolean>>,
	testComplete: boolean,
	setTestComplete: React.Dispatch<React.SetStateAction<boolean>>,
	testFocused: boolean,
	setTestFocused: React.Dispatch<React.SetStateAction<boolean>>,
	pressedKeys: string[],
	setPressedKeys: React.Dispatch<React.SetStateAction<string[]>>,
	averageWPM: number,
	setAverageWPM: React.Dispatch<React.SetStateAction<number>>,
	setWPMOpacity: React.Dispatch<React.SetStateAction<number>>,
	setComponentOpacity: React.Dispatch<React.SetStateAction<number>>,
	setIsAfkMidTest: React.Dispatch<React.SetStateAction<boolean>>,
	caretVisible: boolean,
	setCaretVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const TypingTest = ({
	reset,
	setReset,
	inputRef,
	testRunning,
	setTestRunning,
	testComplete,
	setTestComplete,
	testFocused,
	setTestFocused,
	pressedKeys,
	setPressedKeys,
	averageWPM,
	setAverageWPM,
	setWPMOpacity,
	setComponentOpacity,
	setIsAfkMidTest,
	caretVisible,
	setCaretVisible}: TypingTestProps) => {
	const {testInformation, setTestInformation, setShowResultsComponent, testLengthWords, testLengthSeconds, testType, includeNumbers, includePunctuation, setTestCompletionPercentage} = useTestInformationContext();

	const [testTimeMilliSeconds, setTestTimeMilliSeconds] = useState<number>(0);
	const [currentInputWord, setCurrentInputWord] = useState<string>("");
	const [inputWordsArray, setInputWordsArray] = useState<string[]>([]);
	const [intervalId, setIntervalId] = useState<NodeJS.Timer|null>(null);	
	const [lastWord, setLastWord] = useState<boolean>(false);
	const [opacity, setOpacity] = useState<number>(1);
	const totalCorrectCharactersRef = useRef(0);
	const previousSecondCorrectCharactersRef = useRef(0);
	const [keyPressCount, setKeyPressCount] = useState<number>(0);
	const [rawWPMArray, setRawWPMArray] = useState<NumberPair[]>([]);
	const [currentAverageWPMArray, setCurrentAverageWPMArray] = useState<NumberPair[]>([]);
	const [caretPosition, setCaretPosition] = useState<number>(0); // in 'px' to determine 'left' property of css class
	
	const [generalKeyPressCount, setGeneralKeyPressCount] = useState<number>(0);
	const [generalKeyPressCountArray, setGeneralKeyPressCountArray] = useState<number[]>([]);

	useEffect(() => {
		if (testComplete) 
			setOpacity(0);
	}, [testComplete]);

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
		setLastWord(false);
		setAverageWPM(0);
		setWPMOpacity(0);
		setKeyPressCount(0);
		setGeneralKeyPressCount(0);
		setGeneralKeyPressCountArray([]);

		localStorage.setItem("isSubmitted", "false");

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
				setTestInformation(testWordsGenerator(testLengthWords, includeNumbers, includePunctuation, TestType.Words));
				break;
			case TestType.Time:
				setTestInformation(testWordsGenerator(TIMED_TEST_LENGTH, includeNumbers, includePunctuation, TestType.Time));
				break;
			}

			totalCorrectCharactersRef.current = 0;
			previousSecondCorrectCharactersRef.current = 0;
			setRawWPMArray([]);
			setCurrentAverageWPMArray([]);
			setShowResultsComponent(false);


			if (inputRef.current) {
				inputRef.current.focus();
				setTestFocused(true);
			}
			
			setOpacity(1);
		
		}, TRANSITION_DELAY + 50);

		// if afk last test, show 'notification' for it for 5 seconds after the auto reset
		setTimeout(() => {
			setIsAfkMidTest(false);	
		}, 5000);
	
	}, [testLengthWords, testLengthSeconds, testType, includeNumbers, includePunctuation, reset]);

	// calculates percentage of test completed (FOR WORD-LENGTH TEST) whenever the test is updated
	useEffect(() => {
		if (inputWordsArray.length == testInformation.words.length) return; // dont run effect if last word has been submitted

		if (testType === TestType.Words && testRunning) {			
			const currentOriginalWordLength = testInformation.words[inputWordsArray.length].originalLength;
			const currentWordLength = (currentInputWord.length > currentOriginalWordLength) ? currentOriginalWordLength : currentInputWord.length;

			// for stored words, return the original length regardless if the user-pressed character count is different
			const totalInputLetters = inputWordsArray.reduce((total, word, wordIndex) => {
				return total + testInformation.words[wordIndex].originalLength; 
			}, currentWordLength); 
			setTestCompletionPercentage(totalInputLetters / testInformation.characterCount * 100);
		}

		// setting the currently active letter, used for the text caret	
		const newTestWords = updateActiveLetter(testInformation, currentInputWord, inputWordsArray);

		setTestInformation({...testInformation, words: newTestWords});
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
		
		if (testTimeMilliSeconds % 1000 === 0) {
			calculateCurrentSecondWPM();
			const newGeneralKeyPressCountArray = [...generalKeyPressCountArray, generalKeyPressCount];
			setGeneralKeyPressCountArray(newGeneralKeyPressCountArray);

			if (newGeneralKeyPressCountArray.length > AFK_SECONDS_THRESHOLD) {
				afkDetection(newGeneralKeyPressCountArray);
			}
		}	
	}, [testTimeMilliSeconds]);

	
	const afkDetection = (keyPressArray: number[]) => {
		// if the last few seconds (AFK_SECONDS_THRESHOLD) all have the same key press count, force reset 
		const lastFewSeconds = keyPressArray.slice(-AFK_SECONDS_THRESHOLD);
		const mostRecentKeyPressCount = lastFewSeconds[lastFewSeconds.length - 1];
		const isAfk = lastFewSeconds.every(perSecondKeyPress => perSecondKeyPress === mostRecentKeyPressCount);
		
		if (isAfk) {
			setIsAfkMidTest(isAfk);
			setReset(!reset);
		}
	};

	// every second, calculate and store in an array the WPM for THAT second only (not averaged yet)
	const calculateCurrentSecondWPM = () => {
		previousSecondCorrectCharactersRef.current = totalCorrectCharactersRef.current;
		totalCorrectCharactersRef.current = calculateCorrectCharacters(testInformation);

		const currentSecondCorrectCharacters = Math.max(0, totalCorrectCharactersRef.current - previousSecondCorrectCharactersRef.current);
		const currentSecondWPM = currentSecondCorrectCharacters / AVERAGE_WORD_LENGTH * 60;	
		const elapsedTimeSeconds = testTimeMilliSeconds / 1000;
	
		// once testTypes are properly defined, dont really need to initialise values for these variables and will no longer need else if's
		let newAverageWPM = 0;
		let newRawWPMArray: NumberPair[] = [];
		let newAverageWPMPair: NumberPair = {interval: 0, wpm: 0}; 			
			
		if (testType === TestType.Time) {
			newRawWPMArray = [...rawWPMArray, {interval: testLengthSeconds - (testTimeMilliSeconds/1000), wpm: currentSecondWPM}];
			newAverageWPM = Math.round(newRawWPMArray.reduce((total, current) => total + current.wpm, 0) / (testLengthSeconds - elapsedTimeSeconds));
			newAverageWPMPair = {interval: testLengthSeconds - elapsedTimeSeconds, wpm: newAverageWPM};
		}
		else if (testType === TestType.Words) {
			newRawWPMArray = [...rawWPMArray, {interval: elapsedTimeSeconds, wpm: currentSecondWPM}];
			newAverageWPM = Math.round(newRawWPMArray.reduce((total, current) => total + current.wpm, 0) / elapsedTimeSeconds);
			newAverageWPMPair = {interval: elapsedTimeSeconds, wpm: newAverageWPM};
		}
			
		setAverageWPM(newAverageWPM);
		setRawWPMArray(newRawWPMArray);	
		setCurrentAverageWPMArray([...currentAverageWPMArray, newAverageWPMPair]);
	};

	// forcing WPM calculation for the final (< 1 second) stretch of a NON-TIMED test
	const calculateFinalSecondWPM = () => {
		previousSecondCorrectCharactersRef.current = totalCorrectCharactersRef.current;
		totalCorrectCharactersRef.current = calculateCorrectCharacters(testInformation);

		const currentSecondCorrectCharacters = totalCorrectCharactersRef.current - previousSecondCorrectCharactersRef.current;
		const elapsedTimeSeconds = testTimeMilliSeconds / 1000;
		const currentSecondWPM = Math.round(currentSecondCorrectCharacters / AVERAGE_WORD_LENGTH * 60 / (elapsedTimeSeconds % 1));	
		
		const newRawWPMArray = [...rawWPMArray, {interval: elapsedTimeSeconds, wpm: currentSecondWPM}];
		setRawWPMArray(newRawWPMArray);	

		// since average here is a per second calculation, round elapsedTimeSeconds UP to nearest whole second since currentSecondWPM is also normalised to it's whole-second equivalent
		const newAverageWPM = Math.round(newRawWPMArray.reduce((total, current) => total + current.wpm, 0) / Math.ceil(elapsedTimeSeconds));
		setAverageWPM(newAverageWPM);

		const newCurrentAverageWPMArray = [...currentAverageWPMArray, {interval: elapsedTimeSeconds, wpm: newAverageWPM}];
		setCurrentAverageWPMArray(newCurrentAverageWPMArray);

		finaliseTest(newRawWPMArray, newCurrentAverageWPMArray, newAverageWPM);
		
	};

	useEffect(() => {
		if (testRunning && testType === TestType.Words) {
			// test is finished when pressing space on last word (FOR WORD-LENGTH TEST) - one of two ways to finish a word length test
			if (inputWordsArray.length === testInformation.words.length) {
				setTestComplete(true);
				return;
			}

			if (inputWordsArray.length === testInformation.words.length - 1) 
				setLastWord(true);			
			else 
				setLastWord(false);		
		}
		else if (testRunning && testType === TestType.Time) {
			// add words to the end of the word array if almost reaching the current limit (FOR TIME-LENGTH TEST)
			if (inputWordsArray.length === testInformation.words.length - WORDS_TO_ADD) {
				const extraTestWords = testWordsGenerator(WORDS_TO_ADD, includeNumbers, includePunctuation, TestType.Time);
				setTestInformation(prevTestWords => ({ 
					...prevTestWords,
					words: [...prevTestWords.words, ...extraTestWords.words],
					characterCount: prevTestWords.characterCount + extraTestWords.characterCount
				}));
			}
		}
		
	}, [inputWordsArray.length]);

	// only show results component (after a short delay) when the test is completed
	useEffect(() => {
		if (testType == TestType.Words && testComplete) 
			setTestCompletionPercentage(100); // force to 100 incase of rounding errors 

		if (testComplete) {
			stopTestStopWatch();
			// '> EXCLUDED_FINAL_MILLISECONDS' meaning DONT include the final milliseconds of the test if it is less than (amount) as it can result in very skewed wpm for the final wpm stored 
			if (testType !== TestType.Time && testTimeMilliSeconds % 1000 !== 0 && testTimeMilliSeconds % 1000 > EXCLUDED_FINAL_MILLISECONDS) 
				calculateFinalSecondWPM(); // calls finaliseTest() within, with updated wpm parameters
			else 
				finaliseTest();		
		} 
	}, [testComplete]);

	// store values into the test object that have been calculated here before sending to Results component
	const finaliseTest = (updatedRaw?: NumberPair[], updatedCurrent?: NumberPair[], updatedAverage?: number): void => {
		
		// parameters only provided to this function if test finished on a partial second, otherwise, use respective state variable
		setTestInformation({
			...testInformation,
			errorCountHard: calculateTotalErrorsHard(testInformation),
			errorCountSoft: calculateTotalErrorsSoft(testInformation),
			timeElapsedMilliSeconds: (testType === TestType.Time ? testLengthSeconds * 1000 : testTimeMilliSeconds),
			keyPressCount: keyPressCount,
			rawWPMArray: updatedRaw ?? rawWPMArray,
			currentAverageWPMArray: updatedCurrent ?? currentAverageWPMArray,
			averageWPM:	updatedAverage ?? averageWPM
		});
	};

	// test can also be finished if last word in the test is fully correct (FOR WORD-LENGTH TEST)
	const checkLastWord = (): void => {
		if (testType !== TestType.Words) return;
		const lastWord = testInformation.words[testInformation.words.length - 1];
		if (lastWord.status === CompletionStatus.Correct) {
			setTestComplete(true);
		}
	};

	const startTestStopWatch = (): void => {
		if (intervalId !== null) return;
		
		setTestRunning(true);
		setIsAfkMidTest(false);
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
	};

	// calculate the total num of hard errors in a word after pressing 'space'
	const updateWordErrorsHard = (wordIndex: number) => {
		const newTestWords = testInformation.words;
		newTestWords[wordIndex] = calculateWordErrorsHard(wordIndex, testInformation);
		setTestInformation(previousState => ({
			...previousState, words: newTestWords
		}));
	};

	// when going back to the previous incorrect word, recalculate the letter statuses IF less letters than the word
	const recalculateLettersStatus = (inputWord: string, wordIndex: number) => {
		setTestInformation(previousState => ({
			...previousState, words: calculateLettersStatus(inputWord, wordIndex, testInformation)
		}));
	};

	// should clear every character's status in the current word + remove additional letters
	const handleCtrlBackspace = () => {
		setCurrentInputWord("");
		setTestInformation({...testInformation, words: ctrlBackspace(testInformation, inputWordsArray)});
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
        
		let currentTestWord = testInformation.words[inputWordsArray.length];

		// #region Character Handling Block
		// if backspacing an existing character
		if (pressedKeys[pressedKeys.length - 1] === "Backspace" && currentInputWord.length > 0 && currentInputWord.length <= testInformation.words[inputWordsArray.length].originalLength) {
			currentTestWord = removeExistingLetter(currentTestWord, e.target.value);
		} 
		// if backspacing an additional character    
		else if (pressedKeys[pressedKeys.length - 1] === "Backspace" && currentInputWord.length > testInformation.words[inputWordsArray.length].originalLength) {
			currentTestWord = removeAdditionalLetter(currentTestWord);
		} 
		// if updating an existing character
		else if (e.target.value.length <= testInformation.words[inputWordsArray.length].originalLength) {
			currentTestWord = addExistingLetter(currentTestWord, e.target.value);
			setKeyPressCount(prev => prev + 1);
		} 
		// if adding/updating an additional character
		else if (e.target.value.length > testInformation.words[inputWordsArray.length].originalLength) {
			currentTestWord = addAdditionalLetter(currentTestWord, e.target.value.slice(-1));
			setKeyPressCount(prev => prev + 1);
		}

		const newTestWords = testInformation.words;
		newTestWords[inputWordsArray.length] = currentTestWord;

		setTestInformation(previousState => (
			{...previousState, words: newTestWords}
		));
		// #endregion

		if (lastWord) checkLastWord();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

		setGeneralKeyPressCount(prev => prev + 1); // used only for afk detection

		if (e.key === "Tab") {
			setComponentOpacity(1);   
			if (!pressedKeys.includes("Tab")) 
				setPressedKeys([...pressedKeys, e.key]);     
			
			return;   
		}

		// if shift + backspace pressed (shift first), clear the status on all letters in the input/word
		if (pressedKeys.length === 1 && pressedKeys.includes("Control") && e.key === "Backspace" && currentInputWord.length > 0) {
			handleCtrlBackspace();
			return;
		}
		// if spacebar, need a special case as its key is an empty string ("")
		if (e.key === " " && !pressedKeys.includes(SPACEBAR)) { 
			setPressedKeys([...pressedKeys, SPACEBAR]);
			return;
		} 
		
		// if backspace when input is empty, bring back previous word as the current word IF that word is incorrect
		if (e.key === "Backspace" && currentInputWord.length === 0 && inputWordsArray.length > 0 && testInformation.words[inputWordsArray.length-1].status === CompletionStatus.Incorrect) {
			const inputWordsCopy = inputWordsArray;
			const recoveredWord: string = inputWordsCopy.pop()!;
			setInputWordsArray([...inputWordsCopy]);
			setCurrentInputWord(recoveredWord);
			setLastWord(false);

			if (recoveredWord.length < testInformation.words[inputWordsCopy.length].originalLength) 
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

	const typingTestInputProps: TypingTestInputProps = {
		inputRef, currentInputWord, handleChange, handleKeyDown, handleKeyUp, testComplete, setTestFocused, setCaretVisible
	};

	const typingTestWordsProps: TypingTestWordsProps = {
		testRunning, testComplete, testFocused, inputWordsArray, reset, caretPosition, setCaretPosition, currentInputWord, inputRef, opacity, caretVisible
	};

	return (    	
		<div className="typing-test">
			<TypingTestInput {...typingTestInputProps}/>
			<TypingTestWords {...typingTestWordsProps}/>		
		</div>  
	);
};

export default memo(TypingTest);