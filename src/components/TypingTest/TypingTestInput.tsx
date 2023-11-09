import React from "react";
import "./typing-test-input.scss";

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