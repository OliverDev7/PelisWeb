"use client"

import { useState, useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import { FiSearch, FiX, FiFilter, FiChevronRight } from "react-icons/fi"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const Search = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [recentSearches, setRecentSearches] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const searchRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Cargar películas cuando se expande la búsqueda
  useEffect(() => {
    if (isExpanded && movies.length === 0) {
      const fetchMovies = async () => {
        try {
          setIsLoading(true)
          const moviesCollection = collection(db, "movies")
          const moviesSnapshot = await getDocs(moviesCollection)
          const moviesData = moviesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          setMovies(moviesData)
          setIsLoading(false)
        } catch (error) {
          console.error("Error fetching movies:", error)
          setIsLoading(false)
        }
      }

      fetchMovies()
    }
  }, [isExpanded, movies.length])

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Filtrar películas en tiempo real cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMovies([])
      return
    }

    const term = searchTerm.toLowerCase().trim()
    let results = []

    switch (activeFilter) {
      case "title":
        results = movies.filter((movie) => movie.title?.toLowerCase().includes(term))
        break
      case "actor":
        results = movies.filter((movie) => movie.cast?.some((actor) => actor?.toLowerCase().includes(term)))
        break
      case "director":
        results = movies.filter((movie) => movie.director?.toLowerCase().includes(term))
        break
      case "year":
        results = movies.filter((movie) => movie.year?.toString().includes(term))
        break
      default:
        // Filtro por todos los campos
        results = movies.filter(
          (movie) =>
            movie.title?.toLowerCase().includes(term) ||
            movie.cast?.some((actor) => actor?.toLowerCase().includes(term)) ||
            movie.director?.toLowerCase().includes(term) ||
            movie.year?.toString().includes(term),
        )
    }

    // Limitar a 8 resultados para mejor rendimiento y UX
    setFilteredMovies(results.slice(0, 8))
  }, [searchTerm, movies, activeFilter])

  // Cerrar la búsqueda cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false)
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Expandir la búsqueda
  const handleSearchClick = () => {
    setIsExpanded(true)
    // Enfocar el input después de que la animación termine
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 300)
  }

  // Manejar cambios en el input
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Limpiar la búsqueda
  const handleClearSearch = () => {
    setSearchTerm("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Cambiar el filtro activo
  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setShowFilters(false)
  }

  // Navegar a la página de detalle de la película
  const handleMovieClick = (movie) => {
    // Guardar la búsqueda reciente
    const newSearch = {
      id: Date.now(),
      term: searchTerm,
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
    }

    const updatedSearches = [newSearch, ...recentSearches.filter((s) => s.term !== searchTerm)].slice(0, 5)
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))

    // Navegar a la página de detalle
    navigate(`/detail/${movie.id}`)
    setIsExpanded(false)
    setSearchTerm("")
  }

  // Usar una búsqueda reciente
  const handleRecentSearchClick = (search) => {
    navigate(`/detail/${search.movieId}`)
    setIsExpanded(false)
    setSearchTerm("")
  }

  // Ver todos los resultados
  const handleViewAllResults = () => {
    if (searchTerm.trim()) {
      // Aquí podrías navegar a una página de resultados completos
      // Por ahora, simplemente mostramos un mensaje
      alert(`Mostrando todos los resultados para: ${searchTerm}`)
      setIsExpanded(false)
    }
  }

  // Agregar una nueva función para eliminar una búsqueda reciente específica
  // Añadir esta función después de handleViewAllResults()
  const handleRemoveRecentSearch = (e, searchId) => {
    e.stopPropagation() // Evitar que se active el clic en el elemento padre

    // Filtrar la búsqueda que queremos eliminar
    const updatedSearches = recentSearches.filter((search) => search.id !== searchId)

    // Actualizar el estado y localStorage
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  }

  return (
    <SearchContainer ref={searchRef}>
      {!isExpanded ? (
        <SearchIconButton onClick={handleSearchClick} data-testid="search-button">
          <FiSearch size={20} />
        </SearchIconButton>
      ) : (
        <ExpandedSearch
          as={motion.div}
          initial={{ width: isMobile ? "100%" : "40px", opacity: 0.7 }}
          animate={{ width: isMobile ? "100%" : "280px", opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <SearchInputWrapper>
            <SearchIcon>
              <FiSearch size={18} />
            </SearchIcon>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Buscar películas, actores..."
              value={searchTerm}
              onChange={handleInputChange}
              autoFocus
            />
            <AnimatePresence>
              {searchTerm && (
                <ClearButton
                  as={motion.button}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClearSearch}
                >
                  <FiX size={16} />
                </ClearButton>
              )}
            </AnimatePresence>
            <FilterButton onClick={() => setShowFilters(!showFilters)}>
              <FiFilter size={16} />
            </FilterButton>
          </SearchInputWrapper>

          <AnimatePresence>
            {showFilters && (
              <FiltersContainer
                as={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <FilterOption $active={activeFilter === "all"} onClick={() => handleFilterChange("all")}>
                  Todos
                </FilterOption>
                <FilterOption $active={activeFilter === "title"} onClick={() => handleFilterChange("title")}>
                  Título
                </FilterOption>
                <FilterOption $active={activeFilter === "actor"} onClick={() => handleFilterChange("actor")}>
                  Actor
                </FilterOption>
                <FilterOption $active={activeFilter === "director"} onClick={() => handleFilterChange("director")}>
                  Director
                </FilterOption>
                <FilterOption $active={activeFilter === "year"} onClick={() => handleFilterChange("year")}>
                  Año
                </FilterOption>
              </FiltersContainer>
            )}
          </AnimatePresence>
        </ExpandedSearch>
      )}

      <AnimatePresence>
        {isExpanded && (
          <ResultsDropdown
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {isLoading ? (
              <LoadingContainer>
                <Spinner />
                <LoadingText>Buscando películas...</LoadingText>
              </LoadingContainer>
            ) : searchTerm ? (
              filteredMovies.length > 0 ? (
                <>
                  <ResultsHeader>
                    <ResultsTitle>Resultados</ResultsTitle>
                    <ResultsCount>{filteredMovies.length} encontrados</ResultsCount>
                  </ResultsHeader>
                  <ResultsList>
                    {filteredMovies.map((movie) => (
                      <ResultItem
                        key={movie.id}
                        onClick={() => handleMovieClick(movie)}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      >
                        <ResultPoster
                          src={movie.poster || "https://via.placeholder.com/60x90?text=No+Poster"}
                          alt={movie.title}
                        />
                        <ResultInfo>
                          <ResultTitle>{movie.title}</ResultTitle>
                          <ResultDetails>
                            {movie.year && <ResultYear>{movie.year}</ResultYear>}
                            {movie.director && (
                              <>
                                <ResultDot />
                                <ResultDirector>Dir: {movie.director}</ResultDirector>
                              </>
                            )}
                          </ResultDetails>
                          {movie.cast && movie.cast.length > 0 && (
                            <ResultCast>
                              {movie.cast.slice(0, 3).join(", ")}
                              {movie.cast.length > 3 && "..."}
                            </ResultCast>
                          )}
                        </ResultInfo>
                      </ResultItem>
                    ))}
                  </ResultsList>
                  {filteredMovies.length > 5 && (
                    <ViewAllButton onClick={handleViewAllResults}>
                      <span>Ver todos los resultados</span>
                      <FiChevronRight size={16} />
                    </ViewAllButton>
                  )}
                </>
              ) : (
                <NoResults>
                  <NoResultsText>No se encontraron resultados para {searchTerm}</NoResultsText>
                  <NoResultsSuggestion>Intenta con otro término o categoría</NoResultsSuggestion>
                </NoResults>
              )
            ) : recentSearches.length > 0 ? (
              <>
                <ResultsHeader>
                  <ResultsTitle>Búsquedas recientes</ResultsTitle>
                </ResultsHeader>
                <RecentSearchesList>
                  {recentSearches.map((search) => (
                    <RecentSearchItem
                      key={search.id}
                      onClick={() => handleRecentSearchClick(search)}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <RecentSearchIcon>
                        <FiSearch size={14} />
                      </RecentSearchIcon>
                      <RecentSearchText>
                        <span>{search.term}</span>
                        <RecentSearchMovie>{search.movieTitle}</RecentSearchMovie>
                      </RecentSearchText>
                      <DeleteSearchButton
                        onClick={(e) => handleRemoveRecentSearch(e, search.id)}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiX size={14} />
                      </DeleteSearchButton>
                    </RecentSearchItem>
                  ))}
                </RecentSearchesList>
              </>
            ) : (
              <EmptyState>
                <EmptyStateText>Escribe para buscar películas, actores o directores</EmptyStateText>
              </EmptyState>
            )}
          </ResultsDropdown>
        )}
      </AnimatePresence>
    </SearchContainer>
  )
}

export default Search

// Animaciones
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`


// Estilos
const SearchContainer = styled.div`
  position: relative;
  z-index: 1000;
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`

const SearchIconButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`

const ExpandedSearch = styled.div`
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: visible;
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 40px;
  
  @media (max-width: 768px) {
    height: 44px;
  }
`

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 4px;
  margin-right: 8px;
  
  @media (max-width: 768px) {
    margin-left: 8px;
    margin-right: 12px;
  }
`

const Input = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 0.95rem;
  width: 100%;
  padding: 0;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 4px;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    margin-left: 8px;
  }
`

const FilterButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 2px;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    margin-left: 4px;
  }
