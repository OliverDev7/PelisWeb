// Importación de la hoja de estilos CSS para el componente de la aplicación.
import './App.css';

// Importación de componentes y funciones necesarias para el enrutamiento y la gestión de rutas en la aplicación.
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de los componentes utilizados en las rutas de la aplicación.
import Login from './components/Login/Login';  // Componente de la pantalla de inicio de sesión.
import Header from './components/Header/Header';  // Componente de la cabecera de la página.
import Register from './components/Register/Register';  // Componente de la pantalla de registro.
import Home from './components/Home/HomeDemo';  // Componente de la página de inicio, accesible solo después de iniciar sesión.
import SignIn from './components/SignIn/SignIn';  // Componente de la página de autenticación/sign-in.
import ResetPass from './components/ResetPass/ResetPass';  // Componente de la página para restablecer la contraseña.
import { AuthProvider, useAuth } from "./context/AuthContext";  // Importación de contexto y hook para gestionar la autenticación.
import ProtectedRoute from "./components/Route/ProtectedRoute";  // Componente que protege rutas privadas de usuarios no autenticados.
import useBlockBackNavigation from "./hooks/BlockNavigation";  // Hook personalizado para bloquear la navegación hacia atrás en el navegador.
import Detail from "./components/Detail/Detail";  // Componente para ver los detalles de un elemento.
import SeriesDetail from './components/SerieDetail/SerieDetail';  // Componente para ver detalles específicos de una serie.
import SeriesList from './components/SerieList/SerieList';  // Componente para mostrar una lista de series.

function App() {
  // La función App es el componente principal de la aplicación.

  return (
    // Envolver toda la aplicación dentro de BrowserRouter para que se manejen las rutas de la SPA (Single Page Application).
    <BrowserRouter>
      {/* Proporcionar el contexto de autenticación a todos los componentes hijos. */}
      <AuthProvider>
        {/*Componente que manejará el contenido de la aplicación.*/}
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

function AppContent() {
  // La función AppContent es un componente que maneja las rutas y la estructura principal de la aplicación.

  // Obtiene el estado de autenticación del usuario desde el contexto AuthContext.
  const { user } = useAuth();

  // Llama al hook para bloquear la navegación hacia atrás si el usuario está autenticado.
  useBlockBackNavigation(!!user);

  return (
    <>
      {/* Renderiza el componente de cabecera, que está presente en todas las páginas. */}
      <Header />

      {/* Definición de las rutas y los componentes asociados. */}
      <Routes>
        {/* Ruta para la pantalla de inicio de sesión */}
        <Route path="/" element={<Login />} />
        
        {/* Ruta para la pantalla de registro */}
        <Route path="/register" element={<Register />} />
        
        {/* Ruta para la pantalla de inicio de sesión alternativa */}
        <Route path="/signIn" element={<SignIn />} />
        
        {/* Ruta para la pantalla de restablecimiento de contraseña */}
        <Route path="/resetPass" element={<ResetPass />} />
        
        {/* Ruta para ver detalles de un elemento con un parámetro dinámico (id) */}
        <Route path="/detail/:id" element={<Detail />} />
        
        {/* Ruta para ver la lista de series */}
        <Route path="/series" element={<SeriesList />} />
        
        {/* Ruta para ver los detalles de una serie específica */}
        <Route path="/series/:id" element={<SeriesDetail />} />
        
        {/* Ruta protegida, solo accesible si el usuario está autenticado */}
        <Route
          path="/home"
          element={
            // El componente ProtectedRoute envuelve el componente Home para asegurarse de que solo los usuarios autenticados puedan acceder.
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

// Exporta el componente App para que sea utilizado en otras partes de la aplicación.
export default App;
