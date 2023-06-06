import React from "react";

interface Props {
    inputRef: React.RefObject<HTMLInputElement>,
    currentInputWord: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    testComplete: boolean,
    setTestFocused: (value: React.SetStateAction<boolean>) => void
}

export const TypingTestInput = ({inputRef, currentInputWord, handleChange, handleKeyDown, handleKeyUp, testComplete, setTestFocused}: Props) => {

	return (
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
	);
};