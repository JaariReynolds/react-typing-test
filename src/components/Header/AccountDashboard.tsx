import React, { useRef } from "react";
import { signOut, updateDisplayName } from "../../firebase/accountFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../../contexts/UserContext";

const AccountDashboard = () => {
	const {user} = useUserContext();

	// assumes there is a user logged in 
	return (
		<div className="account-dashboard">		
            suhh

			
			{/* <div className="display-name-div">
				
				<div>
					<label htmlFor="displayNameInput">change name</label>
					<input type="text" id="displayNameInput"></input>
				</div>
			</div> */}
			<div className="logout-button">
				<button onClick={() => signOut()}>
					<FontAwesomeIcon icon={faDoorOpen} className="icon"/>
					log out
				</button>
			</div>
		</div>
	);
};

export default AccountDashboard;