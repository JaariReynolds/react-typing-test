import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { NumberPair } from "../interfaces/WordStructure";

interface IProps {
    wpmArray: NumberPair[]
}

const MyChartComponent = ({wpmArray}: IProps) => {
	return (
		<ResponsiveContainer width="90%" height={300}>
			<LineChart data={wpmArray}>
				<XAxis dataKey="interval" label={{value: "Seconds", dy: 20}}/>
				<YAxis dataKey="wpm" label={{value: "Words per Minute", dx: -20, angle: -90}}/>
				<CartesianGrid stroke="#eee" />
				<Line type="monotone" dataKey="wpm" stroke="#8884d8" />
				<Tooltip />
				
			</LineChart>
		</ResponsiveContainer>
	);
};

export default MyChartComponent;