import React from "react";
import "../styles/componentStyles/capslock-indicator.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

export interface CapsLockIndicatorProps {
	testComplete: boolean,
	capsLockOpacity: number
}

const CapsLockIndicator = ({testComplete, capsLockOpacity}: CapsLockIndicatorProps) => {
	return (
		<div style={{opacity: testComplete ? 0 : capsLockOpacity}} className="capslock-indicator-container">
			<div className="capslock-indicator-contents">
				<FontAwesomeIcon icon={faLock} className="capslock-icon"/>
				Caps Lock
			</div>
		</div>
	);
};

export default CapsLockIndicator;