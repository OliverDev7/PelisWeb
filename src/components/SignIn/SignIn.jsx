import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { auth } from '../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import fondo from '../../assets/img/fondo_login.jpg'

const SignIn = () => {
  // Usamos el hook `useNavigate` de React Router para permitir la navegación programática a otras rutas
  const navigate = useNavigate();

  // Definimos los estados para controlar los valores de los campos del formulario
  // `userOrEmail` puede ser un nombre de usuario o un correo electrónico
  const [userOrEmail, setUserOrEmail] = useState('');
  // `password` guarda la contraseña ingresada por el usuario
  const [password, setPassword] = useState('');
  // `loginError` almacena el mensaje de error en caso de fallo de inicio de sesión
  const [loginError, setLoginError] = useState('');
  // `errors` es un objeto para almacenar los errores de validación de los campos
  const [errors, setErrors] = useState({});
  // `loading` es un estado booleano que indica si la acción de inicio de sesión está en progreso
  const [loading, setLoading] = useState(false);
  // `showPassword` controla la visibilidad de la contraseña (si se debe mostrar o no)
  const [showPassword, setShowPassword] = useState(false);

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    // Cambia el valor del estado `showPassword` entre verdadero y falso para mostrar/ocultar la contraseña
    setShowPassword((prev) => !prev);
  };

  // Función de validación de los campos de usuario y contraseña
  const validateFields = () => {
    // Creamos un objeto `newErrors` que almacenará los posibles errores de validación
    const newErrors = {};

    // Validación para el campo "usuario o correo electrónico"
    if (!userOrEmail) {
      // Si el campo está vacío, se agrega un mensaje de error
      newErrors.userOrEmail = 'El campo de usuario o correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userOrEmail) && userOrEmail.length < 5) {
      // Si no es un correo válido y tiene menos de 5 caracteres, mostramos un error
      newErrors.userOrEmail = 'El nombre de usuario debe tener al menos 5 caracteres o ingrese un correo válido.';
    }

    // Validación para el campo "contraseña"
    if (!password) {
      // Si el campo está vacío, mostramos un error
      newErrors.password = 'El campo de contraseña es obligatorio.';
    } else if (password.length < 6) {
      // Si la contraseña tiene menos de 6 caracteres, mostramos un error
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    // Actualizamos el estado de errores con los nuevos errores encontrados
    setErrors(newErrors);
    // Si no hay errores, retornamos `true`, si hay errores, retornamos `false`
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el inicio de sesión al hacer clic en el botón de "iniciar sesión"
  const handleLogin = async (e) => {
    // Prevenimos el comportamiento por defecto del formulario (que es recargar la página)
    e.preventDefault();

    // Limpiamos el mensaje de error de inicio de sesión previo
    setLoginError('');
    // Limpiamos los errores de validación previos
    setErrors({});
    // Activamos el indicador de carga
    setLoading(true);

    // Verificamos si los campos son válidos antes de intentar iniciar sesión
    if (!validateFields()) {
      // Si hay errores de validación, desactivamos el indicador de carga y salimos de la función
      setLoading(false);
      return;
    }

    try {
      // Obtenemos la referencia a la base de datos de Firestore
      const db = getFirestore();
      // Verificamos si el campo `userOrEmail` contiene un correo electrónico
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userOrEmail);

      // Buscamos una referencia a la colección "Users" en Firestore
      const usersRef = collection(db, 'Users');
      // Creamos una consulta para buscar el usuario en Firestore, dependiendo de si es email o nombre de usuario
      const q = query(usersRef, where(isEmail ? 'email' : 'username', '==', userOrEmail));
      // Ejecutamos la consulta para obtener los documentos que coincidan
      const querySnapshot = await getDocs(q);

      // Si no encontramos ningún documento (usuario), mostramos un error
      if (querySnapshot.empty) {
        setLoginError('No se encontró un usuario con este identificador.');
        setLoading(false);
        return;
      }

      // Si encontramos un usuario, obtenemos los datos del primer usuario encontrado
      const userData = querySnapshot.docs[0].data();
      // Extraemos el correo electrónico del usuario
      const email = userData.email;

      // Intentamos iniciar sesión con Firebase Authentication usando el correo electrónico y la contraseña
      await signInWithEmailAndPassword(auth, email, password);

      // Si el inicio de sesión es exitoso, redirigimos al usuario a la página de inicio
      navigate('/home', {replace: true});
    } catch (error) {
      // Si ocurre un error durante el inicio de sesión, lo mostramos en la consola
      console.error('Error al iniciar sesión:', error);

      // Manejo de errores específicos de Firebase
      if (error.code === 'auth/wrong-password') {
        // Si la contraseña es incorrecta, mostramos un mensaje de error
        setLoginError('La contraseña es incorrecta. Inténtalo de nuevo.');
      } else if (error.code === 'auth/user-not-found') {
        // Si el usuario no se encuentra, mostramos un mensaje de error
        setLoginError('No se encontró un usuario con este identificador.');
      } else {
        // Para otros errores, mostramos un mensaje genérico
        setLoginError('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      // En cualquier caso (éxito o error), desactivamos el indicador de carga
      setLoading(false);
    }
  };
  return (
    <Container>
      <FormLogin>
        <Title>Iniciar sesión</Title>
        {loginError && <ErrorMessage>{loginError}</ErrorMessage>} {/* Mensaje de error global */}
        <form onSubmit={handleLogin}>
          <InputGroup>
            <Label htmlFor="userOrEmail">Correo o Nombre de Usuario</Label>
            <Input
              id="userOrEmail"
              type="text"
              value={userOrEmail}
              onChange={(e) => setUserOrEmail(e.target.value)}
            />
            {errors.userOrEmail && <ErrorMessage>{errors.userOrEmail}</ErrorMessage>} {/* Mensaje de error individual */}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Contraseña</Label>
            <PasswordWrapper>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TogglePasswordButton onClick={togglePasswordVisibility} type="button">
                {showPassword ? 'Ocultar' : 'Ver'}
              </TogglePasswordButton>
            </PasswordWrapper>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>} {/* Mensaje de error individual */}
          </InputGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
        <LinksContainer>
          <LinkText onClick={() => navigate('/resetPass')}>¿Olvidaste tu contraseña?</LinkText>
          <LinkText onClick={() => navigate('/register')}>¿No tienes cuenta? Registrate</LinkText>
        </LinksContainer>
      </FormLogin>
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

const FormLogin = styled.div`
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
  font-size: 28px;
  margin-bottom: 24px;
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

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #ff9305, #913e6b, #3045bd, #6a0dad, #33b5ff);
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

const PasswordWrapper = styled.div`
  position: relative;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  color: white;
`;

const LinkText = styled.p`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
`;

export default SignIn;
