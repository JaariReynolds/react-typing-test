import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import { User, onAuthStateChanged } from "firebase/auth";


interface UserInfo {
    user: User | null,
}

export const UserContext = React.createContext<UserInfo|undefined>({user: null});

export const useUserContext = () => {
	const user = useContext(UserContext);
	if (user === undefined)
		throw new Error("useUserContext must be used with a UserContext");

	return user;
};

export const UserProvider = ({children}: any) => {
	const [user, setUser] = useState<User|null>(null);
	
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
			}
			else {
				setUser(null);
			}
		});
		return unsubscribe;
	}, []);

	const value = {
		user
	};

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
};