`

const FiltersContainer = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 12px;
    gap: 8px;
  }
`

const FilterOption = styled.button`
  background: ${(props) => (props.$active ? "linear-gradient(to right, #E91E63, #9C27B0)" : "rgba(255, 255, 255, 0.1)")};
  border: none;
  border-radius: 50px;
  padding: 6px 12px;
  font-size: 0.8rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => (props.$active ? "linear-gradient(to right, #E91E63, #9C27B0)" : "rgba(255, 255, 255, 0.2)")};
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`

// Modificar el tamaño del ResultsDropdown para hacerlo más grande y responsivo
const ResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 9;
  
  @media (max-width: 768px) {
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    transform: none;
    border-radius: 12px;
  }
  
  @media (min-width: 769px) {
    right: 0;
    width: 420px;
  }
`

// Mejorar el espaciado de los encabezados
const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px; // Aumentado de 16px
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`

// Aumentar el tamaño del título de resultados
const ResultsTitle = styled.h3`
  margin: 0;
  font-size: 1rem; // Aumentado de 0.9rem
  font-weight: 600; // Aumentado de 500
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

// Aumentar el tamaño del contador de resultados
const ResultsCount = styled.span`
  font-size: 0.85rem; // Aumentado de 0.8rem
  color: rgba(255, 255, 255, 0.5);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`

const ResultsList = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  
  /* Estilizar scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) rgba(18, 18, 18, 0.8);
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    max-height: 50vh;
  }
`

