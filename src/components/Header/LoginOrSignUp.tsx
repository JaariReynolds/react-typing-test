import React, { useRef, useState } from "react";
import "../../styles/componentStyles/login-or-sign-up.scss";

enum Tab {
    Login = "login",
    SignUp = "sign up"
}

const LoginOrSignUp = () => {
	const [activeTab, setActiveTab] = useState<Tab>(Tab.Login);

	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);

	const handleSignUp = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Signed up!");
	};

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Logged in!");
	};

	const handleTabClick = (tab: Tab) => {
		setActiveTab(tab);
	};

	return (
		<div style={{height: activeTab === Tab.Login ? "13rem" : "17rem"}} className="account-container">
			<div className="tab-container">
				<button onClick={() => handleTabClick(Tab.Login)}>{Tab.Login.toString()}</button>
				<button onClick={() => handleTabClick(Tab.SignUp)}>{Tab.SignUp.toString()}</button>
			</div>

			{activeTab === Tab.SignUp &&
			<form onSubmit={handleSignUp} className="form-container">			
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
					<input 
						type="password"
						id="signUpPassword"
						name="password"
						ref={passwordRef}
						required
					/>		
				</div>
				<div className="form-field">
					<label htmlFor="signUpConfirmPassword">confirm password</label>
					<input 
						type="password"
						id="signUpConfirmPassword"
						name="confirmPassword"
						ref={confirmPasswordRef}
						required
					/>
				</div>			
				<button type="submit">{Tab.SignUp.toString()}</button>
			</form>
			}
            
			{activeTab === Tab.Login && 
            <form onSubmit={handleLogin} className="form-container">
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
            			<input 
            				type="password"
            				id="loginPassword"
            				name="password"
            				ref={passwordRef}
            				required
            			/>		
            		</div>
            	<button type="submit">{Tab.Login.toString()}</button>
            </form>
			}			
		</div>
	);
};

export default LoginOrSignUp;