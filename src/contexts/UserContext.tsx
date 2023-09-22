/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useContext, useRef} from "react";
import { auth } from "../firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import UpdateCssVariablePaletteObject from "../components/HelperComponents/UpdateCssVariablePaletteObject";
import { UserDocument } from "../firebase/firestoreDocumentInterfaces";
import { getUserFromUserId } from "../firebase/firestoreGet";

interface UserInfo {
    user: User | null,
	userDocument: UserDocument | null
	selectedPaletteId: number,
	setSelectedPaletteId: (id: number) => void,
	isHeaderOpen: boolean,
	setIsHeaderOpen: React.Dispatch<React.SetStateAction<boolean>>,
	headerHeight: string
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
	const [selectedPaletteId, setSelectedPaletteId] = useState<number>(0);
	const [userDocument, setUserDocument] = useState<UserDocument|null>(null);
	const [headerHeight, setHeaderHeight] = useState<string>("2.5rem");
	const [isHeaderOpen, setIsHeaderOpen] = useState<boolean>(false);

	// auth observe to login/logout user with firebase function
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

	// set palette to user's last used palette
	useEffect(() => {
		if (userDocument)
			setSelectedPaletteId(userDocument.selectedPaletteIndex);
		else 
			setSelectedPaletteId(0);
	}, [userDocument]);

	// set header height depending on open/closed
	useEffect(() => {
		if (isHeaderOpen) 
			setHeaderHeight("29rem");
		else 
			setHeaderHeight("2.5rem");
	}, [isHeaderOpen]);

	
	UpdateCssVariablePaletteObject(selectedPaletteId);

	const value = {
		user,
		userDocument,
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
