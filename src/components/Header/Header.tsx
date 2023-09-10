import React, { useState } from "react";
import "../../styles/componentStyles/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faUser } from "@fortawesome/free-solid-svg-icons";
import LoginOrSignUp from "./LoginOrSignUp";
import AccountDashboard from "./AccountDashboard";

export interface HeaderProps {
    headerRef: React.RefObject<HTMLDivElement>
    headerExpandedRef: React.MutableRefObject<boolean>,
    headerHeight: string,
    setHeaderHeight: React.Dispatch<React.SetStateAction<string>>
}

const Header = ({headerRef, headerExpandedRef, headerHeight, setHeaderHeight}: HeaderProps) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	const handleHeaderInteraction = () => {
		headerExpandedRef.current = !headerExpandedRef.current;
		setHeaderHeight(headerExpandedRef.current ? "23rem" : "2.5rem");
	};
    
	return (
		<div ref={headerRef} style={{height: headerHeight}} className="header">
			<button onClick={handleHeaderInteraction} className="account-button">
			    <FontAwesomeIcon icon={faUser} className="icon"/>
                account
			</button>

			{isLoggedIn && 
			<div className="logout-button">
				<button onClick={() => setIsLoggedIn(false)}>
					<FontAwesomeIcon icon={faDoorOpen} className="icon"/>
					logout
				</button>
			</div>
			}
			
			{isLoggedIn ? <AccountDashboard/> : <LoginOrSignUp/>}
	
			
		</div>
	);
};

export default Header;