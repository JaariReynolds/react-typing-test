import "../styles/componentStyles/reset-button.scss";

import React, {RefObject, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

export interface ResetButtonProps {
	resetButtonRef: RefObject<HTMLButtonElement>,
    opacityStyle: React.CSSProperties,
    reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
	resultsComponentOpacity: number
}

const ResetButton = ({resetButtonRef, opacityStyle, reset, setReset, resultsComponentOpacity}: ResetButtonProps) => {

	const spinningStyle = (resultsComponentOpacity == 1) ? "spinning-icon" : "";
	const [toolTipOpacity, setToolTipOpacity] = useState<number>(0);

	const hoverTextStyling = {
		"--reset-button-text-opacity": toolTipOpacity,
	} as React.CSSProperties;

	return (
		<div style={opacityStyle} className="reset-container" tabIndex={-1}>
			<button ref={resetButtonRef} 
				type="reset"
				className="reset-button"
				onClick={() => setReset(!reset)}
				onMouseEnter={() => setToolTipOpacity(1)}
				onMouseLeave={() => setToolTipOpacity(0)}
			>
				<FontAwesomeIcon icon={faRotateRight} className={`reset-icon ${spinningStyle}`}/>
			</button>
			<div style={hoverTextStyling} className="reset-button-text">
				reset test
			</div>
		</div>
	);
};

export default ResetButton;