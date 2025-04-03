"use client"

import { useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { motion } from "framer-motion"

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Configurar persistencia
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence)
        console.log("Persistencia configurada correctamente.")
      } catch (error) {
        console.error("Error al configurar la persistencia:", error)
      }
    }

    setAuthPersistence()

    // Verificar si hay un usuario autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuario autenticado:", user.email)
        navigate("/home")
      }
    })

    return () => unsubscribe() // Limpia el listener al desmontar el componente
  }, [navigate])

  return (
    <Container>
      <BackgroundOverlay />
      <Content>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <LogoContainer>
            <LogoIcon>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="url(#paint0_linear)"
                  strokeWidth="2"
                />
                <path d="M16 12L10 16.5V7.5L16 12Z" fill="url(#paint1_linear)" />
                <defs>
                  <linearGradient id="paint0_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E91E63" />
                    <stop offset="1" stopColor="#9C27B0" />
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="10" y1="7.5" x2="16" y2="16.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E91E63" />
                    <stop offset="1" stopColor="#9C27B0" />
                  </linearGradient>
                </defs>
              </svg>
            </LogoIcon>
            <LogoText>MovieApp</LogoText>
          </LogoContainer>

          <HeroContent>
            <HeroTitle>Películas y series ilimitadas</HeroTitle>
            <HeroSubtitle>Disfruta donde quieras. Cancela cuando quieras.</HeroSubtitle>

            <FeaturesGrid>
              <FeatureItem>
                <FeatureIcon>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"
                      stroke="url(#feature1)"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5"
                      stroke="url(#feature1)"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 13H12"
                      stroke="url(#feature1)"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 17H16"
                      stroke="url(#feature1)"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="feature1" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E91E63" />
                        <stop offset="1" stopColor="#9C27B0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </FeatureIcon>
                <FeatureText>Catálogo exclusivo</FeatureText>
              </FeatureItem>

              <FeatureItem>
                <FeatureIcon>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                      stroke="url(#feature2)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.1 12V10.5C9.1 8.5 10.6 7.6 12.4 8.7L13.7 9.4L15 10.1C16.8 11.2 16.8 13 15 14.1L13.7 14.8L12.4 15.5C10.6 16.6 9.1 15.7 9.1 13.7V12Z"
                      stroke="url(#feature2)"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="feature2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E91E63" />
                        <stop offset="1" stopColor="#9C27B0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </FeatureIcon>
                <FeatureText>Calidad HD</FeatureText>
              </FeatureItem>

              <FeatureItem>
                <FeatureIcon>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 20 4 22 9 22Z"
                      stroke="url(#feature2)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.5 8C13.5 8.82843 12.8284 9.5 12 9.5C11.1716 9.5 10.5 8.82843 10.5 8C10.5 7.17157 11.1716 6.5 12 6.5C12.8284 6.5 13.5 7.17157 13.5 8Z"
                      stroke="url(#feature2)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M13.5 16C13.5 16.8284 12.8284 17.5 12 17.5C11.1716 17.5 10.5 16.8284 10.5 16C10.5 15.1716 11.1716 14.5 12 14.5C12.8284 14.5 13.5 15.1716 13.5 16Z"
                      stroke="url(#feature2)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9.5 12C9.5 12.8284 8.82843 13.5 8 13.5C7.17157 13.5 6.5 12.8284 6.5 12C6.5 11.1716 7.17157 10.5 8 10.5C8.82843 10.5 9.5 11.1716 9.5 12Z"
                      stroke="url(#feature2)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M17.5 12C17.5 12.8284 16.8284 13.5 16 13.5C15.1716 13.5 14.5 12.8284 14.5 12C14.5 11.1716 15.1716 10.5 16 10.5C16.8284 10.5 17.5 11.1716 17.5 12Z"
                      stroke="url(#feature2)"
                      strokeWidth="1.5"
                    />
                    <defs>
                      <linearGradient id="feature3" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E91E63" />
                        <stop offset="1" stopColor="#9C27B0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </FeatureIcon>
                <FeatureText>Múltiples dispositivos</FeatureText>
              </FeatureItem>
            </FeaturesGrid>
          </HeroContent>

          <CTAContainer>
            <Link to="/register">
              <GetStartedButton>
                Comenzar ahora
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.4301 5.93005L20.5001 12.0001L14.4301 18.0701"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.5 12H20.33"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </GetStartedButton>
            </Link>
            <SignInLink to="/signin">¿Ya tienes cuenta? Inicia sesión</SignInLink>
          </CTAContainer>
        </motion.div>
      </Content>
    </Container>
  )
}

// Animaciones
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
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
    rgba(255, 4, 222, 0.24) 100%
  );
  background-size: cover;
  background-position: center;
  padding: 1rem;
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.34) 0%,
    rgba(26, 0, 33, 0.85) 100%
  );
  z-index: 1;
`

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 15px;
  }
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`

const LogoIcon = styled.div`
  margin-right: 0.5rem;
  animation: ${floatAnimation} 3s ease-in-out infinite;
`

const LogoText = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #E91E63, #9C27B0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const HeroContent = styled.div`
  margin-bottom: 3rem;
  max-width: 800px;
`

const HeroTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`

const FeaturesGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`

const FeatureText = styled.span`
  font-size: 1rem;
  color: white;
  font-weight: 500;
`

const CTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`

const GetStartedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(90deg, #E91E63, #9C27B0);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(233, 30, 99, 0.3);
  width: 100%;
  max-width: 300px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(233, 30, 99, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.875rem 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.75rem 1.5rem;
    max-width: 250px;
  }
`

const SignInLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #E91E63;
  }
`

export default Login

