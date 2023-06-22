import React, {useEffect, useState} from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { NumberPair } from "../interfaces/WordStructure";


interface DataPoint {
	interval: number,
	rawWPM: number,
	averageWPM: number
}

interface IProps {
	rawWPMArray: NumberPair[],
	averageWPMArray: NumberPair[],
}

const MyChartComponent = ({rawWPMArray, averageWPMArray}: IProps) => {
	
	const [graphData, setGraphData] = useState<DataPoint[]>([]);
	

	// combines raw and average datapoints at each interval into 1 type
	useEffect(() => {		
		const combinedArray = rawWPMArray.map((rawWPM, index) => {
			return {interval: rawWPM.interval, rawWPM: rawWPM.wpm, averageWPM: averageWPMArray[index].wpm};
		});
		setGraphData(combinedArray);	
		console.log(combinedArray);
	}, []);

	
	return (
		<div className="results-chart">
			<ResponsiveContainer width="90%" height={300}>
				<LineChart data={graphData}>
					<XAxis 
						tick={{fill: "rgb(47, 50, 52)"}}

						type="number"
						tickCount={23}
						domain={[1, "dataMax"]}
						dataKey="interval" 
						height={40}
						label={{
							value: "Seconds", 
							dy: 15,
							fill:"rgb(47, 50, 52)"
						}}
					/>
					<YAxis 
						tick={{fill:"rgb(47, 50, 52)"}} 
						dataKey="rawWPM"
						width={40}
						label={{
							value: "Words per Minute", 
							dx: -20, 
							angle: -90,
							fill:"rgb(47, 50, 52)"
						}}
					/>
					<CartesianGrid stroke="rgb(47, 50, 52)" />
					<Line type="monotone" dataKey="rawWPM" stroke="#8884d8" />
					<Line type="monotone" dataKey="averageWPM" stroke="#FFFF00" />
					<Tooltip />
					
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MyChartComponent;