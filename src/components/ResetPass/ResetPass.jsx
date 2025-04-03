"use client"

import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { auth } from "../../firebase/firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"

const ResetPass = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Corregir el problema de verificación de correo electrónico
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      setError("Por favor, ingresa tu correo electrónico.")
      setLoading(false)
      return
    }

    if (!emailRegex.test(email)) {
      setError("Ingresa un correo electrónico válido.")
      setLoading(false)
      return
    }

    try {
      // Enviar directamente el correo de restablecimiento sin verificar si existe
      await sendPasswordResetEmail(auth, email)
      setMessage("Correo de restablecimiento enviado. Revisa tu bandeja de entrada.")
      setEmailSent(true)
      console.log("Correo enviado correctamente")
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)

      // Manejar errores específicos
      if (error.code === "auth/user-not-found") {
        setError("Este correo no está registrado en nuestra base de datos.")
      } else {
        setError("No se pudo enviar el correo. Inténtalo de nuevo.")
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
        {!emailSent ? (
          <>
            <FormHeader>
              <LockIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                    stroke="url(#lock-gradient)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z"
                    stroke="url(#lock-gradient)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                    stroke="url(#lock-gradient)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="lock-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#E91E63" />
                      <stop offset="1" stopColor="#9C27B0" />
                    </linearGradient>
                  </defs>
                </svg>
              </LockIcon>
              <FormTitle>Restablecer contraseña</FormTitle>
              <FormSubtitle>
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
              </FormSubtitle>
            </FormHeader>

            {error && (
              <ErrorAlert>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9945 16H12.0035"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{error}</span>
              </ErrorAlert>
            )}

            <form onSubmit={handleResetPassword}>
              <FormGroup>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                />
              </FormGroup>

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

              <SubmitButton type="submit" disabled={loading}>
                {loading ? <Spinner /> : "Enviar enlace de restablecimiento"}
              </SubmitButton>
            </form>
          </>
        ) : (
          <SuccessContainer>
            <SuccessIcon>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  stroke="url(#success-gradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.75 12L10.58 14.83L16.25 9.17"
                  stroke="url(#success-gradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="success-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4CAF50" />
                    <stop offset="1" stopColor="#2E7D32" />
                  </linearGradient>
                </defs>
              </svg>
            </SuccessIcon>
            <SuccessTitle>¡Correo enviado!</SuccessTitle>
            <SuccessMessage>
              Hemos enviado un enlace de restablecimiento de contraseña a <strong>{email}</strong>. Por favor, revisa tu
              bandeja de entrada y sigue las instrucciones.
            </SuccessMessage>
            <SuccessNote>Si no encuentras el correo, revisa tu carpeta de spam o correo no deseado.</SuccessNote>
            <ButtonGroup>
              <ResendButton onClick={handleResetPassword} disabled={loading}>
                {loading ? <Spinner /> : "Reenviar correo"}
              </ResendButton>
              <BackToLoginButton onClick={() => navigate("/signin")}>Volver a iniciar sesión</BackToLoginButton>
            </ButtonGroup>
          </SuccessContainer>
        )}

        <FormFooter>
          <FooterLink to="/signin">Volver a iniciar sesión</FooterLink>
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

// Ajustar los colores del formulario para mejor integración con el fondo
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

const LockIcon = styled.div`
  margin: 0 auto 1.5rem;
  width: 80px;
  height: 80px;
  background: rgba(233, 30, 99, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FormTitle = styled.h1`
  color: white;
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`

const FormSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
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
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #E91E63;
    box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 0.9rem;
    font-size: 0.95rem;
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
    margin-bottom: 1.25rem;
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

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: #E91E63;
  }
`

const SuccessContainer = styled.div`
  text-align: center;
`

const SuccessIcon = styled.div`
  margin: 0 auto 1.5rem;
`

const SuccessTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 0.75rem;
  }
`

const SuccessMessage = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 1.25rem;
  }
`

const SuccessNote = styled.div`
  background-color: rgba(244, 197, 66, 0.1);
  border-left: 3px solid #F4C542;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  border-radius: 0 8px 8px 0;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

const ResendButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const BackToLoginButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: linear-gradient(90deg, #E91E63, #9C27B0);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
  }
`

export default ResetPass

