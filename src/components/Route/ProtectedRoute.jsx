// Importamos el componente 'Navigate' de 
// 'react-router-dom' para redirigir al usuario en función de su estado de autenticación.
import { Navigate } from "react-router-dom";  // 'Navigate' 
// permite hacer redirecciones dentro de la aplicación React.
import { useAuth } from "../../context/AuthContext"; // Importamos el hook 'useAuth'
//  para acceder al contexto de autenticación (user y loading).

// Componente ProtectedRoute: un componente que restringe el acceso a rutas protegidas.
const ProtectedRoute = ({ children }) => {
  // Usamos el hook 'useAuth' para obtener los valores 'user' y 'loading' del contexto de autenticación.
  const { user, loading } = useAuth();

  // Si la información de autenticación aún se está cargando, mostramos un mensaje de carga.
  if (loading) {
    return <div></div>;  // Mientras 'loading' es true, el componente mostrará "Cargando...".
  }

  // Si el usuario está autenticado, renderizamos los 'children' 
  // (es decir, los componentes que fueron pasados dentro de <ProtectedRoute>).
  // Si el usuario no está autenticado, redirigimos al usuario a la página de inicio ("/").
  return user ? children : <Navigate to="/" replace />;  
  // Si el usuario está autenticado, se muestran los 'children'. 
  // Si no, se redirige al usuario a la página principal ("/").
};

// Exportamos el componente para que pueda ser utilizado en otras partes de la aplicación.
export default ProtectedRoute;