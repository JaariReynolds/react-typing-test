import React from "react";
import "./typing-test-input.scss";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { TestMode } from "../../enums";

export interface TypingTestInputProps {
    inputRef: React.RefObject<HTMLInputElement>,
    currentInputWord: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    testComplete: boolean,
    setTestFocused: React.Dispatch<React.SetStateAction<boolean>>,
	setCaretVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const TypingTestInput = ({inputRef, currentInputWord, handleChange, handleKeyDown, handleKeyUp, testComplete, setTestFocused, setCaretVisible}: TypingTestInputProps) => {
	const {testMode} = useTestInformationContext();


	const testFocus = () => {
		if (inputRef.current) {
			setTestFocused(true);
			inputRef.current.focus();
		}
	};

	const testBlur = () => {
		if (inputRef.current) {
			setTestFocused(false);
			inputRef.current.blur();
		}
	};

	const maxInputFieldLength = (): number => {
		switch (testMode) {
		case TestMode.Standard: return 15;
		case TestMode.Emojis: return 15;
		case TestMode.Alphabet: return 26;
		case TestMode.Medicine: return 17;
		case TestMode.Countries: return 24;
		}
	};

	return (
		<div className="text-field-container">
			<input 
				type="text"
				spellCheck="false"
				ref={inputRef}
				value={currentInputWord}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onKeyUp={handleKeyUp}
				maxLength={maxInputFieldLength()}
				className="text-field"
				disabled={testComplete}
				onBlur={testBlur}
				onFocus={() => setCaretVisible(true)}
				onClick={testFocus}
				tabIndex={-1}
				onMouseDown={(event) => {event.preventDefault();}} // disable select/highlight of input field 
			/>
		</div>
	);
};