import React, { useState } from 'react';
import './App.css';
import TypingTest from './components/TypingTest';
import TestLengthSelector from './components/TestLengthSelector';
import PunctuationSelector from './components/PunctuationSelector';
import NumberSelector from './components/NumberSelector';
import { TestWords, Word, Letter, CompletionStatus } from './interfaces/WordStructure';

function App() {
  const [testWords, setTestWords] = useState<TestWords>({words: [], errorCount: 0, timeElapsedMilliSeconds: 0});
  const [testLength, setTestLength] = useState<number>(25)
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false)
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false)
  const [reset, setReset] = useState<boolean>(false)

 
  
  return (
    <div className="App">
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-3 gap-1 w-4/5">
          <div className="col-span-1 bg-blue-500 rounded text-center pr-4">
            <TestLengthSelector testLength={testLength} setTestLength={setTestLength}/>
          </div>
          <div className="col-span-1 bg-blue-500 rounded text-center pr-4">
            <NumberSelector numbers={includeNumbers} setNumbers={setIncludeNumbers}/>
          </div>
          <div className="col-span-1 bg-blue-500 rounded text-center pl-4">
            <PunctuationSelector punctuation={includePunctuation} setPunctuation={setIncludePunctuation}/>
          </div>
          <div className="col-span-full bg-blue-500 rounded text-center">
           <button onClick={() => setReset(!reset)}>Reset</button>
          </div>

          <div className="col-span-full bg-blue-500 rounded h-96">
            <TypingTest testWords={testWords} setTestWords={setTestWords} testLength={testLength} numbers={includeNumbers} punctuation={includePunctuation} reset={reset}/>
          </div>
         
        </div>
      </div>
    </div>
   
  );
}

export default App;
