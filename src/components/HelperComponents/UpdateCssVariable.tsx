/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

const UpdateCssVariable = (rootVariableName: string, value: string) => {
	useEffect(() => {
		document.documentElement.style.setProperty(rootVariableName, value);
	}, [value]);
};

export default UpdateCssVariable;