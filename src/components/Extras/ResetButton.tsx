import "./reset-button.scss";

import React, {RefObject, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

export interface ResetButtonProps {
	resetButtonRef: RefObject<HTMLButtonElement>,
    reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
	resultsComponentOpacity: number,
	resetDivMargin: string
}

const ResetButton = ({resetButtonRef, reset, setReset, resultsComponentOpacity, resetDivMargin}: ResetButtonProps) => {
	const [toolTipOpacity, setToolTipOpacity] = useState<number>(0);
	const spinningStyle = (resultsComponentOpacity == 1) ? "spinning-icon" : "";

	return (
		<div style={{marginTop: resetDivMargin}} className="reset-container" tabIndex={-1}>
			<button ref={resetButtonRef} 
				type="reset"
				className="reset-button"
				onClick={() => setReset(!reset)}
				onMouseEnter={() => setToolTipOpacity(1)}
				onMouseLeave={() => setToolTipOpacity(0)}
			>
				<FontAwesomeIcon icon={faRotateRight} className={`reset-icon ${spinningStyle}`}/>
			</button>
			<div style={{opacity: toolTipOpacity}} className="reset-button-text">
				reset test
			</div>
		</div>
	);
};

export default ResetButton;