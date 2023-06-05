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
	
	// combines raw and average datapoints at each interval into 1 type
	const graphData = (): DataPoint[] => {
		console.log(rawWPMArray);
		console.log(averageWPMArray);
	
		const combinedArray = rawWPMArray.map((rawWPM, index) => {
			console.log(index + ": " + rawWPM.wpm + ", " + averageWPMArray[index].wpm);
			return {interval: rawWPM.interval, rawWPM: rawWPM.wpm, averageWPM: averageWPMArray[index].wpm};
		});
		console.log("combined:" + combinedArray);
		return combinedArray;
	};
	
	return (
		<ResponsiveContainer width="90%" height={300}>
			<LineChart data={graphData()}>
				<XAxis dataKey="interval" label={{value: "Seconds", dy: 20}}/>
				<YAxis dataKey="rawWPM" label={{value: "Words per Minute", dx: -20, angle: -90}}/>
				<CartesianGrid stroke="#eee" />
				<Line type="monotone" dataKey="rawWPM" stroke="#8884d8" />
				<Line type="monotone" dataKey="averageWPM" stroke="#FFFF00" />
				<Tooltip />
				
			</LineChart>
		</ResponsiveContainer>
	);
};

export default MyChartComponent;