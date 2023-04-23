import React, { useEffect, useState } from "react";
import "./App.scss";
import TypingTest from "./components/TypingTest";
import TestLengthSelector from "./components/TestLengthSelector";
import PunctuationSelector from "./components/PunctuationSelector";
import NumberSelector from "./components/NumberSelector";
import TypingTestResults from "./components/TypingTestResults";
import { TestWords } from "./interfaces/WordStructure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";


function App() {
	const [testWords, setTestWords] = useState<TestWords>({words: [], errorCountHard: 0, errorCountSoft: 0, timeElapsedMilliSeconds: 0, characterCount: 0, keystrokeCharacterCount: 0});
	const [testLength, setTestLength] = useState<number>(25);
	const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
	const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
	const [reset, setReset] = useState<boolean>(false);
	const [showResultsComponent, setShowResultsComponent] = useState<boolean>(false);
	const [testRunning, setTestRunning] = useState<boolean>(false);
	const [testComplete, setTestComplete] = useState<boolean>(false);
	const [componentOpacity, setComponentOpacity] = useState<number>(1);
	const [testTimeMilliSeconds, setTestTimeMilliSeconds] = useState<number>(0);
	const [testCompletionPercentage, setTestCompletionPercentage] = useState<number>(0);
	
	// hide distracting components when test is running
	useEffect(() => {
		setComponentOpacity(testRunning ? 0 : 1);
	}, [testRunning]);

	const opacityStyle = {
		"--component-opacity": componentOpacity
	  } as React.CSSProperties;

	const completionBarOpacity = {
		"--completion-bar-opacity": (componentOpacity == 0) ? 1 : 0 || (showResultsComponent) ? 1 : 0,
		"--completion-percentage": testCompletionPercentage.toString() + "%"
	} as React.CSSProperties;



	return (
		<div className="App">
			<div className="main-container">
				<div className="inner-container">
					<div className="top-gap"></div>
					
					<TestLengthSelector testLength={testLength} setTestLength={setTestLength} opacityStyle={opacityStyle}/>
					<NumberSelector numbers={includeNumbers} setNumbers={setIncludeNumbers} opacityStyle={opacityStyle}/>
					<PunctuationSelector punctuation={includePunctuation} setPunctuation={setIncludePunctuation} opacityStyle={opacityStyle}/>
				
					<div style={completionBarOpacity} className="test-completion-bar"></div>
					<div>{testCompletionPercentage}</div>
					<TypingTest testWords={testWords} setTestWords={setTestWords} testLength={testLength} numbers={includeNumbers} punctuation={includePunctuation} reset={reset} setShowResultsComponent={setShowResultsComponent} testRunning={testRunning} setTestRunning={setTestRunning} testTimeMilliSeconds={testTimeMilliSeconds} setTestTimeMilliSeconds={setTestTimeMilliSeconds} setTestCompletionPercentage={setTestCompletionPercentage}
						testComplete={testComplete} setTestComplete={setTestComplete}/>
				
					<button type="reset" title="Reset" className="reset-button"
						onClick={() => setReset(!reset)}>
						<FontAwesomeIcon icon={faRefresh} className="fa-spin-custom"/>
					</button>

					{showResultsComponent && 
						<div className="col-span-full bg-blue-500 rounded">
							<TypingTestResults testWords={testWords} setTestWords={setTestWords}/>
						</div>
					}
				</div>
			</div>
		</div>
   
	);
}

export default App;
