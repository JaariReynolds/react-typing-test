import React, { memo } from "react";
import "./header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import LoginOrSignUp from "./LoginOrSignUp";
import AccountDashboard from "./AccountDashboard";
import { useUserContext } from "../../contexts/UserContext";

export interface HeaderProps {
    headerRef: React.RefObject<HTMLDivElement>
}

const Header = ({headerRef}: HeaderProps) => {
	const {user, userDocument, setIsHeaderOpen, headerHeight} = useUserContext();
	    
	return (
		<div ref={headerRef} style={{height: headerHeight}} className="header">
			<button onClick={() => setIsHeaderOpen(current => !current)} className="account-button">
			    <FontAwesomeIcon icon={faUser} className="icon"/>
				{userDocument ? userDocument.username : "log in"}
			</button>
			
			{user ? <AccountDashboard/> : <LoginOrSignUp/>}
		</div>
	);
};

export default memo(Header);