"use client"

import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { useNavigate, useLocation } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { motion, AnimatePresence } from "framer-motion"
import { FiChevronLeft, FiFilter, FiX, FiInfo } from "react-icons/fi"
import { useMyList } from "../../context/MyListContext"

const AllMovies = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isInMyList, toggleMyList } = useMyList()

  // Estado para almacenar todas las películas
  const [allMovies, setAllMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [categories, setCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)

  // Obtener la categoría de la navegación si existe
  useEffect(() => {
    if (location.state && location.state.category) {
      // Convertir el nombre de la categoría al formato correcto
      const category = location.state.category
      if (category === "Acción") setSelectedCategory("Action")
      else if (category === "Suspenso") setSelectedCategory("Suspense")
      else if (category === "Terror") setSelectedCategory("Horror")
      else if (category === "Drama") setSelectedCategory("Drama")
      else if (category === "Animadas") setSelectedCategory("Animated")
      else if (category === "Comedia") setSelectedCategory("Comedy")
      else if (category === "Science fiction") setSelectedCategory("Science fiction")
      else if (category === "Adventure") setSelectedCategory("Adventure")
      else if (category === "Romance") setSelectedCategory("Romance")
      else if (category === "Christian") setSelectedCategory("Christian")
      else setSelectedCategory("Todas")
    }
  }, [location.state])

  // Cargar películas desde Firestore
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const moviesCollection = collection(db, "movies")
        const moviesSnapshot = await getDocs(moviesCollection)
        const moviesData = moviesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setAllMovies(moviesData)

        // Extraer categorías únicas
        const uniqueCategories = ["Todas", ...new Set(moviesData.map((movie) => movie.category))]
        setCategories(uniqueCategories)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching movies:", error)
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  // Filtrar películas por categoría
  useEffect(() => {
    if (selectedCategory === "Todas") {
      setFilteredMovies(allMovies)
    } else {
      const filtered = allMovies.filter((movie) => movie.category === selectedCategory)
      setFilteredMovies(filtered)
    }
  }, [selectedCategory, allMovies])

  // Manejar el clic en una categoría
  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setShowFilters(false)
  }

  // Manejar el clic en una película
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
  }

  // Cerrar el modal de detalles
  const handleCloseModal = () => {
    setSelectedMovie(null)
  }

  // Navegar a la página de detalle
  const handleWatchClick = (movieId) => {
    navigate(`/detail/${movieId}`)
  }

  // Volver a la página anterior
  const handleGoBack = () => {
    navigate(-1)
  }

  // Mapeo de nombres de categorías para mostrar en español
  const getCategoryDisplayName = (category) => {
    switch (category) {
      case "Action":
        return "Acción"
      case "Suspense":
        return "Suspenso"
      case "Horror":
        return "Terror"
      case "Drama":
        return "Drama"
      case "Animated":
        return "Animadas"
      case "Comedy":
        return "Comedia"
      case "Science fiction":
        return "Ciencia Ficcion"  
      case "Adventure":
        return "Aventura"
      case "Romance":
        return "Romance"
      case "Christian":
        return "Cristianas"
      case "Todas":
        return "Todas"
      default:
        return category
    }
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={handleGoBack}>
          <FiChevronLeft size={24} />
        </BackButton>
        <FilterButton onClick={() => setShowFilters(!showFilters)}>
          <FiFilter size={20} />
        </FilterButton>
      </Header>

      <AnimatePresence>
        {showFilters && (
          <FiltersOverlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
          >
            <FiltersPanel
              as={motion.div}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FiltersPanelHeader>
                <FiltersPanelTitle>Categorías</FiltersPanelTitle>
                <CloseFiltersButton onClick={() => setShowFilters(false)}>
                  <FiX size={24} />
                </CloseFiltersButton>
              </FiltersPanelHeader>

              <CategoriesList>
                {categories.map((category) => (
                  <CategoryButton
                    key={category}
                    $active={selectedCategory === category}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {getCategoryDisplayName(category)}
                  </CategoryButton>
                ))}
              </CategoriesList>
            </FiltersPanel>
          </FiltersOverlay>
        )}
      </AnimatePresence>

      <CategoriesScrollContainer>
        <CategoriesRow>
          {categories.map((category) => (
            <CategoryPill
              key={category}
              $active={selectedCategory === category}
              onClick={() => handleCategoryClick(category)}
            >
              {getCategoryDisplayName(category)}
            </CategoryPill>
          ))}
        </CategoriesRow>
      </CategoriesScrollContainer>

      {loading ? (
        <LoaderContainer>
          <Spinner />
          <LoadingText>Cargando películas...</LoadingText>
        </LoaderContainer>
      ) : filteredMovies.length > 0 ? (
        <MoviesGrid>
          {filteredMovies.map((movie, index) => (
           <MovieCard
           key={movie.id}
           onClick={() => handleMovieClick(movie)}
           as={motion.div}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: index * 0.05 }}
         >
           <MoviePosterContainer>
             <MoviePoster src={movie.poster || "/placeholder.svg?height=300&width=200"} alt={movie.title} />
             <MovieOverlay>
               <MovieContent>
                 <MovieCardTitle>{movie.title}</MovieCardTitle>
                 <MovieCardDetails>
                   {movie.year && <MovieCardYear>{movie.year}</MovieCardYear>}
                   {movie.rating && (
                     <MovieCardRating>
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M13.73 3.51L15.49 7.03C15.73 7.52 16.37 7.99 16.91 8.08L20.1 8.61C22.14 8.95 22.62 10.43 21.15 11.89L18.67 14.37C18.25 14.79 18.02 15.6 18.15 16.18L18.86 19.25C19.42 21.68 18.13 22.62 15.98 21.35L12.99 19.58C12.45 19.26 11.56 19.26 11.01 19.58L8.02 21.35C5.88 22.62 4.58 21.67 5.14 19.25L5.85 16.18C5.98 15.6 5.75 14.79 5.33 14.37L2.85 11.89C1.39 10.43 1.86 8.95 3.9 8.61L7.09 8.08C7.62 7.99 8.26 7.52 8.5 7.03L10.26 3.51C11.22 1.6 12.78 1.6 13.73 3.51Z" fill="#FFD700" />
                       </svg>
                       {movie.rating.toFixed(1)}
                     </MovieCardRating>
                   )}
                   <MovieCardDuration>{movie.duration}</MovieCardDuration>
                 </MovieCardDetails>
                 <MovieCardDescription>
                   {movie.description?.length > 100
                     ? `${movie.description.substring(0, 100)}...`
                     : movie.description}
                 </MovieCardDescription>
                 {movie.category && (
                   <MovieCardCategory>{movie.category}</MovieCardCategory>
                 )}
               </MovieContent>
             </MovieOverlay>
           </MoviePosterContainer>
         </MovieCard>
          ))}
        </MoviesGrid>
      ) : (
        <EmptyState>
          <FiInfo size={48} />
          <EmptyStateTitle>No hay películas disponibles</EmptyStateTitle>
          <EmptyStateText>No se encontraron películas en esta categoría.</EmptyStateText>
        </EmptyState>
      )}

      <AnimatePresence>
        {selectedMovie && (
          <Modal
            onClick={handleCloseModal}
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              as={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <ModalImageContainer>
                <ModalImage src={selectedMovie.banner || selectedMovie.poster} alt={selectedMovie.title} />
                <ModalImageOverlay />
                <ModalTitle>{selectedMovie.title}</ModalTitle>
              </ModalImageContainer>
              <ModalInfo>
                <ModalDescription>{selectedMovie.description}</ModalDescription>
                <ModalMetadata>
                  <ModalMetadataItem>{getCategoryDisplayName(selectedMovie.category)}</ModalMetadataItem>
                  <ModalMetadataDot />
                  <ModalMetadataItem>{selectedMovie.duration}</ModalMetadataItem>
                  <ModalMetadataDot />
                  <ModalMetadataItem>{selectedMovie.year}</ModalMetadataItem>
                </ModalMetadata>
                <ModalButtonGroup>
                  <ModalButton onClick={handleCloseModal}>Volver</ModalButton>
                  <ModalButton $primary onClick={() => handleWatchClick(selectedMovie?.id)}>
                    <PlayIcon>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4 11.9999V8.43989C4 4.01989 7.13 2.2099 10.96 4.4199L14.05 6.1999L17.14 7.9799C20.97 10.1899 20.97 13.8099 17.14 16.0199L14.05 17.7999L10.96 19.5799C7.13 21.7899 4 19.9799 4 15.5599V11.9999Z"
                          fill="currentColor"
                        />
                      </svg>
                    </PlayIcon>
                    Ver película
                  </ModalButton>
                </ModalButtonGroup>
              </ModalInfo>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </PageContainer>
  )
}

export default AllMovies

// Animaciones
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`


const MovieCardDuration = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
`

const MovieCard = styled.div`
  flex: 0 0 auto;
  width: 200px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    width: 180px;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    width: 140px;
    border-radius: 8px;
  }
`

const MovieOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.9) 100%);
  opacity: 0;
  transition: opacity 0.5s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  
  ${MovieCard}:hover & {
    opacity: 1;
  }
