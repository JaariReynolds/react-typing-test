import React from "react";
import "../../styles/componentStyles/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import LoginOrSignUp from "./LoginOrSignUp";
import AccountDashboard from "./AccountDashboard";
import { useUserContext } from "../../contexts/UserContext";

export interface HeaderProps {
    headerRef: React.RefObject<HTMLDivElement>
    headerExpandedRef: React.MutableRefObject<boolean>,
    headerHeight: string,
    setHeaderHeight: React.Dispatch<React.SetStateAction<string>>
}

const Header = ({headerRef, headerExpandedRef, headerHeight, setHeaderHeight}: HeaderProps) => {
	const {user} = useUserContext();
	

	const handleHeaderInteraction = () => {
		headerExpandedRef.current = !headerExpandedRef.current;
		setHeaderHeight(headerExpandedRef.current ? "29rem" : "2.5rem");
	};
    
	return (
		<div ref={headerRef} style={{height: headerHeight}} className="header">
			<button onClick={handleHeaderInteraction} className="account-button">
			    <FontAwesomeIcon icon={faUser} className="icon"/>
				{user ? user.email : "account"}
			</button>
			
			{user ? <AccountDashboard/> : <LoginOrSignUp/>}
		</div>
	);
};

export default Header;