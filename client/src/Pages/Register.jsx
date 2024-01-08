import React, { useContext, useEffect, useRef, useState } from "react"
import {
    Form,
    Link,
    Navigate,
    useActionData,
    useNavigation,
} from "react-router-dom"
import "./styles/Register.css"
import { UserContext } from "../Context/UserContext"
import { handleCapsLockDetection, validatePassword } from "../utils/utils"
import showPasswordImg from "/show-password.svg"
import hidePasswordImg from "/hide-password.svg"
import validator from "email-validator"

export default function Register() {
    const navigation = useNavigation()
    const action = useActionData()
    const { user } = useContext(UserContext)
    const inputRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)
    const [capsLockOn, setCapsLockOn] = useState(false)
    const [passwordValidity, setPasswordValidity] = useState(false)
    const [showPasswordWarning, setShowPasswordWarning] = useState(false)
    const [emailValidity, setEmailValidity] = useState(false)
    const [showEmailWarning, setShowEmailWarning] = useState(false)
    useEffect(() => {
        //for accessibility
        inputRef.current.focus()

        document.addEventListener("keydown", (event) => {
            const capsLockState = handleCapsLockDetection(event)
            setCapsLockOn(capsLockState)
        })
    }, [])
    if (user.id) {
        return <Navigate to="/account" />
    }
    return (
        <section id="register-container">
            <h2 tabIndex={0}>Rekisteröidy</h2>
            {action && (
                <h3 id="check-register-input" tabIndex={0}>
                    {action === 401
                        ? "Täytä kaikki kentät"
                        : action === 403
                        ? "Sähköposti on jo käytössä"
                        : action === 400
                        ? "Jotain meni pieleen, yritä uudelleen"
                        : ""}
                </h3>
            )}
            <Form replace="true" method="post" id="register-form">
                <label htmlFor="email" className="visuallyhidden">
                    {action === 401
                        ? "Täytä kaikki kentät"
                        : action === 403
                        ? "Sähköposti on jo käytössä"
                        : action === 400
                        ? "Jotain meni pieleen, yritä uudelleen"
                        : ""}
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Sähköpostiosoite"
                    required
                    autoComplete="email"
                    ref={inputRef}
                    onBlur={(event) => {
                        const emailInput = event.target.value
                        const validatedEmail = validator.validate(emailInput)
                        if (emailInput.length === 0) {
                            return
                        }
                        setEmailValidity(validatedEmail)
                        if (!validatedEmail) {
                            setShowEmailWarning(true)
                        } else {
                            setShowEmailWarning(false)
                        }
                    }}
                    onChange={(event) => {
                        const emailInput = event.target.value
                        if (emailInput.length === 0) {
                            setShowEmailWarning(false)
                        }
                        const validatedEmail = validator.validate(emailInput)
                        setEmailValidity(validatedEmail)
                        if (!validatedEmail && emailValidity) {
                            setShowEmailWarning(true)
                        } else if (validatedEmail) {
                            setShowEmailWarning(false)
                        }
                    }}
                />
                {showEmailWarning && (
                    <p id="email_warning">
                        Sähköpostiosoite ei ole pätevä, tarkista antamasi osoite
                    </p>
                )}
                <div id="password_container">
                    <label htmlFor="password" className="visuallyhidden">
                        {action === 401
                            ? "Täytä kaikki kentät"
                            : action === 403
                            ? "Sähköposti on jo käytössä"
                            : action === 400
                            ? "Jotain meni pieleen, yritä uudelleen"
                            : ""}
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Salasana"
                        id="password"
                        required
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Salasanassa pitää olla ainakin yksi numero, yksi pieni kirjain, yksi iso kirjain sekä vähintään 8 merkkiä"
                        onBlur={(e) => {
                            const validatedPassword = validatePassword(e)
                            setPasswordValidity(validatedPassword)
                            if (e.target.value.length > 0) {
                                setShowPasswordWarning(!validatedPassword)
                            }
                        }}
                        onChange={(e) => {
                            const validatedPassword = validatePassword(e)
                            if (!validatedPassword && passwordValidity) {
                                setShowPasswordWarning(true)
                            } else if (validatedPassword) {
                                setPasswordValidity(validatedPassword)
                                setShowPasswordWarning(!validatedPassword)
                            }
                        }}
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
                {showPasswordWarning && (
                    <p id="invalid_password">
                        Salasanan tulee olla ainakin 8 merkkiä pitkä sekä
                        sisältää vähintään 1 pieni ja 1 iso kirjain, 1 numero
                        sekä 1 erikoismerkki
                    </p>
                )}
                {capsLockOn && (
                    <p id="caps_lock_warning">Caps lock on päällä</p>
                )}
                <button
                    disabled={
                        navigation.state === "submitting" ||
                        emailValidity === false ||
                        passwordValidity === false
                    }
                >
                    {navigation.state === "idle"
                        ? "Rekisteröidy"
                        : "Rekisteröidään käyttäjä..."}
                </button>
            </Form>
            <hr id="login_horizontal_line" />
            <div id="already_registered">
                <p id="">Oletko jo rekisteröitynyt?</p>
                <Link to="/login" id="login_now">
                    Kirjaudu sisään
                </Link>
            </div>
        </section>
    )
}
