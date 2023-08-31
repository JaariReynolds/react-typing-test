import { useEffect } from "react";
import { colourPalettes } from "../../interfaces/ColourPalettes";

const UpdateCssVariablePaletteObject = (selectedPaletteId: number) => {
	useEffect(() => {
		document.body.style.backgroundColor = colourPalettes[selectedPaletteId].backgroundColour;
    
		document.documentElement.style.setProperty("--background-colour", colourPalettes[selectedPaletteId].backgroundColour);
		document.documentElement.style.setProperty("--base-font-colour", colourPalettes[selectedPaletteId].baseFontColour);
		document.documentElement.style.setProperty("--primary-highlight-colour", colourPalettes[selectedPaletteId].primaryHighlightColour);
		document.documentElement.style.setProperty("--secondary-highlight-colour", colourPalettes[selectedPaletteId].secondaryHighlightColour);
    
	}, [selectedPaletteId]);
};

export default UpdateCssVariablePaletteObject;
