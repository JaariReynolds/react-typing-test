import React, {useEffect, useState} from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { NumberPair } from "../interfaces/WordStructure";


interface DataPoint {
	interval: number,
	rawWPM: number,
	averageWPM: number
}

interface Props {
	rawWPMArray: NumberPair[],
	averageWPMArray: NumberPair[],
}

interface AxisDomain {
	lowerBound: number,
	upperBound: number
}

const MyChartComponent = ({rawWPMArray, averageWPMArray}: Props) => {
	
	const [graphData, setGraphData] = useState<DataPoint[]>([]);
	const [xMax, setXMax] = useState<number>();
	const [yDomain, setYDomain] = useState<AxisDomain>({lowerBound: 0, upperBound: 0});

	useEffect(() => {		
		// combines raw and average datapoints at each interval into 1 type
		const combinedArray = rawWPMArray.map((rawWPM, index) => {	
			return {interval: rawWPM.interval, rawWPM: rawWPM.wpm, averageWPM: averageWPMArray[index].wpm};
		});

		// gets the y axis borders
		const yDataPoints = combinedArray.map(valuePoint => 
			[valuePoint.averageWPM, valuePoint.rawWPM]
		).flat();
		
		setYDomain({lowerBound: Math.min(...yDataPoints) - 10, upperBound: Math.max(...yDataPoints) + 10});

		setGraphData(combinedArray);	
	}, []);

	const toolTipStyle = {
		backgroundColor: "rgb(47, 50, 52)",
		borderRadius: "0.5rem",
		opacity: 0.9
	} as React.CSSProperties;

	const customTooltipLabel = (label: any) => {
		if (label === 1) {
		  return "Label A"; // Customize the label for data point with name 'A'
		}
		return label; // Return the original label for other data points
	  };

	
	return (
		<div className="results-chart">
			<ResponsiveContainer width="90%" height={300}>
				<LineChart data={graphData}>
					<XAxis 
						tick={{fill: "rgb(161 161 170)"}}
						//type="number"
						//tickCount={xMax as number + 1}
						
						//domain={[1, xMax as number]}
						dataKey="interval" 
						height={40}
						label={{
							value: "Seconds", 
							dy: 15,
							fill:"rgb(161 161 170)"
						}}
					/>
					<YAxis 
						tick={{fill:"rgb(161 161 170)"}} 
						dataKey="rawWPM"
						domain={[0, "dataMax + 10"]}
						width={40}
						label={{
							value: "Words per Minute", 
							dx: -20, 
							angle: -90,
							fill:"rgb(161 161 170)"
							 
							
						}}
					/>
					<CartesianGrid stroke="rgb(161 161 170)" strokeWidth={0.7} fill="rgb(161 161 170)" fillOpacity={0.2}/>
					<Line type="monotone" dataKey="rawWPM" stroke="#8884d8" strokeWidth={3} dot={false}/>
					<Line type="monotone" dataKey="averageWPM" stroke="#FFFF00" strokeWidth={4} dot={false}/>
					<Tooltip contentStyle={toolTipStyle} cursor={false} labelFormatter={customTooltipLabel}/>
					
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MyChartComponent;