// Hacer más grandes los elementos de la lista de resultados
const ResultItem = styled(motion.div)`
  display: flex;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`

// Aumentar el tamaño de las imágenes de póster
const ResultPoster = styled.img`
  width: 55px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    width: 50px;
    height: 75px;
  }
  
  @media (max-width: 480px) {
    width: 45px;
    height: 68px;
  }
`

// Mejorar el espaciado y tamaño de la información de resultados
const ResultInfo = styled.div`
  margin-left: 16px; // Aumentado de 12px
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    margin-left: 14px;
  }
`

// Aumentar el tamaño del título
const ResultTitle = styled.h4`
  margin: 0 0 6px; // Aumentado de 4px
  font-size: 1.05rem; // Aumentado de 0.95rem
  font-weight: 600; // Aumentado de 500
  color: white;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin: 0 0 4px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0 0 3px;
  }
`

// Mejorar la visualización de los detalles
const ResultDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px; // Aumentado de 4px
  
  @media (max-width: 768px) {
    margin-bottom: 4px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 3px;
  }
`

// Aumentar el tamaño del año
const ResultYear = styled.span`
  font-size: 0.85rem; // Aumentado de 0.8rem
  color: rgba(255, 255, 255, 0.6);
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`

const ResultDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  margin: 0 6px;
  
  @media (max-width: 480px) {
    margin: 0 4px;
  }
`

// Aumentar el tamaño del director
const ResultDirector = styled.span`
  font-size: 0.85rem; // Aumentado de 0.8rem
  color: rgba(255, 255, 255, 0.6);
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`

// Aumentar el tamaño del reparto
const ResultCast = styled.p`
  margin: 0;
  font-size: 0.8rem; // Aumentado de 0.75rem
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`

// Mejorar el botón de "Ver todos los resultados"
const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px; // Aumentado de 12px
  background: linear-gradient(to right, rgba(233, 30, 99, 0.1), rgba(156, 39, 176, 0.1));
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #E91E63;
  font-size: 1rem; // Aumentado de 0.9rem
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(to right, rgba(233, 30, 99, 0.2), rgba(156, 39, 176, 0.2));
  }
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    font-size: 0.9rem;
  }
`

const NoResults = styled.div`
  padding: 24px 16px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`

const NoResultsText = styled.p`
  margin: 0 0 8px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin: 0 0 6px;
  }
`

const NoResultsSuggestion = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`

const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 20px 12px;
  }
`

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  gap: 12px;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 20px 12px;
    gap: 10px;
  }
`

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid #E91E63;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    border-width: 1.5px;
  }
`

const LoadingText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const RecentSearchesList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    max-height: 250px;
  }
  
  @media (max-width: 480px) {
    max-height: 200px;
  }
`

// Mejorar el espaciado de las búsquedas recientes
const RecentSearchItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 16px; // Aumentado de 12px
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    padding: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 10px;
  }
`

// Aumentar el tamaño del icono de búsqueda reciente
const RecentSearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px; // Aumentado de 28px
  height: 32px; // Aumentado de 28px
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  margin-right: 16px; // Aumentado de 12px
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    margin-right: 14px;
  }
  
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    margin-right: 12px;
  }
`

// Aumentar el tamaño del texto de búsqueda reciente
const RecentSearchText = styled.div`
  display: flex;
  flex-direction: column;
  
  span {
    font-size: 1rem; // Aumentado de 0.9rem
    color: white;
    margin-bottom: 4px; // Aumentado de 2px
    
    @media (max-width: 768px) {
      font-size: 0.95rem;
      margin-bottom: 3px;
    }
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
      margin-bottom: 2px;
    }
  }
`

// Aumentar el tamaño del nombre de película en búsqueda reciente
const RecentSearchMovie = styled.span`
  font-size: 0.85rem !important; // Aumentado de 0.8rem
  color: rgba(255, 255, 255, 0.5) !important;
  
  @media (max-width: 768px) {
    font-size: 0.8rem !important;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem !important;
  }
`

const DeleteSearchButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.6);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
  
  &:hover {
    color: white;
    background-color: rgba(233, 30, 99, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`

