import React, {SyntheticEvent, useState} from 'react';
import clsx from "clsx";
import {Link} from "react-router-dom";

import {RootState, useAppDispatch, useAppSelector} from "../../redux/store";
import {postDataApi} from "../../redux/slices/authSlices";
import {IMAGES} from "../../images";

import FormBox from "../../components/FormBox";
import {LoginState} from "../../typing";



const Login = () => {
    const dispatch = useAppDispatch()

    const {theme} = useAppSelector((state: RootState) => state.notify)

    const [userData, setUserDate] = useState<LoginState>({email: "", password: ""})
    const [isFocused, setIsFocused] = useState<{ focus: string }>({focus: ""})
    const [typePass, setTypePass] = useState<boolean>(false)

    const {email, password} = userData

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setUserDate({...userData, [name]: value})
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(postDataApi(userData))
        localStorage.setItem("firstLogin", "true")
    }


    return (
        <main style={{paddingTop: "100px"}}>
            <FormBox title="login">
                <form className={clsx("login",
                    theme === "light" && "login_theme"
                )} onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email address</label>
                        <input
                            name="email"
                            value={email || ""}
                            onChange={handleChange}
                            type="email"
                            placeholder="email"
                            aria-label="email"
                            className={clsx((isFocused?.focus === "email" ? "activeBorder" : ""))}
                            onFocus={() => setIsFocused({focus: "email"})}
                        />
                        <p>we'll never share your email anyone else.</p>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            value={password || ""}
                            onChange={handleChange}
                            type={typePass ? "text" : "password"}
                            placeholder="password"
                            aria-label="password"
                            className={clsx((isFocused?.focus === "password" ? "activeBorder" : ""))}
                            onFocus={() => setIsFocused({focus: "password"})}
                        />
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ?
                                <img src={IMAGES.eye} alt="eye"/>
                                :
                                <img src={IMAGES.eyeOff} alt="eye-off"/>
                            }
                        </small>
                    </div>
                    <button
                        className={clsx((email && password) ? "" : "cover")}
                        disabled={!(email && password)}
                        type="submit"
                    >
                        Submit
                    </button>
                    <p className="navigation">
                        You do not have an account? <Link to="/register">Register Now</Link>
                    </p>
                </form>
            </FormBox>

        </main>
    );
};

export default Login;