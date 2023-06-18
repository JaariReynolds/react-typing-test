import React, {RefObject} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

interface Props {
	buttonRef: RefObject<HTMLButtonElement>,
    opacityStyle: React.CSSProperties,
    reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
	resultsComponentOpacity: number
}

const ResetButton = ({buttonRef, opacityStyle, reset, setReset, resultsComponentOpacity}: Props) => {

	const spinningStyle = (resultsComponentOpacity == 1) ? "spinning-icon" : "";
	return (
		<div style={opacityStyle} className="reset-container" tabIndex={-1}>
			<button ref={buttonRef} type="reset" title="Reset" className="reset-button"
				onClick={() => setReset(!reset)}>
				<FontAwesomeIcon icon={faRefresh} className={`reset-icon ${spinningStyle}`}/>
			</button>
		</div>
	);
};

export default ResetButton;