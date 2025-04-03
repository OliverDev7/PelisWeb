"use client"

import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { auth } from "../../firebase/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"
import { motion } from "framer-motion"

const SignIn = () => {
  const navigate = useNavigate()
  const [userOrEmail, setUserOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const validateFields = () => {
    const newErrors = {}

    if (!userOrEmail) {
      newErrors.userOrEmail = "El campo de usuario o correo electrónico es obligatorio."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userOrEmail) && userOrEmail.length < 5) {
      newErrors.userOrEmail = "El nombre de usuario debe tener al menos 5 caracteres o ingrese un correo válido."
    }

    if (!password) {
      newErrors.password = "El campo de contraseña es obligatorio."
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError("")
    setErrors({})
    setLoading(true)

    if (!validateFields()) {
      setLoading(false)
      return
    }

    try {
      const db = getFirestore()
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userOrEmail)

      const usersRef = collection(db, "Users")
      const q = query(usersRef, where(isEmail ? "email" : "username", "==", userOrEmail))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setLoginError("No se encontró un usuario con este identificador.")
        setLoading(false)
        return
      }

      const userData = querySnapshot.docs[0].data()
      const email = userData.email

      await signInWithEmailAndPassword(auth, email, password)
      navigate("/home", { replace: true })
    } catch (error) {
      console.error("Error al iniciar sesión:", error)

      if (error.code === "auth/wrong-password") {
        setLoginError("La contraseña es incorrecta. Inténtalo de nuevo.")
      } else if (error.code === "auth/user-not-found") {
        setLoginError("No se encontró un usuario con este identificador.")
      } else {
        setLoginError("Ocurrió un error al iniciar sesión. Inténtalo de nuevo.")
      }
    } finally {
      setLoading(false)
    }
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
          <FormTitle>Iniciar sesión</FormTitle>
          <FormSubtitle>Bienvenido de nuevo</FormSubtitle>
        </FormHeader>

        {loginError && (
          <ErrorAlert>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M11.9945 16H12.0035"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{loginError}</span>
          </ErrorAlert>
        )}

        <form onSubmit={handleLogin}>
          <FormGroup>
            <Label htmlFor="userOrEmail">Correo o Nombre de Usuario</Label>
            <Input
              id="userOrEmail"
              type="text"
              value={userOrEmail}
              onChange={(e) => setUserOrEmail(e.target.value)}
              error={errors.userOrEmail}
              placeholder="Ingresa tu correo o nombre de usuario"
            />
            {errors.userOrEmail && <ErrorMessage>{errors.userOrEmail}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Contraseña</Label>
            <PasswordWrapper>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Ingresa tu contraseña"
              />
              <TogglePasswordButton onClick={togglePasswordVisibility} type="button">
                {showPassword ? (
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
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>

          <ForgotPasswordLink to="/resetPass">¿Olvidaste tu contraseña?</ForgotPasswordLink>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Iniciar sesión"}
          </SubmitButton>
        </form>

        <FormFooter>
          <FooterText>
            ¿No tienes cuenta? <FooterLink to="/register">Regístrate</FooterLink>
          </FooterText>
        </FormFooter>
      </FormCard>
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
  background-color: rgba(20, 25, 35, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  
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
  margin-bottom: 2rem;
`

const FormTitle = styled.h1`
  color: white;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`

const FormSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`

const ErrorAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(255, 77, 79, 0.1);
  border-left: 3px solid #ff4d4f;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #ff4d4f;
  border-radius: 0 8px 8px 0;
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
  }
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
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
  padding: 0.875rem 1rem;
  background-color: rgba(49, 52, 62, 0.7);
  border: 1px solid ${(props) => (props.error ? "#ff4d4f" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.error ? "#ff4d4f" : "#E91E63")};
    box-shadow: 0 0 0 2px ${(props) => (props.error ? "rgba(255, 77, 79, 0.2)" : "rgba(233, 30, 99, 0.2)")};
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 0.9rem;
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
    color: #E91E63;
  }
`

const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  color: #E91E63;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #9C27B0;
    text-decoration: underline;
  }
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
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
  margin-bottom: 1.5rem;

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
    padding: 0.75rem;
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

export default SignIn

