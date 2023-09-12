/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import UpdateCssVariablePaletteObject from "../components/HelperComponents/UpdateCssVariablePaletteObject";


interface UserInfo {
    user: User | null,
	selectedPaletteId: number,
	setSelectedPaletteId: (id: number) => void
}

export const UserContext = React.createContext<UserInfo|undefined>(
	{
		user: null,
		selectedPaletteId: 0,
		setSelectedPaletteId: () => {}
	}
);

export const useUserContext = () => {
	const user = useContext(UserContext);
	if (user === undefined)
		throw new Error("useUserContext must be used with a UserContext");

	return user;
};

export const UserProvider = ({children}: any) => {
	const [user, setUser] = useState<User|null>(null);
	const [selectedPaletteId, setSelectedPaletteId] = useState<number>(0);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				setSelectedPaletteId(5);
			}
			else {
				setUser(null);
				setSelectedPaletteId(0);
			}
		});
		return unsubscribe;
	}, []);

	UpdateCssVariablePaletteObject(selectedPaletteId);

	const value = {
		user,
		selectedPaletteId,
		setSelectedPaletteId
	};

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
};
