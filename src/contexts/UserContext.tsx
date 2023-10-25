/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useContext, createContext } from "react";
import { auth } from "../firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import UpdateCssVariablePaletteObject from "../components/HelperComponents/UpdateCssVariablePaletteObject";
import { UserDocument } from "../firebase/firestoreDocumentInterfaces";
import { getUser } from "../firebase/GET/userGets";
import { Timestamp } from "firebase/firestore";

interface UserInfo {
    user: User | null,
	userDocument: UserDocument | null,
	setUserDocument: (userDocument: UserDocument) => void,
	selectedPaletteId: number,
	setSelectedPaletteId: (id: number) => void,
	isHeaderOpen: boolean,
	setIsHeaderOpen: React.Dispatch<React.SetStateAction<boolean>>,
	headerHeight: string
}

const userDocumentInitialState : UserDocument = {
	email: "",
	username: "",
	testSummaries: [],
	creationDate: Timestamp.now()
};

export const UserContext = createContext<UserInfo|undefined>(
	{
		user: null,
		userDocument: userDocumentInitialState,
		setUserDocument: () => {},
		selectedPaletteId: 0,
		setSelectedPaletteId: () => {},
		isHeaderOpen: false,
		setIsHeaderOpen: () => {},
		headerHeight: ""
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
	const [selectedPaletteId, setSelectedPaletteId] = useState<number>(parseInt(localStorage.getItem("selectedPaletteId") ?? "0"));
	const [userDocument, setUserDocument] = useState<UserDocument|null>(null);
	const [headerHeight, setHeaderHeight] = useState<string>("2.5rem");
	const [isHeaderOpen, setIsHeaderOpen] = useState<boolean>(false);

	// auth observe to login/logout user with firebase function
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				try {
					getUser(user.uid)
						.then(userData => {
							setUserDocument(userData);
						});
				} catch (error) {
					console.error(error);
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

	// set header height depending on open/closed
	useEffect(() => {
		if (isHeaderOpen) 
			setHeaderHeight("29rem");
		else 
			setHeaderHeight("2.5rem");
	}, [isHeaderOpen]);

	useEffect(() => {
		localStorage.setItem("selectedPaletteId", selectedPaletteId.toString());
	}, [selectedPaletteId]);

	
	UpdateCssVariablePaletteObject(selectedPaletteId);

	const value: UserInfo = {
		user,
		userDocument,
		setUserDocument,
		selectedPaletteId,
		setSelectedPaletteId,
		isHeaderOpen,
		setIsHeaderOpen,
		headerHeight
	};

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
};
