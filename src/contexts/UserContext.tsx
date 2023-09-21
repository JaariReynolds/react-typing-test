/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import UpdateCssVariablePaletteObject from "../components/HelperComponents/UpdateCssVariablePaletteObject";
import { UserDocument } from "../firebase/firestoreDocumentInterfaces";
import { getUserFromUserId } from "../firebase/firestoreGet";
import { Timestamp } from "firebase/firestore";


interface UserInfo {
    user: User | null,
	userDocument: UserDocument | null
	selectedPaletteId: number,
	setSelectedPaletteId: (id: number) => void
}

const userDocumentInitialState : UserDocument = {
	email: "",
	username: "",
	selectedPaletteIndex: 0,
	testSummaries: [],
	creationDate: new Date()
};

export const UserContext = React.createContext<UserInfo|undefined>(
	{
		user: null,
		userDocument: userDocumentInitialState,
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
	const [userDocument, setUserDocument] = useState<UserDocument|null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				try {
					getUserFromUserId(user.uid)
						.then(userData => {
							setUserDocument(userData as UserDocument);
						});
				} catch (error) {
					console.log(error);
				}
				setUser(user);
			}
			else {
				setUser(null);
				setUserDocument(null);
			}
		});
		return unsubscribe;
	}, []);

	useEffect(() => {
		if (userDocument)
			setSelectedPaletteId(userDocument.selectedPaletteIndex);
		else 
			setSelectedPaletteId(0);
	}, [userDocument]);

	UpdateCssVariablePaletteObject(selectedPaletteId);

	const value = {
		user,
		userDocument,
		selectedPaletteId,
		setSelectedPaletteId
	};

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
};
