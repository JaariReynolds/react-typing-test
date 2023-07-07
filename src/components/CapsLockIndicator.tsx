import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

interface Props {
    styling: React.CSSProperties
}

const CapsLockIndicator = ({styling}: Props) => {
	return (
		<div style={styling} className="capslock-indicator-container">
			<div className="capslock-indicator-contents">
				<FontAwesomeIcon icon={faLock} className="capslock-icon"/>
				Caps Lock
			</div>
		</div>
	);
};

export default CapsLockIndicator;