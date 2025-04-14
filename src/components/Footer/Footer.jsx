import styled from "styled-components"
import { Link } from "react-router-dom"
import Downloads from "../Downloads/Downloads"

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>
            <LogoIcon>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 2 12C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="url(#footer-logo-gradient)"
                  strokeWidth="2"
                />
                <path d="M16 12L10 16.5V7.5L16 12Z" fill="url(#footer-logo-gradient)" />
                <defs>
                  <linearGradient
                    id="footer-logo-gradient"
                    x1="2"
                    y1="2"
                    x2="22"
                    y2="22"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#E91E63" />
                    <stop offset="1" stopColor="#9C27B0" />
                  </linearGradient>
                </defs>
              </svg>
            </LogoIcon>
            <LogoText>MovieFilm</LogoText>
          </FooterLogo>
          <FooterTagline>Disfruta el contenido donde quieras.</FooterTagline>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Enlaces</FooterTitle>
          <FooterLinks>
            <FooterLink to="/">Inicio</FooterLink>
            <FooterLink to="/signin">Iniciar sesión</FooterLink>
            <FooterLink to="/register">Registrarse</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Legal</FooterTitle>
          <FooterLinks>
            <FooterLink to="/terminos">Términos y condiciones</FooterLink>
            <FooterLink to="/privacidad">Política de privacidad</FooterLink>
            <FooterLink to="/cookies">Política de cookies</FooterLink>
            <FooterLink to="/aboutus">Sobre nosotros</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Descargas</FooterTitle>
          <Downloads />
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <FooterCopyright>© {new Date().getFullYear()} MovieFilm. Todos los derechos reservados.</FooterCopyright>
        <SocialLinks>
          <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.5 3H7.5C5 3 3 5 3 7.5V16.5C3 19 5 21 7.5 21H16.5C19 21 21 19 21 16.5V7.5C21 5 19 3 16.5 3ZM12 15.75C9.93 15.75 8.25 14.07 8.25 12C8.25 9.93 9.93 8.25 12 8.25C14.07 8.25 15.75 9.93 15.75 12C15.75 14.07 14.07 15.75 12 15.75ZM17.25 7.5C16.83 7.5 16.5 7.17 16.5 6.75C16.5 6.33 16.83 6 17.25 6C17.67 6 18 6.33 18 6.75C18 7.17 17.67 7.5 17.25 7.5Z"
                fill="currentColor"
              />
            </svg>
          </SocialLink>
          <SocialLink href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.6 5C16.4 5.7 16.2 6.4 16.2 7.1C16.2 8.1 16.5 9 17 9.7C17.5 10.4 18.2 10.9 19 11.2V14.1C18.3 14 17.7 13.8 17.1 13.4C16.5 13 16 12.5 15.6 11.9C15.2 11.3 14.9 10.6 14.7 9.8C14.5 9.1 14.5 8.3 14.5 7.5V7.4L14.6 5H12.8C12.8 5.1 12.8 5.1 12.8 5.2V14.8C12.8 15.7 12.6 16.5 12.2 17.1C11.8 17.7 11.3 18.2 10.6 18.5C9.9 18.8 9.2 19 8.5 18.9C7.8 18.8 7.1 18.6 6.5 18.2C5.9 17.8 5.4 17.3 5.1 16.6C4.8 15.9 4.7 15.2 4.8 14.5C4.9 13.8 5.1 13.1 5.5 12.5C5.9 11.9 6.4 11.4 7.1 11.1C7.8 10.8 8.5 10.7 9.2 10.8V12.7C8.9 12.6 8.6 12.6 8.3 12.7C8 12.8 7.7 12.9 7.5 13.1C7.3 13.3 7.1 13.6 7 13.9C6.9 14.2 6.9 14.5 7 14.8C7.1 15.1 7.2 15.4 7.4 15.6C7.6 15.8 7.9 16 8.2 16.1C8.5 16.2 8.8 16.2 9.1 16.1C9.4 16 9.7 15.9 9.9 15.7C10.1 15.5 10.3 15.2 10.4 14.9C10.5 14.6 10.5 14.3 10.5 14V5H16.6Z"
                fill="currentColor"
              />
            </svg>
          </SocialLink>
        </SocialLinks>
      </FooterBottom>
    </FooterContainer>
  )
}

export default Footer

// Estilos
const FooterContainer = styled.footer`
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(10, 10, 10, 0.8));
  backdrop-filter: blur(10px);
  color: white;
  padding: 3rem 0 1.5rem;
  width: 100%;
  margin-top: auto;
  z-index: 10;
  position: relative;
  left: 0;
  right: 0;
  bottom: 0;
  
  @media (max-width: 768px) {
    padding: 2.5rem 0 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0 1rem;
  }
`

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
    gap: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1.5rem;
  }
`

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    min-width: 150px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`

const LogoIcon = styled.div`
  margin-right: 0.5rem;
`

const LogoText = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #E91E63, #9C27B0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`

const FooterTagline = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-top: 0.5rem;
`

const FooterTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: white;
  
  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
  }
`

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #E91E63;
  }
`

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 0;
    flex-direction: column;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem 0;
  }
`

const FooterCopyright = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin: 0;
`

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`

const SocialLink = styled.a`
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.2s ease;
  
  &:hover {
    color: #E91E63;
  }
`

