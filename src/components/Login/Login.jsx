import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import fondo from '../../assets/img/fondo_login.jpg'

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar persistencia
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log('Persistencia configurada correctamente.');
      } catch (error) {
        console.error('Error al configurar la persistencia:', error);
      }
    };

    setAuthPersistence();

    // Verificar si hay un usuario autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Usuario autenticado:', user.email);
        navigate('/home');
      }
    });

    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, [navigate]);

  return (
    <Container>
      <Content>
        <Link to="/register">
          <Account>
            <Titulo>Movies</Titulo>
            <SignUp>Empieza ahora</SignUp>
            <Description>Únete ahora y obtén películas gratis para ver...</Description>
          </Account>
        </Link>
        <BgImagen />
      </Content>
    </Container>
  );
};

// Estilos del componente
const Account = styled.div`
  max-width: 650px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Titulo = styled.h1`
  color: #fff;
  font-size: 45px;
  margin: 0 0 24px;
  line-height: 1.5;
  letter-spacing: 1.5px;

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const animacionBoton = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const SignUp = styled.a`
  background: linear-gradient(135deg, rgb(255, 147, 5), rgb(145, 54, 107), rgb(48, 69, 189), #6a0dad, #33b5ff);
  background-size: 300% 300%;
  color: #fff;
  width: 100%;
  max-width: 450px;
  padding: 15px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  animation: ${animacionBoton} 6s ease infinite;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.4);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 12px 16px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 12px 16px;
  }
`;

const Description = styled.p`
  color: #fff;
  font-size: 16px;
  line-height: 1.5;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-top: 16px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 12px;
  }
`;

const Container = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${fondo});
  height: 100vh;
  background-color: #000;
  overflow: hidden;
`;

const Content = styled.div`
  position: relative;
  padding: 80px 40px;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 60px 20px;
  }

  @media (max-width: 480px) {
    padding: 40px 10px;
  }
`;



const BgImagen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.9; /* Ajusta la opacidad si es necesario */
  z-index: -1;
`;


export default Login;
