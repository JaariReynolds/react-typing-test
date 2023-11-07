import React, { useRef, useState } from "react";
import "./login-or-sign-up.scss";
import {signUp, signIn} from "../../firebase/accountFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { isUsernameAvailable } from "../../firebase/GET/userGets";

enum Tab {
    LogIn = "log in",
    SignUp = "sign up"
}

const LoginOrSignUp = () => {
	const [activeTab, setActiveTab] = useState<Tab>(Tab.LogIn);

	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const usernameRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);

	const [errorMessage, setErrorMessage] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setshowConfirmPassword] = useState<boolean>(false);

	const [loading, setLoading] = useState<boolean>(false);

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();

		//#region sign up validation
		if (!emailRef.current || !usernameRef.current || !passwordRef.current || !confirmPasswordRef.current) {
			console.error("refs not valid");
			return;
		}

		if (emailRef.current.value.trim().length == 0) {
			setErrorMessage("please enter an email");
			return;
		}

		if (usernameRef.current.value.trim().length == 0) {
			setErrorMessage("please enter a username");
			return;
		}

		if (usernameRef.current.value.trim().length < 3) {
			setErrorMessage("username too short");
			return;
		}

		if (passwordRef.current.value.trim().length === 0) {
			setErrorMessage("please enter a password");
			return;
		}

		if (passwordRef.current.value !== confirmPasswordRef.current.value) {
			setErrorMessage("passwords do not match");
			return;
		}

		if (!await isUsernameAvailable(usernameRef.current.value.trim())) {
			setErrorMessage("username already taken");
			return;
		}
		//#endregion

		try {
			setLoading(true);
			setErrorMessage(await signUp(emailRef.current.value, passwordRef.current.value, usernameRef.current.value));		
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	
	};

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		//#region sign in validation
		if (!emailRef.current || !passwordRef.current) {
			console.error("refs not valid");
			return;
		} 

		if (emailRef.current.value.trim().length === 0) {
			setErrorMessage("please enter a username");
			return;
		}

		if (passwordRef.current.value.trim().length === 0) {
			setErrorMessage("please enter a password");
			return;
		}
		//#endregion

		try {
			setLoading(true);
			setErrorMessage(await signIn(emailRef.current.value, passwordRef.current.value));
			setLoading(false);	
		} catch (error) {
			console.error(error);
		}
	};


	const handleTabClick = (tab: Tab) => {
		setActiveTab(tab);
		setErrorMessage("");
		setShowPassword(false);
		setshowConfirmPassword(false);
	};

	return (
		<div style={{height: activeTab === Tab.LogIn ? "15.5rem" : "22.5rem"}} className="account-container">
			<div className="tab-selector">
				<button className={activeTab === Tab.LogIn ? "tab-selected" : ""} onClick={() => handleTabClick(Tab.LogIn)}>{Tab.LogIn.toString()}</button>
				<button className={activeTab === Tab.SignUp ? "tab-selected" : ""} onClick={() => handleTabClick(Tab.SignUp)}>{Tab.SignUp.toString()}</button>
				<div className="tab-selected-underline" style={{transform: activeTab === Tab.LogIn ? "translateX(0%)" : "translateX(100%)"}}></div>

			</div>

			{activeTab === Tab.SignUp &&
			<form onSubmit={handleSignUp} className="form-container" noValidate>			
				<div className="form-field">
					<label htmlFor="signUpEmail">email</label>
					<input 
						type="text"
						id="signUpEmail"
						name="email"
						ref={emailRef}
						spellCheck="false"
						required
					/>				
				</div>
				<div className="form-field">
					<label htmlFor="signupUsername">username</label>
					<input 
						type="text"
						id="signUpUsername"
						name="username"
						ref={usernameRef}
						spellCheck="false"
						maxLength={15}
						required
					/>
				</div>
				<div className="form-field">
					<label htmlFor="signUpPassword">password</label>
					<div className="password-field">
						<input 
							type={showPassword ? "text" : "password"}
							id="signUpPassword"
							name="password"
							ref={passwordRef}
							spellCheck="false"
							required
						/>
						<span className="password-icon">
							<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword(!showPassword)}/>
						</span>
					</div>
				</div>
				<div className="form-field">
					<label htmlFor="signUpConfirmPassword">confirm password</label>
					<div className="password-field">
						<input 
							type={showConfirmPassword ? "text" : "password"}
							id="signUpConfirmPassword"
							name="confirmPassword"
							ref={confirmPasswordRef}
							spellCheck="false"
							required
						/>
						<span className="password-icon">
							<FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} onClick={() => setshowConfirmPassword(!showConfirmPassword)}/>
						</span>
					</div>
				</div>
				<div className="error-message">
					{loading ? <FontAwesomeIcon className="loading-icon" icon={faSpinner} spin/> : errorMessage}
				</div>			
				<button className="submit-button" disabled={loading} type="submit">{Tab.SignUp.toString()}</button>
			</form>
			}
            
			{activeTab === Tab.LogIn && 
            <form onSubmit={handleSignIn} className="form-container" noValidate>
            	<div className="form-field">
            		<label htmlFor="loginEmail">email</label>
            		<input 
            			type="text"
            			id="loginEmail"
            			name="email"
            			ref={emailRef}
            			spellCheck="false"
            			required
            		/>				
            	</div>
            	<div className="form-field">
            		<label htmlFor="loginPassword">password</label>
            		<div className="password-field">
            			<input 
            				type={showPassword ? "text" : "password"}
            				id="loginPassword"
            				name="password"
            				ref={passwordRef}
            				spellCheck="false"
            				required
            			/>
            			<span className="password-icon">
            				<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword(!showPassword)}/>
            			</span>	
            		</div>	
            	</div>
            	<div className="error-message">
            		{loading ? <FontAwesomeIcon className="loading-icon" icon={faSpinner} spin/> : errorMessage}
            	</div>	
            	<button className="submit-button" disabled={loading} type="submit">{Tab.LogIn.toString()}</button>
            </form>
			}			
		</div>
	);
};

export default LoginOrSignUp;