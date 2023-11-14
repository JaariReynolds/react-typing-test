import "./footer.scss";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch, faPalette } from "@fortawesome/free-solid-svg-icons";
import ColourPaletteLabel from "../Extras/ColourPaletteLabel";
import { colourPalettes } from "../../interfaces/ColourPalettes";
import { useUserContext } from "../../contexts/UserContext";

export interface FooterProps {
	setShowColourPalettes: React.Dispatch<React.SetStateAction<boolean>>,
	colourPaletteDivRef: React.RefObject<HTMLDivElement>
}

const Footer = ({setShowColourPalettes, colourPaletteDivRef}: FooterProps) => {
	const {selectedPaletteId} = useUserContext();


	const handleShowColourPalettes = () => {
		if (colourPaletteDivRef.current?.style.maxHeight == "max-content") 
			return;	
		
		setShowColourPalettes(true);
	};

	return (
		<div className="footer">
			<button className="footer-item palette" onClick={handleShowColourPalettes} tabIndex={-1}>
				<FontAwesomeIcon icon={faPalette} className="palette-icon standard-icon-left"/>
				palette
				<ColourPaletteLabel colourPalette={colourPalettes[selectedPaletteId]} backgroundColour={false} />
			</button>
			<a href="https://github.com/JaariReynolds/react-typing-test" target="_blank" title="github.com/JaariReynolds/react-typing-test" className="footer-item" rel="noopener noreferrer">
				<FontAwesomeIcon icon={faCodeBranch} className="standard-icon-left"/>
				<span>git v{process.env.REACT_APP_VERSION}</span>
			</a>		
		</div>
	);
};

export default Footer;