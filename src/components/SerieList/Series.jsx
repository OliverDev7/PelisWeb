"use client"
import styled, { keyframes } from "styled-components"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiSmile, FiArrowLeft } from "react-icons/fi"

const Series = () => {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <ContentWrapper
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <IconContainer
          as={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        >
          <FiSmile size={80} />
        </IconContainer>

        <Title
          as={motion.h1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          En desarrollo
        </Title>

        <Subtitle
          as={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Estamos trabajando para que esta sección esté disponible lo antes posible. Sabemos que quieres disfrutar de
          tus series favoritas, y estamos haciendo todo lo posible para traerte el mejor contenido con la calidad que
          mereces.
        </Subtitle>

        <ComingSoonText
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span>Pronto</span>
        </ComingSoonText>

        <BackButton
          as={motion.button}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
        >
          <FiArrowLeft size={18} />
          <span>Volver a películas</span>
        </BackButton>
      </ContentWrapper>
    </PageContainer>
  )
}

export default Series

// Animaciones
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

// Estilos
const PageContainer = styled.div`
  background-color: #0a0a0a;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  padding-top: 100px;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    padding-top: 80px;
  }
`

const ContentWrapper = styled.div`
  max-width: 700px;
  text-align: center;
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`

const IconContainer = styled.div`
  color: #E91E63;
  margin-bottom: 1.5rem;
  animation: ${pulse} 3s infinite ease-in-out;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    
    svg {
      width: 60px;
      height: 60px;
    }
  }
`

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #E91E63, #9C27B0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: ${gradientMove} 5s ease infinite;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`

const Subtitle = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }
`

const ComingSoonText = styled.div`
  display: inline-block;
  margin-bottom: 2rem;
  
  span {
    background: rgba(233, 30, 99, 0.2);
    color: #E91E63;
    font-weight: 600;
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    
    span {
      font-size: 1rem;
      padding: 0.4rem 1.2rem;
    }
  }
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(to right, #E91E63, #9C27B0);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.3rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`

