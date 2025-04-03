"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { auth } from "../../firebase/firebase"
import { signOut } from "firebase/auth"
import { motion, AnimatePresence } from "framer-motion"
import Search from "../Search/Search"

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [buttonText, setButtonText] = useState("Ingresar")
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)

  const { user } = useAuth()

  const hideHeaderPaths = ["/", "/register", "/signin", "/resetPass"]
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname)

  useEffect(() => {
    if (user && navigator.onLine) {
      const checkVerification = async () => {
        try {
          await auth.currentUser.reload()
          setIsEmailVerified(auth.currentUser.emailVerified)
        } catch (e) {
          console.log(e)
        }
      }

      checkVerification()
      const interval = setInterval(checkVerification, 5000)
      return () => clearInterval(interval)
    } else {
      setIsEmailVerified(false)
    }
  }, [user])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMenuOpen])

  const handleLogOut = async () => {
    try {
      await signOut(auth)
      navigate("/signin")
      setMenuOpen(false)
    } catch (e) {
      console.log("Error al cerrar sesión:", e)
    }
  }

  const handleButtonClick = () => {
    if (buttonText === "Ingresar") {
      setButtonText("Registrarme")
      navigate("/signin")
    } else {
      setButtonText("Ingresar")
      navigate("/register")
    }
  }

  const truncateEmail = (email) => (email?.length > 12 ? email.slice(0, 12) + "..." : email)

  if (!shouldShowHeader) {
    return null
  }

  return (
    <NavbarContainer>
      <NavbarContent>
        <LeftSection>
          <LogoContainer onClick={() => navigate("/home")}>
            <LogoIcon>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="url(#logo-gradient)"
                  strokeWidth="2"
                />
                <path d="M16 12L10 16.5V7.5L16 12Z" fill="url(#logo-gradient)" />
                <defs>
                  <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E91E63" />
                    <stop offset="1" stopColor="#9C27B0" />
                  </linearGradient>
                </defs>
              </svg>
            </LogoIcon>
            <LogoText>MovieApp</LogoText>
          </LogoContainer>

          {isEmailVerified && user && (
            <NavLinks>
              <NavLink active={location.pathname === "/home"} onClick={() => navigate("/home")}>
                Películas
                {location.pathname === "/home" && <ActiveIndicator layoutId="activeIndicator" />}
              </NavLink>
              <NavLink active={location.pathname === "/series"} onClick={() => navigate("/series")}>
                Series
                {location.pathname === "/series" && <ActiveIndicator layoutId="activeIndicator" />}
              </NavLink>
              <NavLink active={location.pathname === "/mylist"} onClick={() => navigate("/mylist")}>
                Mi Lista
                {location.pathname === "/mylist" && <ActiveIndicator layoutId="activeIndicator" />}
              </NavLink>
            </NavLinks>
          )}
        </LeftSection>

        <CenterSection>
          {isEmailVerified && user && <Search />}
        </CenterSection>

        <RightSection>
          {user ? (
            <>
              {isEmailVerified && (
                <UserSection>
                  <UserAvatar>
                    {user.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.displayName || user.email} />
                    ) : (
                      <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    )}
                  </UserAvatar>
                  <UserInfo>
                    <UserName>{user.displayName || truncateEmail(user.email)}</UserName>
                    <LogoutButton onClick={handleLogOut}>Cerrar sesión</LogoutButton>
                  </UserInfo>
                </UserSection>
              )}

              <MenuToggle onClick={() => setMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </MenuToggle>
            </>
          ) : (
            <LoginButton onClick={handleButtonClick}>{buttonText}</LoginButton>
          )}
        </RightSection>
      </NavbarContent>

      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {isEmailVerified && user && (
              <>
                <MobileSearchSection>
                  <Search />
                </MobileSearchSection>
                <MobileDivider />
                <MobileMenuItem
                  onClick={() => {
                    navigate("/home")
                    setMenuOpen(false)
                  }}
                >
                  <MenuIcon>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.1 12V10.5C9.1 8.5 10.6 7.6 12.4 8.7L13.7 9.4L15 10.1C16.8 11.2 16.8 13 15 14.1L13.7 14.8L12.4 15.5C10.6 16.6 9.1 15.7 9.1 13.7V12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </MenuIcon>
                  <span>Películas</span>
                </MobileMenuItem>
                <MobileMenuItem
                  onClick={() => {
                    navigate("/series")
                    setMenuOpen(false)
                  }}
                >
                  <MenuIcon>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.52 7.11H21.48"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.52 2.11V6.97"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.48 2.11V6.52"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.75 14.45V13.25C9.75 11.71 10.84 11.08 12.17 11.85L13.21 12.45L14.25 13.05C15.58 13.82 15.58 15.08 14.25 15.85L13.21 16.45L12.17 17.05C10.84 17.82 9.75 17.19 9.75 15.65V14.45V14.45Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </MenuIcon>
                  <span>Series</span>
                </MobileMenuItem>
                <MobileDivider />
                <MobileUserInfo>
                  <UserAvatar>
                    {user.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.displayName || user.email} />
                    ) : (
                      <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    )}
                  </UserAvatar>
                  <MobileUserDetails>
                    <MobileUserName>{user.displayName || truncateEmail(user.email)}</MobileUserName>
                    <MobileUserEmail>{user.email}</MobileUserEmail>
                  </MobileUserDetails>
                </MobileUserInfo>
                <MobileDivider />
                <MobileLogoutButton onClick={handleLogOut}>
                  <MenuIcon>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8.90002 7.56023C9.21002 3.96023 11.06 2.49023 15.11 2.49023H15.24C19.71 2.49023 21.5 4.28023 21.5 8.75023V15.2702C21.5 19.7402 19.71 21.5302 15.24 21.5302H15.11C11.09 21.5302 9.24002 20.0802 8.91002 16.5402"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 12H3.62"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.85 8.65039L2.5 12.0004L5.85 15.3504"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </MenuIcon>
                  <span>Cerrar sesión</span>
                </MobileLogoutButton>
              </>
            )}
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavbarContainer>
  )
}

