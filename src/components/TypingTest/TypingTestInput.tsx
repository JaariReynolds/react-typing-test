import React from "react";

interface Props {
    inputRef: React.RefObject<HTMLInputElement>,
    currentInputWord: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    testComplete: boolean,
	testFocused: boolean,
    setTestFocused: (value: React.SetStateAction<boolean>) => void
}

export const TypingTestInput = ({inputRef, currentInputWord, handleChange, handleKeyDown, handleKeyUp, testComplete, testFocused, setTestFocused}: Props) => {

	const testFocus = () => {
		if (inputRef.current) 
			inputRef.current.focus();
	};

	const testBlur = () => {
		if (inputRef.current) 
			inputRef.current.blur();
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
				onClick={testFocus}
				tabIndex={-1}
				onMouseDown={(event) => {event.preventDefault();}} // disable select/highlight of input field 
			/>
		</div>
	);
};