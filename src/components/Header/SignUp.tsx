import React, { useRef, useState } from "react";
import "../../styles/componentStyles/sign-up.scss";

enum Tab {
    Login = "Login",
    SignUp = "Sign Up"
}

const SignUp = () => {
	const [activeTab, setActiveTab] = useState<Tab>(Tab.SignUp);

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
					<label htmlFor="signUpEmail">Email</label>
					<input 
						type="text"
						id="signUpEmail"
						name="email"
						ref={emailRef}
						required
					/>				
				</div>
				<div className="form-field">
					<label htmlFor="signUpPassword">Password</label>
					<input 
						type="password"
						id="signUpPassword"
						name="password"
						ref={passwordRef}
						required
					/>		
				</div>
				<div className="form-field">
					<label htmlFor="signUpConfirmPassword">Confirm Password</label>
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
            			<label htmlFor="loginEmail">Email</label>
            			<input 
            				type="text"
            				id="loginEmail"
            				name="email"
            				ref={emailRef}
            				required
            			/>				
            		</div>
            		<div className="form-field">
            			<label htmlFor="loginPassword">Password</label>
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

export default SignUp;