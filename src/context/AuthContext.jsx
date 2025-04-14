// Importamos las funciones necesarias de React y Firebase
import { createContext, useContext, useState, useEffect } from "react";
// React es la librería base, y Firebase proporciona la funcionalidad de autenticación.
import { onAuthStateChanged } from "firebase/auth";
 // Importa la función para escuchar los cambios de estado de autenticación.
import { auth } from "../firebase/firebase";
// Importa la instancia de autenticación configurada previamente.


// Creamos el contexto de autenticación
const AuthContext = createContext();
 // Esto crea un contexto llamado AuthContext que más
 // tarde se usará para compartir el estado de autenticación entre componentes.

// Componente proveedor que encapsula toda la lógica de autenticación
export const AuthProvider = ({ children }) => {
  // Inicializamos el estado del usuario y de la carga (loading)
  const [user, setUser] = useState(null); 
  // El estado 'user' almacenará la información del usuario autenticado. Inicialmente es 'null'.
  const [loading, setLoading] = useState(true);
   // El estado 'loading' controla si la información de autenticación aún se está cargando.
   //  Inicialmente es 'true' para indicar que estamos cargando la información.

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();

  }, []);
  // El array vacío [] indica que este efecto solo se ejecutará una vez, cuando el componente se monte por primera vez.

  // Devolvemos el contexto con los valores que queremos compartir a través de toda la aplicación
  return (
    <AuthContext.Provider value={{ user, loading }}>
        {/* Proveemos el valor del contexto, que contiene 'user' y 'loading' como objetos.*/}
      {children}
      {/* Los componentes hijos que estén dentro de <AuthProvider> tendrán acceso a este contexto.*/}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => useContext(AuthContext);  
// 'useAuth' es un hook que permite a otros componentes acceder
//  al contexto 'AuthContext' sin necesidad de usar el 'useContext' directamente.



