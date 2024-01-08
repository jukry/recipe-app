import React, { useContext, useEffect, useRef, useState } from "react"
import "./styles/Login.css"
import { Navigate, useNavigate } from "react-router-dom"
import { UserContext } from "../Context/UserContext"
import { useLogin } from "../Hooks/useLogin"
import showPasswordImg from "/show-password.svg"
import hidePasswordImg from "/hide-password.svg"
import { handleCapsLockDetection } from "../utils/utils"

export default function Login() {
    const { user, isLoading, setIsLoading } = useContext(UserContext)
    const { login } = useLogin()
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    })
    const [loginStatus, setLoginStatus] = useState()
    const inputRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)
    const [capsLockOn, setCapsLockOn] = useState(false)
    useEffect(() => {
        //for accessibility
        inputRef.current.focus()

        document.addEventListener("keydown", (event) => {
            const capsLockState = handleCapsLockDetection(event)
            setCapsLockOn(capsLockState)
        })
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await login(userData.email, userData.password)
        if (!res.ok) {
            setLoginStatus(res.status)
            setIsLoading(false)
            inputRef.current.focus()
            return loginStatus
        }
        return navigate("/")
    }
    if (user.id) {
        return <Navigate to="/account" />
    }

    return (
        <div className="login-container">
            <h2 tabIndex={0}>Kirjaudu sisään</h2>
            {loginStatus && (
                <h3 className="check-login-input">
                    {loginStatus === 400
                        ? "Tarkista syöttämäsi tiedot"
                        : loginStatus === 401
                        ? "Sähköposti tai salasana väärin"
                        : ""}
                </h3>
            )}
            <form
                replace="true"
                method="post"
                className="login-form"
                onSubmit={handleSubmit}
            >
                <label htmlFor="email" className="visuallyhidden">
                    {loginStatus === 400
                        ? "Tarkista syöttämäsi tiedot"
                        : loginStatus === 401
                        ? "Sähköposti tai salasana väärin"
                        : ""}
                </label>
                <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Sähköpostiosoite"
                    value={userData.email}
                    onChange={(e) =>
                        setUserData((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }))
                    }
                    autoComplete="email"
                    ref={inputRef}
                />
                <div id="password_container">
                    <label htmlFor="password" className="visuallyhidden">
                        {loginStatus === 400
                            ? "Tarkista syöttämäsi tiedot"
                            : loginStatus === 401
                            ? "Sähköposti tai salasana väärin"
                            : ""}
                    </label>
                    <input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Salasana"
                        value={userData.password}
                        onChange={(e) =>
                            setUserData((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }
                    />
                    <img
                        src={showPassword ? hidePasswordImg : showPasswordImg}
                        title={
                            showPassword ? "Piilota salasana" : "Näytä salasana"
                        }
                        id="password_visibility"
                        onPointerEnter={() => {
                            setShowPassword(true)
                        }}
                        onPointerLeave={() => {
                            setShowPassword(false)
                        }}
                    />
                </div>
                {capsLockOn && (
                    <p id="caps_lock_warning">Caps lock on päällä</p>
                )}
                <button type="submit" disabled={isLoading}>
                    {!isLoading ? "Kirjaudu sisään" : "Kirjaudutaan..."}
                </button>
            </form>
        </div>
    )
}
