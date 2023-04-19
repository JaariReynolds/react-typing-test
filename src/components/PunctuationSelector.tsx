import React from "react";

interface IProps {
    punctuation: boolean,
    setPunctuation: (prop: boolean) => void,
	opacityStyle: React.CSSProperties
}

const PunctuationSelector = ({punctuation, setPunctuation, opacityStyle}: IProps) => {
    
	return (
		<div style={opacityStyle} className="test-option-selector">
			<span className="option-text">
				<input
					type="checkbox"
					id="punctuation"
					checked={punctuation}
					onChange={() => setPunctuation(!punctuation)}
					className="hidden peer"
				/>
				<label htmlFor="punctuation" className="selectable-label">
					Punctuation
				</label>
				
			</span>
		</div>
	);
};

export default PunctuationSelector;