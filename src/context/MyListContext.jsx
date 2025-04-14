"use client"

import { createContext, useState, useContext, useEffect } from "react"

// Crear el contexto
const MyListContext = createContext()

// Hook personalizado para usar el contexto
export const useMyList = () => useContext(MyListContext)

// Proveedor del contexto
export const MyListProvider = ({ children }) => {
  const [myList, setMyList] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar la lista guardada al iniciar
  useEffect(() => {
    const loadMyList = async () => {
      try {
        const savedList = localStorage.getItem("myList")
        if (savedList) {
          setMyList(JSON.parse(savedList))
        }
      } catch (error) {
        console.error("Error loading my list:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMyList()
  }, [])

  // Guardar la lista cuando cambie
  useEffect(() => {
    const saveMyList = async () => {
      try {
        localStorage.setItem("myList", JSON.stringify(myList))
      } catch (error) {
        console.error("Error saving my list:", error)
      }
    }

    if (!loading) {
      saveMyList()
    }
  }, [myList, loading])

  // Verificar si una película está en la lista
  const isInMyList = (movieId) => {
    return myList.some((movie) => movie.id === movieId)
  }

  // Añadir una película a la lista
  const addToMyList = (movie) => {
    if (!isInMyList(movie.id)) {
      setMyList((prevList) => [...prevList, movie])
    }
  }

  // Eliminar una película de la lista
  const removeFromMyList = (movieId) => {
    setMyList((prevList) => prevList.filter((movie) => movie.id !== movieId))
  }

  // Alternar una película en la lista (añadir si no está, eliminar si está)
  const toggleMyList = (movie) => {
    if (isInMyList(movie.id)) {
      removeFromMyList(movie.id)
    } else {
      addToMyList(movie)
    }
  }

  return (
    <MyListContext.Provider
      value={{
        myList,
        loading,
        isInMyList,
        addToMyList,
        removeFromMyList,
        toggleMyList,
      }}
    >
      {children}
    </MyListContext.Provider>
  )
}

