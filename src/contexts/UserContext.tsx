import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import { User, onAuthStateChanged } from "firebase/auth";


interface UserInfo {
    currentUser: User | null,
}

export const UserContext = React.createContext<UserInfo|undefined>({currentUser: null});

export const useUserContext = () => {
	const user = useContext(UserContext);
	if (user === undefined)
		throw new Error("useUserContext must be used with a UserContext");

	return user;
};

export const UserProvider = ({children}: any) => {
	const [currentUser, setCurrentUser] = useState<User|null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setCurrentUser(user);
			}
			else {
				setCurrentUser(null);
			}
		});
		return unsubscribe;
	}, []);


	const value = {
		currentUser
	};

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
};
