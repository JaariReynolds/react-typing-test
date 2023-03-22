import React from "react";

interface IProps {
    punctuation: boolean,
    setPunctuation: (prop: boolean) => void
}

const PunctuationSelector = ({punctuation, setPunctuation}: IProps) => {
    
	const renderOptions = () => {
		return (
			<>
				<label>
                    Punctuation:
					<input
						type="checkbox"
						checked={punctuation}
						onChange={() => setPunctuation(!punctuation)}
					/>
				</label>
			</>
		);
	};

	return (
		<div>
			{renderOptions()}
		</div>
	);
};

export default PunctuationSelector;