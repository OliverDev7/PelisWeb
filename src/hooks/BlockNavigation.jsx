// Importamos los hooks necesarios desde React y React Router
import { useEffect } from "react"; // useEffect es un hook que permite ejecutar efectos secundarios en componentes funcionales.
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate permite redirigir al usuario a otra página. useLocation proporciona información sobre la ruta actual.

function useBlockBackNavigation(isAuthenticated) {
    // useNavigate se usa para navegar entre rutas, nos proporciona una función para redirigir al usuario.
    const navigate = useNavigate();

    // useLocation nos da información sobre la ruta actual (por ejemplo, el path de la URL actual).
    const location = useLocation();

    // useEffect se ejecuta cuando el componente se monta o cuando cambia alguna de las dependencias especificadas.
    useEffect(() => {
        // Si el usuario está autenticado y está en la página "/home"
        if (isAuthenticated && location.pathname === "/home") {
            // La función pushState cambia el historial del navegador sin recargar la página.
            // Aquí, se está agregando una nueva entrada en el historial sin cambiar la URL visible.
            window.history.pushState(null, "", window.location.href);

            // Creamos una función para manejar la acción de presionar el botón de "atrás" del navegador.
            const handleBackButton = (event) => {
                // PreventDefault evita que se ejecute la acción por defecto del navegador (volver a la página anterior).
                event.preventDefault();

                // Usamos navigate() para redirigir al usuario a "/home" si intentan volver atrás.
                navigate("/home", { replace: true }); // replace: true reemplaza la entrada actual en el historial, evitando que el usuario pueda volver atrás.
            };

            // Agregamos un event listener para detectar cuando el usuario intente navegar atrás (evento "popstate").
            window.addEventListener("popstate", handleBackButton);

            // La función de limpieza que elimina el event listener cuando el componente se desmonta o cambia alguna de las dependencias.
            return () => {
                window.removeEventListener("popstate", handleBackButton);
            }
        }
    // Las dependencias del useEffect. El efecto se ejecuta cuando cambia isAuthenticated, navigate, o la ruta actual (location.pathname).
    }, [isAuthenticated, navigate, location.pathname]);
}

// Exportamos la función personalizada para que se pueda usar en otros componentes.
export default useBlockBackNavigation;
