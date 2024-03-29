import React, {useEffect, useState, useRef} from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { colourPalettes } from "../../interfaces/ColourPalettes";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { useUserContext } from "../../contexts/UserContext";
import "./wpm-graph.scss";

interface DataPoint {
	interval: number,
	rawWPM: number,
	averageWPM: number
}

const WpmGraph = () => {
	const {testInformation} = useTestInformationContext();
	const {selectedPaletteId} = useUserContext();
	const [graphData, setGraphData] = useState<DataPoint[]>([]);
	const yAxisMax = useRef<number>(0);
	const colourPalette = colourPalettes[selectedPaletteId];
	

	useEffect(() => {		
		// combines raw and average datapoints at each interval into 1 type
		const combinedArray = testInformation.rawWPMArray.map((rawWPM, index) => {	
			return {interval: rawWPM.interval, rawWPM: rawWPM.wpm, averageWPM: testInformation.currentAverageWPMArray[index].wpm};
		});

		// nearest ceiling of 20 (+ 10) of the max raw wpm
		yAxisMax.current = Math.ceil((Math.max(...combinedArray.map(interval => interval.rawWPM)) + 10) / 20) * 20;
		
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
				<LineChart data={graphData} width={90} margin={{top: 5, right: 50, bottom: 30, left: 15}}>
					<XAxis 
						tick={{fill: colourPalette.baseFontColour}}					
						dataKey="interval" 
						height={30}
						label={{
							value: "time",
							dy: 25,
							fill: colourPalette.baseFontColour
						}}
					/>
					<YAxis 
						tick={{fill:colourPalette.baseFontColour}} 
						dataKey="rawWPM"
						domain={[0, yAxisMax.current]}			
						label={{
							value: "words per minute", 
							dx: -35,
							angle: -90,
							fill: colourPalette.baseFontColour,
						}}
					/>
					<CartesianGrid stroke={colourPalette.baseFontColour} strokeWidth={0.7} fill={colourPalette.baseFontColour} fillOpacity={0.2} />
					<Line type="monotone" dataKey="rawWPM" name="raw" stroke={colourPalette.secondaryHighlightColour} strokeWidth={2} dot={false}/>
					<Line type="monotone" dataKey="averageWPM" name="average" stroke={colourPalette.primaryHighlightColour} strokeWidth={5} dot={false} opacity={1}/>
					<Tooltip contentStyle={toolTipStyle} cursor={false} labelFormatter={customTooltipLabel}/>
					
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default WpmGraph;