export interface ColourPaletteStructure {
    paletteId: number
    backgroundColour: string,
    baseFontColour: string,
    primaryHighlightColour: string,
	secondaryHighlightColour: string
	
}

export const colourPalettes: ColourPaletteStructure[] = [
	{
		paletteId: 0,
		backgroundColour: "#2f3234",
		baseFontColour: "#a1a1aa",
		primaryHighlightColour: "#fde047",
		secondaryHighlightColour: "#3d76c4"
	},
	{
		paletteId: 1,
		backgroundColour: "orangered",
		baseFontColour: "blueviolet",
		primaryHighlightColour: "beige",
		secondaryHighlightColour: "#991118"
	},
	{
		paletteId: 2,
		backgroundColour: "black",
		baseFontColour: "yellow",
		primaryHighlightColour: "white",
		secondaryHighlightColour: "#0d0f78"
	}
];