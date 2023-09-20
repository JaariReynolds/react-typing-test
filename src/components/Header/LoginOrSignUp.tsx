import React, { useRef, useState } from "react";
import "../../styles/componentStyles/login-or-sign-up.scss";
import {signUp, signIn} from "../../firebase/accountFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

enum Tab {
    Login = "login",
    SignUp = "sign up"
}

const LoginOrSignUp = () => {
	const [activeTab, setActiveTab] = useState<Tab>(Tab.Login);

	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setshowConfirmPassword] = useState<boolean>(false);


	const [errorMessage, setErrorMessage] = useState<string>("");


	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!emailRef.current || !passwordRef.current || !confirmPasswordRef.current) {
			console.error("refs not valid");
			return;
		}

		if (passwordRef.current.value !== confirmPasswordRef.current.value) {
			setErrorMessage("passwords do not match");
			return;
		}

		setErrorMessage(await signUp(emailRef.current.value, passwordRef.current.value));		
	};

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!emailRef.current || !passwordRef.current) {
			console.error("refs not valid");
			return;
		} 

		setErrorMessage(await signIn(emailRef.current.value, passwordRef.current.value));
	};

	const handleTabClick = (tab: Tab) => {
		setActiveTab(tab);
		setErrorMessage("");
		setShowPassword(false);
		setshowConfirmPassword(false);
	};

	return (
		<div style={{height: activeTab === Tab.Login ? "15rem" : "19rem"}} className="account-container">
			<div className="tab-container">
				<button onClick={() => handleTabClick(Tab.Login)}>{Tab.Login.toString()}</button>
				<button onClick={() => handleTabClick(Tab.SignUp)}>{Tab.SignUp.toString()}</button>
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
							required
						/>
						<span className="password-icon">
							<FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} onClick={() => setshowConfirmPassword(!showConfirmPassword)}/>
						</span>
					</div>
				</div>
				<div className="error-message">
					{errorMessage}
				</div>			
				<button type="submit">{Tab.SignUp.toString()}</button>
			</form>
			}
            
			{activeTab === Tab.Login && 
            <form onSubmit={handleSignIn} className="form-container" noValidate>
            	<div className="form-field">
            		<label htmlFor="loginEmail">email</label>
            		<input 
            			type="text"
            			id="loginEmail"
            			name="email"
            			ref={emailRef}
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
            				required
            			/>
            			<span className="password-icon">
            				<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword(!showPassword)}/>
            			</span>	
            		</div>	
            	</div>
            	<div className="error-message">
            		{errorMessage}
            	</div>	
            	<button type="submit">{Tab.Login.toString()}</button>
            </form>
			}			
		</div>
	);
};

export default LoginOrSignUp;