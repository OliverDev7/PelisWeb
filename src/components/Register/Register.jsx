import { useState, useEffect } from "react";
import styled, {keyframes} from "styled-components";
import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import fondo from '../../assets/img/fondo_login.jpg';

const Register = () => {
  const navigate = useNavigate();

  // Estados para manejar los campos de formulario y validaciones
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storedPassword, setStoredPassword] = useState("");
  const [storedConfirmPassword, setStoredConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  const handleChangeEmail = () => {
    setStoredPassword(password);
    setStoredConfirmPassword(confirmPassword);
    setShowPassword(false);
  };

  useEffect(() => {
    if (showPassword) {
      setPassword(storedPassword);
      setConfirmPassword(storedConfirmPassword);
    }
  }, [showPassword]);

  const validateUsername = () => {
    if (!username) {
      setUsernameError("* El nombre de usuario es requerido *");
      return false;
    }
    if (username.length < 5) {
      setUsernameError("* El nombre de usuario debe tener al menos 5 caracteres *");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("* El correo es requerido *");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("* Ingresa un correo electrónico válido *");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    let isValid = true;
    if (!password) {
      setPasswordError("* La contraseña es requerida *");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("* La contraseña debe tener al menos 6 caracteres *");
      isValid = false;
    } else {
      setPasswordError("");
    }
    if (!confirmPassword) {
      setConfirmPasswordError("* La confirmación de contraseña es requerida *");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("* Las contraseñas no coinciden *");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }
    return isValid;
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (validateUsername() && validateEmail()) {
      setShowPassword(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPasswords((prev) => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar el checkbox de términos y condiciones
    if (!acceptedTerms) {
      setTermsError("Debes aceptar los términos y condiciones para registrarte.");
      return;
    } else {
      setTermsError(""); // Limpiar el error si el checkbox está marcado
    }

    // Ejecuta las validaciones de los demás campos
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    // Si alguna validación falla, detén el proceso
    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "Users", user.uid), {
        username,
        email,
        createdAt: new Date(),
      }, { merge: true });

      setIsVerificationPending(true);
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Este correo ya está registrado. Intenta con otro.");
      } else if (error.code === "auth/weak-password") {
        alert("La contraseña es muy débil. Intenta con una más segura.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkEmailVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await user.reload();
    if (user.emailVerified) {
      navigate("/home", { replace: true });
    }
  };

  useEffect(() => {
    if (isVerificationPending) {
      const interval = setInterval(async () => {
        await checkEmailVerification();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVerificationPending]);

  if (isVerificationPending) {
    return (
      <Container>
        <VerificationMessage>
          <h2>Verifica tu correo electrónico</h2>
          <p>
            Te hemos enviado un enlace de verificación a tu correo. Por favor,
            revisa tu bandeja de entrada y sigue las instrucciones para continuar.
          </p>
        </VerificationMessage>
      </Container>
    );
  }

  return (
    <Container>
      <FormLogin>
        <Title>Registro</Title>
        <form onSubmit={showPassword ? handleRegister : handleUsernameSubmit}>
          {!showPassword ? (
            <>
              <InputGroup>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={validateUsername}
                />
                {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
              </InputGroup>
              <InputGroup>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                />
                {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
              </InputGroup>
            </>
          ) : (
            <>
              <InputGroup>
                <Label htmlFor="password">Contraseña</Label>
                <PasswordWrapper>
                  <Input
                    id="password"
                    type={showPasswords ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                  />
                  <TogglePasswordButton onClick={togglePasswordVisibility} type="button">
                    {showPasswords ? "Ocultar" : "Ver"}
                  </TogglePasswordButton>
                </PasswordWrapper>
                {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
              </InputGroup>
              <InputGroup>
                <Label htmlFor="ConfirmPass">Confirmar contraseña</Label>
                <PasswordWrapper>
                  <Input
                    id="ConfirmPass"
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={validatePassword}
                  />
                  <TogglePasswordButton onClick={togglePasswordVisibility} type="button">
                    {showPasswords ? "Ocultar" : "Ver"}
                  </TogglePasswordButton>
                </PasswordWrapper>
                {confirmPasswordError && <ErrorMessage>{confirmPasswordError}</ErrorMessage>}
              </InputGroup>
              <TermsContainer>
                <Checkbox
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <Label htmlFor="terms">
                  Al registrarte, aceptas nuestros <a href="/terminos-y-condiciones" target="_blank">términos y condiciones</a>.
                </Label>
              </TermsContainer>
              {termsError && <ErrorMessage>{termsError}</ErrorMessage>}
            </>
          )}
          <Button type="submit" disabled={isLoading || (showPassword && !acceptedTerms)}>
            {isLoading ? "Registrando..." : showPassword ? "Registrarme" : "Continuar"}
          </Button>
        </form>
        <LinksContainer>
          {showPassword && <ChangeEmail onClick={handleChangeEmail}>Cambiar correo</ChangeEmail>}
          <LinkText onClick={() => navigate('/signIn')}>¿Ya tienes cuenta? Ingresa aquí</LinkText>
        </LinksContainer>
        <SecurityMessage>⚠ Recuerda usar contraseñas seguras.</SecurityMessage>
      </FormLogin>
    </Container>
  );
};

export default Register;






// Estilos con Styled Components
const SecurityMessage = styled.p`
  color: #f4c542;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 10px;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  margin-top: 1rem;
`;

const LinkText = styled.p`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color:rgb(255, 255, 255);
`;

const VerificationMessage = styled.div`
  position: relative;
  color: white;
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
  margin-top: 5px;
`;

const ChangeEmail = styled.button`
  background: none;
  border: none;
  color:rgb(255, 255, 255);
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
`;

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

const TermsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  cursor: pointer;
`;