`

const MovieContent = styled.div`
  transform: translateY(20px);
  transition: transform 0.5s ease;
  
  ${MovieCard}:hover & {
    transform: translateY(0);
  }
`

const MovieCardTitle = styled.h3`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`


const MovieCardDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
`

const MovieCardYear = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
`

const MovieCardRating = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  color: #FFD700;
  font-size: 0.9rem;
`

const MovieCardDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 0.8rem 0;
`
const MovieCardCategory = styled.span`
  display: inline-block;
  background-color: #E91E63;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`
// Estilos
const PageContainer = styled.div`
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #fff;
  padding-top: 70px;
  padding-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding-top: 60px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 5%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 1) 70%, rgba(10, 10, 10, 0));
  z-index: 10;
  height: 70px;
  
  @media (max-width: 768px) {
    padding: 0.8rem 4%;
    height: 60px;
  }
`

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`


const FilterButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`

const CategoriesScrollContainer = styled.div`
  overflow-x: auto;
  padding: 1rem 5%;
  margin-top: 1rem;
  
  /* Ocultar scrollbar pero mantener funcionalidad */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 4%;
  }
`

const CategoriesRow = styled.div`
  display: flex;
  gap: 0.8rem;
  
  @media (max-width: 768px) {
    gap: 0.6rem;
  }
`

