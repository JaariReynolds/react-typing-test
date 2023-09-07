import React from "react";
import "../../styles/componentStyles/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export interface HeaderProps {
    headerRef: React.RefObject<HTMLDivElement>
    headerExpandedRef: React.MutableRefObject<boolean>,
    headerHeight: string,
    setHeaderHeight: React.Dispatch<React.SetStateAction<string>>
}

const Header = ({headerRef, headerExpandedRef, headerHeight, setHeaderHeight}: HeaderProps) => {

	const handleHeaderInteraction = () => {
		headerExpandedRef.current = !headerExpandedRef.current;
		setHeaderHeight(headerExpandedRef.current ? "15rem" : "2.5rem");
	};
    
	return (
		<div ref={headerRef} style={{height: headerHeight}} className="header">
			<button onClick={handleHeaderInteraction} className="account-button">
			    <FontAwesomeIcon icon={faUser} className="icon"/>
                sign in
			</button>
			
		</div>
	);
};

export default Header;