import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

interface Props {
    opacityStyle: React.CSSProperties,
    reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
}

const ResetButton = ({opacityStyle, reset, setReset}: Props) => {
	return (
			
		<div style={opacityStyle} className="reset-container">
			<button type="reset" title="Reset" className="reset-button"
				onClick={() => setReset(!reset)}>
				<FontAwesomeIcon icon={faRefresh} className="fa-spin-custom results-screen"/>
			</button>
		</div>
	);
};

export default ResetButton;