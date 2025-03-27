import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState('Ingresar');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  //Obtención del usuario desde el contexto de autenticación
  const { user } = useAuth();

  //useEffect para verificar la verificación del correo electrónico del usuario
  useEffect(() => {
    if (user && navigator.onLine) {
      const checkVerification = async () => {
        try {
          await auth.currentUser.reload();
          setIsEmailVerified(auth.currentUser.emailVerified);
        } catch (e) {
          console.log(e);
        }
      }

      checkVerification();
      const interval = setInterval(checkVerification, 5000);
      return () => clearInterval(interval);
    } else {
      setIsEmailVerified(false);
    }
  }, [user]);

  //creacion de handleLogOut para cerrar cesion
  const handleLogOut = async () => {
    try {
      await signOut(auth); // 'auth' es tu objeto de autenticación de Firebase
      navigate('/signIn'); // Redirige a la página de inicio de sesión
    } catch (e) {
      console.log("Error al cerrar sesión:", e);
    }
  };


  const handleButtonClick = () => {
    if (buttonText === "Ingresar") {
      setButtonText("Registrarme");
      navigate("/signIn");
    } else {
      setButtonText("Ingresar");
      navigate("/register");
    }
  };

  const truncateEmail = (email) => (email.length > 12 ? email.slice(0, 12) + '...' : email);

  return (
    <Nav>
      {/*Navbar left */}
      <LeftMenu>
        <Title>Pelis Web</Title>
        {/* Aquí llamamos a "isEmailVerified" */}
        {isEmailVerified && user && (
          <DesktopMenu>
            <li>Peliculas</li>
            <li onClick={() => navigate('/series')}>Series</li>
          </DesktopMenu>
        )}
      </LeftMenu>
      {/*Navbar Right */}
      <RightMenu>
        {user ? (
          <>
            {/* Aquí por 2da vez llamamos a "isEmailVerified" */}
            {isEmailVerified && (
              <EmailAndLogout>
                <UserEmail>{truncateEmail(user.email)}</UserEmail>
                <LogoutButton onClick={handleLogOut}>Cerrar sesion</LogoutButton>
              </EmailAndLogout>
            )}
            {/*Menu responsivo */}
            {/* Aquí por 3ra vez llamamos a "isEmailVerified" */}
            {isEmailVerified && (
              <>
                <MenuToggle onClick={() => setMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? '✖' : '☰'}
                </MenuToggle>
                {isMenuOpen && (
                  <DropdownMenu>
                    <li>Peliculas</li>
                    <li onClick={() => navigate('/series')}>Series</li>
                    <Separator />
                    <DropEmail>{truncateEmail(user.email)}</DropEmail>
                    <Separator />
                    <LogoutButton onClick={handleLogOut}>Cerrar sesion</LogoutButton>
                  </DropdownMenu>
                )}
              </>
            )}
          </>
        ) : (
          <LoginButton onClick={handleButtonClick}>
            {buttonText}
          </LoginButton>
        )}
      </RightMenu>
    </Nav>
  );
};

export default Header;




// Styled Components
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #090b13;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  z-index: 3;
`;

const LoginButton = styled.button`
  background-color: #fff;
  border: 4px solid;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  color: #000;
  animation: borderColorChange 4s linear infinite, textColorChange 4s linear infinite;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #000;
    color: #fff;
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
    border-width: 2px;
  }

  @keyframes borderColorChange {
    0% {
      border-color: rgb(180, 105, 6);
    }
    25% {
      border-color: rgb(145, 54, 107);
    }
    50% {
      border-color: rgb(48, 69, 189);
    }
    75% {
      border-color: #6a0dad;
    }
    100% {
      border-color: #33b5ff;
    }
  }

  @keyframes textColorChange {
    0% {
      color: rgb(180, 105, 6);
    }
    25% {
      color: rgb(145, 54, 107);
    }
    50% {
      color: rgb(48, 69, 189);
    }
    75% {
      color: #6a0dad;
    }
    100% {
      color: #33b5ff;
    }
  }
`;


const LeftMenu = styled.div`
 display: flex;
 align-items: center;
 gap: 20px;
`;

const Title = styled.h1`
 font-size: 22px;
 font-weight: bold;
 color: white;
`;
const DesktopMenu = styled.ul`
 display: flex;
 gap: 20px;
 list-style: none;

 li{
  font-size: 19px;
  color: white;
  cursor: pointer;

  &:hover{
    text-decoration: underline
  }
 }

 @media(max-width: 768px){
  display: none;
 }
`;

const RightMenu = styled.div`
 display: flex;
 align-items: center;
 gap: 20px;

 @media(max-width: 768px){
  gap: 10px;
 }
`;

const EmailAndLogout = styled.div`
 display: flex;
 align-items: center;
 gap: 10px;

 @media(max-width: 768px){
  display: none;
 }
`;

const UserEmail = styled.span`
 font.size: 16px;
 color: white;
`;

const LogoutButton = styled.div`
 color: white;
 background-color: transparent;
 border: 1px solid white;
 padding: 0.5rem 1rem;
 border-radius: 5px;
 cursor: pointer;
 transition: background-color 0.2s ease, color 0.2 ease;

 &:hover{
  background-color: white;
  color: #282c34;
 }
`;

const MenuToggle = styled.div`
 font-size: 24px;
 color: white;
 cursor: pointer;

 @media (min-width: 768px){
 display: none;
 }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 70px;
  right: 10px;
  background-color: #1f1f1f;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  list-style: none;
  width: 200px;

  li {
    font-size: 16px;
    color: white;
    cursor: pointer;
    padding: 10px;

    &:hover {
      background-color: #333;
    }
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const DropEmail = styled.div`
 font-size: 14px;
 color: white;
 text-align: center;
`;

const Separator = styled.div`
 height: 1px;
 background-color: white;
 margin: 8px 0;
`;