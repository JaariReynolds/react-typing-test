import React, {useEffect, useState} from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { NumberPair } from "../../interfaces/WordStructure";
import { ColourPaletteStructure } from "../../interfaces/ColourPalettes";


interface DataPoint {
	interval: number,
	rawWPM: number,
	averageWPM: number
}

interface Props {
	rawWPMArray: NumberPair[],
	currentAverageWPMArray: NumberPair[],
	colourPalette: ColourPaletteStructure
}

const TypingTestResultsWPMGraph = ({rawWPMArray, currentAverageWPMArray, colourPalette}: Props) => {
	
	const [graphData, setGraphData] = useState<DataPoint[]>([]);

	useEffect(() => {		
		// combines raw and average datapoints at each interval into 1 type
		const combinedArray = rawWPMArray.map((rawWPM, index) => {	
			return {interval: rawWPM.interval, rawWPM: rawWPM.wpm, averageWPM: currentAverageWPMArray[index].wpm};
		});
		setGraphData(combinedArray);	
	}, []);

	const toolTipStyle = {
		backgroundColor: colourPalette.backgroundColour,
		borderRadius: "0.5rem",
		opacity: 0.95
	} as React.CSSProperties;

	const customTooltipLabel = (label: number) => { 
		return `second: ${label}`;
	};	

	return (
		<div className="results-chart">
			<ResponsiveContainer width="90%" height={300}>
				<LineChart data={graphData}>
					<XAxis 
						tick={{fill: colourPalette.baseFontColour}}
						dataKey="interval" 
						height={40}
						label={{
							value: "Seconds", 
							dy: 15,
							fill: colourPalette.baseFontColour
						}}
					/>
					<YAxis 
						tick={{fill:colourPalette.baseFontColour}} 
						dataKey="rawWPM"
						domain={[0, "dataMax + 10"]}
						label={{
							value: "Words per Minute", 
							dx: -25, 
							angle: -90,
							fill: colourPalette.baseFontColour
						}}
					/>
					<CartesianGrid stroke={colourPalette.baseFontColour} strokeWidth={0.7} fill={colourPalette.baseFontColour} fillOpacity={0.2}/>
					<Line type="monotone" dataKey="rawWPM" name="raw" stroke={colourPalette.secondaryHighlightColour} strokeWidth={2} dot={false}/>
					<Line type="monotone" dataKey="averageWPM" name="average" stroke={colourPalette.primaryHighlightColour} strokeWidth={5} dot={false} opacity={1}/>
					<Tooltip contentStyle={toolTipStyle} cursor={false} labelFormatter={customTooltipLabel}/>
					
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default TypingTestResultsWPMGraph;