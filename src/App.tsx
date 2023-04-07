import React, { useEffect, useState } from "react";
import "./App.css";
import TypingTest from "./components/TypingTest";
import TestLengthSelector from "./components/TestLengthSelector";
import PunctuationSelector from "./components/PunctuationSelector";
import NumberSelector from "./components/NumberSelector";
import TypingTestResults from "./components/TypingTestResults";
import { TestWords } from "./interfaces/WordStructure";
import { COMPONENT_FADE_DURATION } from "./constants/constants";


function App() {
	const [testWords, setTestWords] = useState<TestWords>({words: [], errorCountHard: 0, errorCountSoft: 0, timeElapsedMilliSeconds: 0, characterCount: 0, keystrokeCharacterCount: 0});
	const [testLength, setTestLength] = useState<number>(25);
	const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
	const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
	const [reset, setReset] = useState<boolean>(false);
	const [showResultsComponent, setShowResultsComponent] = useState<boolean>(false);
	const [testRunning, setTestRunning] = useState<boolean>(false);
	const [componentOpacity, setComponentOpacity] = useState<number>(1);
	
	// hide distracting components when test is running
	useEffect(() => {
		setComponentOpacity(testRunning ? 0 : 1);
	}, [testRunning]);

	return (
		<div className="App">
			<div className="flex items-center justify-center">
				<div className="grid grid-cols-3 gap-1 w-4/5">
					<div className="col-span-full h-10"></div>
					<div className={`col-span-1 text-center pr-4 select-none transition-opacity opacity-${componentOpacity} duration-${COMPONENT_FADE_DURATION}`}>
						<TestLengthSelector testLength={testLength} setTestLength={setTestLength}/>
					</div>
					<div className={`col-span-1 text-center pr-4 transition-opacity opacity-${componentOpacity} duration-${COMPONENT_FADE_DURATION}`}>
						<NumberSelector numbers={includeNumbers} setNumbers={setIncludeNumbers}/>
					</div>
					<div className={`col-span-1 text-center pr-4 transition-opacity opacity-${componentOpacity} duration-${COMPONENT_FADE_DURATION}`}>
						<PunctuationSelector punctuation={includePunctuation} setPunctuation={setIncludePunctuation}/>
					</div>
					<div className="col-span-full bg-blue-500 rounded text-center">
						<button onClick={() => setReset(!reset)}>Reset</button>
					</div>
					<div className="col-span-full select-none h-96">
						<TypingTest testWords={testWords} setTestWords={setTestWords} testLength={testLength} numbers={includeNumbers} punctuation={includePunctuation} reset={reset} setShowResultsComponent={setShowResultsComponent} testRunning={testRunning} setTestRunning={setTestRunning}/>
					</div>
					{showResultsComponent && 
						<div className="col-span-full bg-blue-500 rounded h-96">
							<TypingTestResults testWords={testWords} setTestWords={setTestWords}/>
						</div>
					}
				</div>
			</div>
		</div>
   
	);
}

export default App;
