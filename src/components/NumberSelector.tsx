import React from "react";

interface IProps {
    numbers: boolean,
    setNumbers: (prop: boolean) => void,
	opacityStyle: React.CSSProperties
}

const NumberSelector = ({numbers, setNumbers, opacityStyle}: IProps) => {
	const renderOptions = () => {
		return (
			<div style={opacityStyle} className="test-option-selector">
				<span className="option-text">
					<input
						type="checkbox"
						id="numbers"
						checked={numbers}
						onChange={() => setNumbers(!numbers)} 
						className="hidden peer"
					/>
					<label htmlFor="numbers" className="selectable-label">
						Numbers
					</label>
				</span>
			</div>
		);
	};
	return (
		<div>
			{renderOptions()}
		</div>
	);
};

export default NumberSelector;