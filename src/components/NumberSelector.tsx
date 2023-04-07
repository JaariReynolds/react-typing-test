import React from "react";
import { FONT_COLOURS } from "../constants/constants";

interface IProps {
    numbers: boolean,
    setNumbers: (prop: boolean) => void
}

const NumberSelector = ({numbers, setNumbers}: IProps) => {
	const renderOptions = () => {
		return (
			<>
				<label className={`${FONT_COLOURS.BASE_FONT_COLOUR} hover:cursor-pointer`}>
                  
					<input
						type="checkbox"
						checked={numbers}
						onChange={() => setNumbers(!numbers)} 
						className="hidden peer"
					/>
					<span className={`font-semibold peer-checked:${FONT_COLOURS.SELECTED_FONT_COLOUR} peer-checked:transition-colors duration-200`}>
						Numbers
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

export default NumberSelector;