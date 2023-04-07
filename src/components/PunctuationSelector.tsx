import React from "react";
import { FONT_COLOURS } from "../constants/constants";

interface IProps {
    punctuation: boolean,
    setPunctuation: (prop: boolean) => void
}

const PunctuationSelector = ({punctuation, setPunctuation}: IProps) => {
    
	const renderOptions = () => {
		return (
			<>
				<label className={`${FONT_COLOURS.BASE_FONT_COLOUR} hover:cursor-pointer`}>
					<input
						type="checkbox"
						checked={punctuation}
						onChange={() => setPunctuation(!punctuation)}
						className="hidden peer"
					/>
					<span className={`font-semibold peer-checked:${FONT_COLOURS.SELECTED_FONT_COLOUR} peer-checked:transition-colors duration-200`}>
						Punctuation
					</span>
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