export default Header

// Estilos
const NavbarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 80%, transparent 100%);
  backdrop-filter: blur(10px);
`

const NavbarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 1rem;
  max-width: 1400px;
  margin: 0 auto;
  gap: 1rem;  // Espacio consistente entre elementos

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;  // Reducido de 2rem
  min-width: fit-content;  // Asegura que no colapse
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #E91E63, #9C27B0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`

const NavLinks = styled.nav`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled.a`
  color: ${(props) => (props.active ? "white" : "rgba(255, 255, 255, 0.7)")};
  font-size: 1rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: pointer;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  
  &:hover {
    color: white;
  }
`

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, #E91E63, #9C27B0);
  border-radius: 2px;
`

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 200px;  // Ancho mínimo garantizado
  max-width: 500px;
  margin: 0 1rem;
  padding: 0 0.5rem;
  transition: all 0.3s ease;

  @media (max-width: 1200px) {
    max-width: 400px;
  }

  @media (max-width: 992px) {
    max-width: 350px;
  }

  @media (max-width: 850px) {
    max-width: 300px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(to right, #E91E63, #9C27B0);
  display: flex;
  align-items: center;
  justify-content: center;
`

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
`

const LogoutButton = styled.button`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease;
  
  &:hover {
    color: #E91E63;
  }
`

const MenuToggle = styled.button`
  background: transparent;
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 999;
`

const MobileSearchSection = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    width: calc(100% - 2rem);
    margin: 0 auto;
    padding: 0.5rem 0;
    
    form {
      width: 100%;
    }
    
    input {
      width: 100%;
      padding: 0.75rem 1rem;
    }
  }
`

const MobileMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
`

const MobileDivider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
`

const MobileUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
`

const MobileUserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const MobileUserName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
`

const MobileUserEmail = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`

const MobileLogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
    border-color: #E91E63;
  }
`

const LoginButton = styled.button`
  background: linear-gradient(to right, #E91E63, #9C27B0);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(233, 30, 99, 0.4);
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
`