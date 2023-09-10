import React, { useRef } from "react";
import { logout } from "../../functions/account/accountFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../../contexts/UserContext";

const AccountDashboard = () => {
	const user = useUserContext();

	// assumes there is a user logged in 
	return (
		<div className="account-dashboard">		
            suhh

			<div className="logout-button">
				<button onClick={() => logout()}>
					<FontAwesomeIcon icon={faDoorOpen} className="icon"/>
					logout
				</button>
			</div>
		</div>
	);
};

export default AccountDashboard;