import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { auth } from '../../firebase/firebase';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import fondo from '../../assets/img/fondo_login.jpg';

const ResetPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError('Por favor, ingresa tu correo electrónico.');
      setLoading(false); 
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Ingresa un correo electrónico válido.');
      setLoading(false);
      return;
    }

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email)
      .then((methods) => methods)
      .catch((error) => {
        if(error.code === "auth/user-not-found") {
          return [];
        }
        throw error;
      });

      if (signInMethods.length === 0) {
        setError('Este correo no se encuentra registrado.');
        setLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setMessage('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
      console.log("Correo enviado correctamente"); 
    } catch (error) {
      setError('No se pudo enviar el correo. Inténtalo de nuevo.');
      console.error('Error al restablecer contraseña:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormReset>
        <Title>Restablecer Contraseña</Title>
        {message && <SuccessMessage>{message}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleResetPassword}>
          <InputGroup>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          <ButtonReset type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </ButtonReset>
        </form>
        <SecurityMessage>⚠ Recuerda usar contraseñas seguras.</SecurityMessage>
        <LinksContainer>
          <LinkText onClick={() => navigate('/signin')}>Volver</LinkText>
        </LinksContainer>
      </FormReset>
    </Container>
  );
};

// Estilos
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${fondo});
  padding: 20px;
`;

const FormReset = styled.div`
  background-color: #1e2837;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const Title = styled.h1`
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 700;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: rgb(206, 206, 206);
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background-color: #31343e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ButtonReset = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg,
   #ff9305, #913e6b, #3045bd, #6a0dad, #33b5ff);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 5s ease infinite;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ErrorMessage = styled.p`
  color:rgb(255, 0, 0);
  font-size: 0.875rem;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: #4caf50;
  font-size: 0.875rem;
  text-align: center;
`;

const SecurityMessage = styled.p`
  color: #f4c542;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 10px;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  color: white;
`;

const LinkText = styled.p`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default ResetPass;