const CategoryPill = styled.button`
  background: ${(props) => 
    props.$active 
      ? "linear-gradient(to right, #E91E63, #9C27B0)" 
      : "rgba(255, 255, 255, 0.1)"};
  border: none;
  border-radius: 50px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: ${(props) => 
      props.$active 
        ? "linear-gradient(to right, #E91E63, #9C27B0)" 
        : "rgba(255, 255, 255, 0.2)"};
    transform: translateY(-2px);
  }
`

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 1rem 5%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    padding: 1rem 4%;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.8rem;
  }
`

const MoviePosterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 150%;
`
const MoviePoster = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`


const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #E91E63;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  padding: 2rem;
  text-align: center;
`

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`

const EmptyStateText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`

const FiltersOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: flex;
  align-items: flex-end;
`

const FiltersPanel = styled.div`
  background: #121212;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
`

const FiltersPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const FiltersPanelTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`

const CloseFiltersButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const CategoriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const CategoryButton = styled.button`
  background: ${(props) => 
    props.$active 
      ? "linear-gradient(to right, #E91E63, #9C27B0)" 
      : "rgba(255, 255, 255, 0.05)"};
  border: none;
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => 
      props.$active 
        ? "linear-gradient(to right, #E91E63, #9C27B0)" 
        : "rgba(255, 255, 255, 0.1)"};
  }
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`

const ModalContent = styled.div`
  background-color: #121212;
  border-radius: 16px;
  width: 100%;
  max-width: 550px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    max-height: 80vh;
    max-width: 90%;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    max-width: 95%;
    max-height: 85vh;
    border-radius: 10px;
  }
`

const ModalImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  
  @media (max-width: 768px) {
    height: 180px;
  }
  
  @media (max-width: 480px) {
    height: 150px;
  }
`

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ModalImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(18, 18, 18, 1) 0%,
    rgba(18, 18, 18, 0.8) 50%,
    rgba(18, 18, 18, 0.4) 100%
  );
`

const ModalTitle = styled.h2`
  position: absolute;
  bottom: -40px;
  left: 20px;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    bottom: -20px;
    left: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    bottom: -30px;
    left: 12px;
  }
`

const ModalInfo = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`

const ModalDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

const ModalMetadata = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
`

const ModalMetadataItem = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const ModalMetadataDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  margin: 0 8px;
  
  @media (max-width: 480px) {
    width: 3px;
    height: 3px;
    margin: 0 6px;
  }
`

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

const ModalButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: ${(props) => (props.$primary ? "linear-gradient(to right, #E91E63, #9C27B0)" : "rgba(255, 255, 255, 0.05)")};
  border: ${(props) => (props.$primary ? "none" : "1px solid rgba(255, 255, 255, 0.2)")};
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: ${(props) => (props.$primary ? "600" : "500")};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(props) =>
      props.$primary ? "linear-gradient(to right, #E91E63, #9C27B0)" : "rgba(255, 255, 255, 0.1)"};
    transform: ${(props) => (props.$primary ? "translateY(-2px)" : "none")};
    box-shadow: ${(props) => (props.$primary ? "0 4px 12px rgba(233, 30, 99, 0.3)" : "none")};
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.95rem;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.9rem;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`

const PlayIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`