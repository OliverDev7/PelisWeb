"use client"

import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { auth } from "../../firebase/firebase"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { motion } from "framer-motion"
import Footer from "../Footer/Footer"

const Register = () => {
  const navigate = useNavigate()

  // Estados para manejar los campos de formulario y validaciones
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const [isVerificationPending, setIsVerificationPending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [storedPassword, setStoredPassword] = useState("")
  const [storedConfirmPassword, setStoredConfirmPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [termsError, setTermsError] = useState("")
  const [step, setStep] = useState(1)

  const handleChangeEmail = () => {
    setStoredPassword(password)
    setStoredConfirmPassword(confirmPassword)
    setStep(1)
  }

  useEffect(() => {
    if (step === 2) {
      setPassword(storedPassword)
      setConfirmPassword(storedConfirmPassword)
    }
  }, [step])

  const validateUsername = () => {
    if (!username) {
      setUsernameError("El nombre de usuario es requerido")
      return false
    }
    if (username.length < 5) {
      setUsernameError("El nombre de usuario debe tener al menos 5 caracteres")
      return false
    }
    setUsernameError("")
    return true
  }

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("El correo es requerido")
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError("Ingresa un correo electrónico válido")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = () => {
    let isValid = true
    if (!password) {
      setPasswordError("La contraseña es requerida")
      isValid = false
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres")
      isValid = false
    } else {
      setPasswordError("")
    }
    if (!confirmPassword) {
      setConfirmPasswordError("La confirmación de contraseña es requerida")
      isValid = false
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden")
      isValid = false
    } else {
      setConfirmPasswordError("")
    }
    return isValid
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    if (validateUsername() && validateEmail()) {
      setStep(2)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPasswords((prev) => !prev)
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    // Validar el checkbox de términos y condiciones
    if (!acceptedTerms) {
      setTermsError("Debes aceptar los términos y condiciones para registrarte.")
      return
    } else {
      setTermsError("") // Limpiar el error si el checkbox está marcado
    }

    // Ejecuta las validaciones de los demás campos
    const isUsernameValid = validateUsername()
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()

    // Si alguna validación falla, detén el proceso
    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
      return
    }

    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await sendEmailVerification(user)

      // Guardar en la colección "users" (minúscula) con los mismos campos que en React Native
      await setDoc(
        doc(db, "users", user.uid),
        {
          username,
          email,
          createdAt: new Date(),
          photoURL: null,
          myList: [],
          watchHistory: [],
          preferences: {
            notifications: true,
            darkMode: true,
          },
        },
        { merge: true },
      )

      setIsVerificationPending(true)
    } catch (error) {
      console.error("Error al registrar usuario:", error)

      if (error.code === "auth/email-already-in-use") {
        setEmailError("Este correo ya está registrado. Intenta con otro.")
      } else if (error.code === "auth/weak-password") {
        setPasswordError("La contraseña es muy débil. Intenta con una más segura.")
      } else {
        alert(`Error: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const checkEmailVerification = async () => {
    const user = auth.currentUser
    if (!user) return

    await user.reload()
    if (user.emailVerified) {
      navigate("/home", { replace: true })
    }
  }

  useEffect(() => {
    if (isVerificationPending) {
      const interval = setInterval(async () => {
        await checkEmailVerification()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isVerificationPending])

  if (isVerificationPending) {
    return (
      <Container>
        <FormCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VerificationContainer>
            <VerificationIcon>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  stroke="url(#verify)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.75 12L10.58 14.83L16.25 9.17"
                  stroke="url(#verify)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="verify" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E91E63" />
                    <stop offset="1" stopColor="#9C27B0" />
                  </linearGradient>
                </defs>
              </svg>
            </VerificationIcon>
            <h2>Verifica tu correo electrónico</h2>
            <p>
              Te hemos enviado un enlace de verificación a <strong>{email}</strong>. Por favor, revisa tu bandeja de
              entrada y sigue las instrucciones para continuar.
            </p>
            <VerificationNote>
              Si no encuentras el correo, revisa tu carpeta de spam o correo no deseado.
            </VerificationNote>
            <ResendButton onClick={() => sendEmailVerification(auth.currentUser)}>
              Reenviar correo de verificación
            </ResendButton>
          </VerificationContainer>
        </FormCard>
        <Footer />
      </Container>
    )
  }

  return (
    <Container>
      <FormCard
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormHeader>
          <FormTitle>Crear cuenta</FormTitle>
          <FormSubtitle>
            {step === 1 ? "Ingresa tus datos para comenzar" : "Establece una contraseña segura"}
          </FormSubtitle>
        </FormHeader>

        <StepIndicator>
          <StepDot active={step >= 1} completed={step > 1}>
            1
          </StepDot>
          <StepLine active={step > 1} />
          <StepDot active={step >= 2}>2</StepDot>
        </StepIndicator>

        <form onSubmit={step === 1 ? handleNextStep : handleRegister}>
          {step === 1 ? (
            <>
              <FormGroup>
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={validateUsername}
                  error={usernameError}
                />
                {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                  error={emailError}
                />
                {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
              </FormGroup>
            </>
          ) : (
            <>
              <FormGroup>
                <Label htmlFor="password">Contraseña</Label>
                <PasswordWrapper>
                  <Input
                    id="password"
                    type={showPasswords ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                    error={passwordError}
                  />
                  <TogglePasswordButton type="button" onClick={togglePasswordVisibility}>
                    {showPasswords ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M14.53 9.47L9.47 14.53C8.82 13.88 8.42 12.99 8.42 12C8.42 10.02 10.02 8.42 12 8.42C12.99 8.42 13.88 8.82 14.53 9.47Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73C8.47 3.73 5.18 5.81 2.89 9.41C1.99 10.82 1.99 13.19 2.89 14.6C3.68 15.84 4.6 16.91 5.6 17.77"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.42 19.53C9.56 20.01 10.77 20.27 12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.4C20.78 8.88 20.42 8.39 20.05 7.93"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.51 12.7C15.25 14.11 14.1 15.26 12.69 15.52"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.47 14.53L2 22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22 2L14.53 9.47"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42 13.98 8.42 12C8.42 10.02 10.02 8.42 12 8.42C13.98 8.42 15.58 10.02 15.58 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.4C18.82 5.8 15.53 3.72 12 3.72C8.47 3.72 5.18 5.8 2.89 9.4C1.99 10.81 1.99 13.18 2.89 14.59C5.18 18.19 8.47 20.27 12 20.27Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </TogglePasswordButton>
                </PasswordWrapper>
                {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <PasswordWrapper>
                  <Input
                    id="confirmPassword"
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={validatePassword}
                    error={confirmPasswordError}
                  />
                  <TogglePasswordButton type="button" onClick={togglePasswordVisibility}>
                    {showPasswords ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M14.53 9.47L9.47 14.53C8.82 13.88 8.42 12.99 8.42 12C8.42 10.02 10.02 8.42 12 8.42C12.99 8.42 13.88 8.82 14.53 9.47Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73C8.47 3.73 5.18 5.81 2.89 9.41C1.99 10.82 1.99 13.19 2.89 14.6C3.68 15.84 4.6 16.91 5.6 17.77"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.42 19.53C9.56 20.01 10.77 20.27 12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.4C20.78 8.88 20.42 8.39 20.05 7.93"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.51 12.7C15.25 14.11 14.1 15.26 12.69 15.52"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.47 14.53L2 22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22 2L14.53 9.47"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42 13.98 8.42 12C8.42 10.02 10.02 8.42 12 8.42C13.98 8.42 15.58 10.02 15.58 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.4C18.82 5.8 15.53 3.72 12 3.72C8.47 3.72 5.18 5.8 2.89 9.4C1.99 10.81 1.99 13.18 2.89 14.59C5.18 18.19 8.47 20.27 12 20.27Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </TogglePasswordButton>
                </PasswordWrapper>
                {confirmPasswordError && <ErrorMessage>{confirmPasswordError}</ErrorMessage>}
              </FormGroup>
              <TermsContainer>
                <Checkbox
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <TermsLabel htmlFor="terms">
                  Al registrarte, aceptas nuestros <TermsLink to="/terminos">términos y condiciones</TermsLink>.
                </TermsLabel>
              </TermsContainer>
              {termsError && <ErrorMessage>{termsError}</ErrorMessage>}
            </>
          )}

          <SecurityMessage>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                stroke="#F4C542"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 8V13" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M11.9945 16H12.0035"
                stroke="#F4C542"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Recuerda usar contraseñas seguras.
          </SecurityMessage>

          <ButtonGroup>
            {step === 2 && (
              <BackButton type="button" onClick={handleChangeEmail}>
                Atrás
              </BackButton>
            )}
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : step === 1 ? "Continuar" : "Registrarme"}
            </SubmitButton>
          </ButtonGroup>
        </form>

        <FormFooter>
          <FooterText>
            ¿Ya tienes cuenta? <FooterLink to="/signin">Inicia sesión</FooterLink>
          </FooterText>
        </FormFooter>
      </FormCard>
      <Footer />
    </Container>
  )
}

// Animaciones
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(255, 4, 222, 0.17) 100%
  );
  background-size: cover;
  background-position: center;
  padding: 1.5rem;
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`

const FormCard = styled.div`
  background-color: rgb(10, 12, 12);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 400px;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 12px;
  }
`

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`

const FormTitle = styled.h1`
  color: white;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`

const FormSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`

const StepDot = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  background-color: ${(props) => (props.active ? "linear-gradient(90deg, #E91E63, #9C27B0)" : "rgba(255, 255, 255, 0.1)")};
  background: ${(props) => (props.active ? "linear-gradient(90deg, #E91E63, #9C27B0)" : "rgba(255, 255, 255, 0.1)")};
  color: ${(props) => (props.active ? "white" : "rgba(255, 255, 255, 0.5)")};
  border: 2px solid ${(props) => (props.completed ? "#9C27B0" : props.active ? "#E91E63" : "rgba(255, 255, 255, 0.1)")};
  
  @media (max-width: 480px) {
    width: 26px;
    height: 26px;
    font-size: 12px;
  }
`

const StepLine = styled.div`
  height: 2px;
  width: 60px;
  background-color: ${(props) => (props.active ? "#E91E63" : "rgba(255, 255, 255, 0.1)")};
  margin: 0 10px;
`

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`

const Label = styled.label`
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(49, 52, 62, 0.7);
  border: 1px solid ${(props) => (props.error ? "#ff4d4f" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.error ? "#ff4d4f" : "#00BFA6")};
    box-shadow: 0 0 0 2px ${(props) => (props.error ? "rgba(255, 77, 79, 0.2)" : "rgba(0, 191, 166, 0.2)")};
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 0.9rem;
    font-size: 0.95rem;
  }
`

const PasswordWrapper = styled.div`
  position: relative;
`

const TogglePasswordButton = styled.button`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #00BFA6;
  }
`

const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`

const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`

const Checkbox = styled.input`
  margin-right: 0.75rem;
  margin-top: 0.25rem;
  cursor: pointer;
`

const TermsLabel = styled.label`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
`

const TermsLink = styled(Link)`
  color: #00BFA6;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #00E5C7;
    text-decoration: underline;
  }
`

const SecurityMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #F4C542;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`

const BackButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const SubmitButton = styled.button`
  flex: 2;
  padding: 0.75rem;
    background: linear-gradient(90deg, #E91E63, #9C27B0);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.95rem;
  }
`

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

const FormFooter = styled.div`
  text-align: center;
`

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`

const FooterLink = styled(Link)`
  color: #E91E63;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
     color: #9C27B0;
    text-decoration: underline;
  }
`

const VerificationContainer = styled.div`
  text-align: center;
  
  h2 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
`

const VerificationIcon = styled.div`
  margin: 0 auto 1.5rem;
  width: 80px;
  height: 80px;
`

const VerificationNote = styled.div`
  background-color: rgba(244, 197, 66, 0.1);
  border-left: 3px solid #F4C542;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  border-radius: 0 8px 8px 0;
`

const ResendButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
`

export default Register

