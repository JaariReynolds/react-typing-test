import "./colour-palette-selector.scss";

import React, { RefObject, useEffect, useState, memo } from "react";
import { colourPalettes } from "../../interfaces/ColourPalettes";
import { useUserContext } from "../../contexts/UserContext";
import ColourPaletteLabel from "./ColourPaletteLabel";
import { randomIntegerInclusive } from "../../functions/helperFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

export interface ColourPaletteSelectorProps {

	showColourPalettes: boolean,
	colourPaletteDivRef: RefObject<HTMLDivElement>
}

const ColourPaletteSelector = ({showColourPalettes, colourPaletteDivRef}: ColourPaletteSelectorProps) => {
	const {selectedPaletteId, setSelectedPaletteId} = useUserContext();
	const [containerMaxHeight, setContainerMaxHeight] = useState<string>("0rem");

	// set container height to 0 only AFTER component opacity has fully faded out
	useEffect(() => {
		const opacityFadeDuration = 150;
		if (!showColourPalettes) {
			setTimeout(() => {
				setContainerMaxHeight("0rem");
			}, opacityFadeDuration);
			return;
		}
		setContainerMaxHeight("max-content");
	}, [showColourPalettes]);

	const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedPaletteId(parseInt(event.target.value));
	};

	

	const handleRandomise = () => {
		const randomPaletteIndex = randomIntegerInclusive(0, colourPalettes.length-1);
		console.log(randomPaletteIndex);
		setSelectedPaletteId(randomPaletteIndex);
	};

	const selectedStylingClass = (paletteId: number) => {
		return (paletteId === selectedPaletteId ? "selected" : "");
	};


	const colourPaletteStyling = {
		maxHeight: containerMaxHeight,
		opacity: showColourPalettes ? 1 : 0
	} as React.CSSProperties;

	return (
		<div style={colourPaletteStyling} ref={colourPaletteDivRef} className="colour-palette-container">
			<div className="colour-palette-div">
				{colourPalettes.map((palette, index) => {
					return (
						<div key={index} className={`colour-palette-option ${selectedStylingClass(index)}`}>
							<label htmlFor={"colour" + index}>
								<input
									type="radio"
									id={"colour" + index}
									value={index}
									checked={index === selectedPaletteId}
									onChange={handleOptionChange}
									className="hidden-radio-button"
								/>
								<ColourPaletteLabel colourPalette={palette} backgroundColour={true}/>
							</label>
						</div>	
					);
				})}
				<button style={{backgroundColor: "black"}} className="colour-palette-option" onClick={handleRandomise}>	
					<FontAwesomeIcon icon={faQuestion} style={{fontSize: "1.7rem", color: "white"}} />							
				</button>
			</div>
		</div>
	);
};

export default memo(ColourPaletteSelector);