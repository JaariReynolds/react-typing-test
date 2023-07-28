export interface ColourPaletteStructure {
    paletteId: number
    backgroundColour: string,
    baseFontColour: string,
    highlightColour: string
}

export const colourPalettes: ColourPaletteStructure[] = [
	{
		paletteId: 0,
		backgroundColour: "#2f3234",
		baseFontColour: "#a1a1aa",
		highlightColour: "#fde047"
	},
	{
		paletteId: 1,
		backgroundColour: "orange",
		baseFontColour: "purple",
		highlightColour: "green"
	},
	{
		paletteId: 2,
		backgroundColour: "black",
		baseFontColour: "yellow",
		highlightColour: "white"
	}
];