import "../styles/componentStyles/footer.scss";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch, faPalette } from "@fortawesome/free-solid-svg-icons";

export interface FooterProps {
    
    opacityStyle: React.CSSProperties,
	showColourPalettes: boolean,
	setShowColourPalettes: React.Dispatch<React.SetStateAction<boolean>>,
	showColourPaletteStateRef: React.MutableRefObject<boolean>,
}

const Footer = ({opacityStyle, showColourPalettes, setShowColourPalettes, showColourPaletteStateRef}: FooterProps) => {

	const handleShowColourPalettes = () => {
		setShowColourPalettes(!showColourPaletteStateRef.current);
	};

	return (
		<div className="footer" style={opacityStyle}>
			<button className="footer-item" onClick={handleShowColourPalettes} tabIndex={-1}>
				<FontAwesomeIcon icon={faPalette} className="palette-icon icon"/>
				theme
			</button>

			<a href="https://github.com/JaariReynolds/react-typing-test" target="_blank" title="github.com/JaariReynolds/react-typing-test" className="footer-item" rel="noopener noreferrer">
				<FontAwesomeIcon icon={faCodeBranch} className="icon"/>
				<span>git</span>
			</a>
			
		</div>
	);
};

export default Footer;