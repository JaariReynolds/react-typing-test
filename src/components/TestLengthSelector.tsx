/* eslint-disable react/jsx-key */
import React from "react";
import { FONT_COLOURS } from "../constants/constants";


interface IProps {
    testLength: number,
    setTestLength: (prop: number) => void
}

const TestLengthSelector = ({testLength, setTestLength}: IProps) => {
	const testLengthWords: number[] = [5, 25, 50, 100];

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestLength(parseInt(event.target.value));
	};

	const renderOptions = () => {
		return (
			<>
				{testLengthWords.map(length => {
					return (
						<label className={`${FONT_COLOURS.BASE_FONT_COLOUR} hover:cursor-pointer`}>							
							<input
								type="radio"
								value={length}
								checked={testLength===length}
								onChange={handleOptionChange}
								className="hidden peer"
							/>
							<span className={`p-2 m-1 font-semibold peer-checked:${FONT_COLOURS.SELECTED_FONT_COLOUR} peer-checked:transition-colors duration-200`}>
								{length}
							</span>
						</label>
					);
				})}
			</>
		);
	};

	return (
		<div>
			{renderOptions()}
		</div>
      
	);

};

export default TestLengthSelector;