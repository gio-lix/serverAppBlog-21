import React, {SyntheticEvent, useState} from 'react';
import clsx from "clsx";
import {Link, useNavigate} from "react-router-dom";

import {RootState, useAppDispatch, useAppSelector} from "../../redux/store";
import {postRegisterDataApi} from "../../redux/slices/authSlices";
import {setNotify} from "../../redux/slices/notifySlices";
import {validation} from "../../utils/valid";
import {IMAGES} from "../../images";

import FormBox from "../../components/FormBox";


const Register = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {theme} = useAppSelector((state: RootState) => state.notify)

    const [typeConPass, setTypeConPass] = useState<boolean>(false)
    const [isFocused, setIsFocused] = useState<{ focus: string }>({focus: ""})
    const [typePass, setTypePass] = useState<boolean>(false)
    const [userData, setUserDate] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "male"
    })
    const {password, confirmPassword, email, fullname, username} = userData


    const handleChange = (e: any) => {
        const {name, value} = e.target
        setUserDate({...userData, [name]: value})
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        const check = validation(userData)
        if (check.errLength > 0) {
            dispatch(setNotify({error: [check.errMessage]}))
        } else {
            dispatch(postRegisterDataApi(userData))
            localStorage.setItem("firstLogin", "true")
            navigate("/")
        }
    }

    return (
        <main style={{paddingTop: "100px"}}>
            <FormBox title="Register">
                <form
                    className={clsx("register",
                        theme === "light" && "register_theme"
                    )}
                    onSubmit={handleSubmit}
                >
                    <div>
                        <div>
                            <label
                                // style={{color: `${error?.fullname ? "#DC143C" : ""}`}}
                                htmlFor="fullname"
                            >
                                Full name
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                value={fullname || ""}
                                onChange={handleChange}
                                placeholder="full name"
                                aria-label="fullname"
                                // style={{background: `${error?.fullname ? "#fdf3f5" : ""}`}}
                                className={clsx((isFocused?.focus === "fullname" ? "activeBorder" : ""))}
                                onFocus={() => setIsFocused({focus: "fullname"})}
                            />
                        </div>
                        <div>
                            <label
                                // style={{color: `${error?.username ? "#DC143C" : ""}`}}
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={username.toLowerCase().replace(/ /g, "") || ""}
                                onChange={handleChange}
                                placeholder="username"
                                aria-label="username"
                                // style={{background: `${error?.username ? "#fdf3f5" : ""}`}}
                                className={clsx((isFocused?.focus === "username" ? "activeBorder" : ""))}
                                onFocus={() => setIsFocused({focus: "username"})}
                            />
                        </div>
                        <div>
                            <label
                                // style={{color: `${error?.email ? "#DC143C" : ""}`}}
                                htmlFor="email"
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email || ""}
                                onChange={handleChange}
                                placeholder="email"
                                aria-label="email"
                                // style={{background: `${error?.email ? "#fdf3f5" : ""}`}}
                                className={clsx((isFocused?.focus === "email" ? "activeBorder" : ""))}
                                onFocus={() => setIsFocused({focus: "email"})}
                            />
                            <p>we'll never share your email anyone else</p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label
                                // style={{color: `${error?.password ? "#DC143C" : ""}`}}
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                type={typePass ? "text" : "password"}
                                name="password"
                                value={password || ""}
                                onChange={handleChange}
                                placeholder="password"
                                aria-label="password"
                                // style={{background: `${error?.password ? "#fdf3f5" : ""}`}}
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
                        <div>
                            <label
                                // style={{color: `${error?.confirmPassword ? "#DC143C" : ""}`}}
                                htmlFor="confirmPassword"
                            >
                                Confirm Password
                            </label>
                            <input
                                type={typeConPass ? "text" : "password"}
                                name="confirmPassword"
                                value={confirmPassword || ""}
                                onChange={handleChange}
                                placeholder="confirm Password"
                                aria-label="confirm Password"
                                // style={{background: `${error?.confirmPassword ? "#fdf3f5" : ""}`}}
                                className={clsx((isFocused?.focus === "confirmPassword" ? "activeBorder" : ""))}
                                onFocus={() => setIsFocused({focus: "confirmPassword"})}
                            />
                            <small onClick={() => setTypeConPass(!typeConPass)}>
                                {typeConPass
                                    ? <img src={IMAGES.eye} alt="eye"/>
                                    : <img src={IMAGES.eyeOff} alt="eye-off"/>
                                }
                            </small>
                        </div>
                        <div className="register_radio">
                            <label htmlFor="male">
                                <input onChange={handleChange} value="male" type="radio" name="gender" id="male"/>: Male
                            </label>
                            <label htmlFor="female">
                                <input onChange={handleChange} value="female" type="radio" name="gender" id="female"/>:
                                Female
                            </label>
                            <label htmlFor="other">
                                <input onChange={handleChange} value="other" type="radio" name="gender" id="other"/>:
                                Other
                            </label>
                        </div>
                    </div>

                    <button
                        className={clsx((email && password && confirmPassword) ? "" : "cover")}
                        disabled={(email && password && confirmPassword) ? false : true}
                        type="submit"
                    >
                        Submit
                    </button>
                    <p className="navigation">
                        Already have an account? <Link to="/login">Login Now</Link>
                    </p>
                </form>
            </FormBox>
        </main>
    );
};

export default Register;