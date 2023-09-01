/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

const UpdateCssVariable = (rootVariableName: string, value: number|string) => {
	useEffect(() => {
		document.documentElement.style.setProperty(rootVariableName, value.toString());
	}, [value]);
};

export default UpdateCssVariable;