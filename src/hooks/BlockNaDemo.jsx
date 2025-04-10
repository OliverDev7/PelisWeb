import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function useBlockBackNavigation(isAuthenticated) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Solo bloquear la navegación hacia atrás si el usuario está autenticado y en la ruta "/home"
    if (isAuthenticated && location.pathname === "/home") {
      // Agrega un estado al historial para evitar que el usuario retroceda
      window.history.pushState(null, "", window.location.href);

      // Función para manejar el evento popstate (navegación hacia atrás)
      const handleBackButton = (event) => {
        // Evita la navegación hacia atrás
        event.preventDefault();
        // Mantén al usuario en la ruta "/home"
        navigate("/home", { replace: true });
      };

      // Agrega el listener para el evento popstate
      window.addEventListener("popstate", handleBackButton);

      // Limpieza: Remueve el listener cuando el componente se desmonte o cambie la ruta
      return () => {
        window.removeEventListener("popstate", handleBackButton);
      };
    }
  }, [isAuthenticated, navigate, location.pathname]); // Dependencias del efecto
}

export default useBlockBackNavigation;