"use client"
import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, query, limit, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { motion, AnimatePresence } from "framer-motion"
import useBlockBackNavigation from "../../hooks/BlockNavigation"
// Importar el contexto de MyList
import { useMyList } from "../../context/MyListContext"

const HomeDemo = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const [movies, setMovies] = useState([])
  const [actionMovies, setActionMovies] = useState([])
  const [thrillerMovies, setThrillerMovies] = useState([])
  const [horrorMovies, setHorrorMovies] = useState([])
  const [dramaMovies, setDramaMovies] = useState([])
  const [animatedMovies, setAnimatedMovies] = useState([])
  const [comedyMovies, setComedyMovies] = useState([])
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [clickedMovie, setClickedMovie] = useState(null)
  const [isChangingFeatured, setIsChangingFeatured] = useState(false)
  const navigate = useNavigate()
  // Añadir el hook useMyList
  const { isInMyList, toggleMyList } = useMyList()

  useBlockBackNavigation(user !== null)

  // Redireccionar si no hay usuario
  useEffect(() => {
    if (!user) {
      navigate("/home")
      return
    }
  }, [user, navigate])

  // Cargar películas desde Firestore
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)

        // Obtener todas las películas
        const moviesRef = collection(db, "movies")
        const moviesSnapshot = await getDocs(moviesRef)
        const moviesData = moviesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setMovies(moviesData)

        // Obtener películas por categorías
        const fetchMoviesByCategory = async (category) => {
          const categoryQuery = query(collection(db, "movies"), where("category", "==", category), limit(10))
          const querySnapshot = await getDocs(categoryQuery)
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        }

        // Cargar películas por categoría
        const actionData = await fetchMoviesByCategory("Action")
        const thrillerData = await fetchMoviesByCategory("Suspense")
        const horrorData = await fetchMoviesByCategory("Horror")
        const dramaData = await fetchMoviesByCategory("Drama")
        const animatedData = await fetchMoviesByCategory("Animated")
        const comedyData = await fetchMoviesByCategory("Comedy")

        setActionMovies(actionData)
        setThrillerMovies(thrillerData)
        setHorrorMovies(horrorData)
        setDramaMovies(dramaData)
        setAnimatedMovies(animatedData)
        setComedyMovies(comedyData)

        // Seleccionar película destacada aleatoria
        const randomMovie = moviesData[Math.floor(Math.random() * moviesData.length)]
        setFeaturedMovie(randomMovie)

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar películas:", error)
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  // Cambiar película destacada cada 10 segundos
  useEffect(() => {
    if (movies.length === 0) return

    const interval = setInterval(() => {
      setIsChangingFeatured(true)
      setTimeout(() => {
        const newRandomMovie = movies[Math.floor(Math.random() * movies.length)]
        setFeaturedMovie(newRandomMovie)
        setIsChangingFeatured(false)
      }, 500)
    }, 10000)

    return () => clearInterval(interval)
  }, [movies])

  // Navegar a la página de detalle
  const handleWatchClick = (movieId) => {
    navigate(`/detail/${movieId}`)
  }

  // Mostrar modal con detalles de la película
  const handleMovieClick = (movie) => {
    setClickedMovie(movie)
  }

  // Cerrar modal
  const handleCloseModal = () => {
    setClickedMovie(null)
  }

  // Renderizar una categoría de películas
  const renderMovieCategory = (title, movies) => {
    if (!movies || movies.length === 0) return null

    return (
      <CategorySection>
        <CategoryTitle>{title}</CategoryTitle>
        <MovieRow>
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <MoviePoster src={movie.poster || "/placeholder.svg?height=300&width=200"} alt={movie.title} />
            </MovieCard>
          ))}
        </MovieRow>
      </CategorySection>
    )
  }

  if (loading) {
    return (
      <LoaderContainer>
        <Spinner />
      </LoaderContainer>
    )
  }

  return (
    <PageContainer>
      <HeroSection>
        <AnimatePresence mode="wait">
          <FeaturedBanner
            key={featuredMovie?.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <StaticImage src={featuredMovie?.banner || featuredMovie?.poster} alt={featuredMovie?.title} />
            <HeroOverlay />
          </FeaturedBanner>
        </AnimatePresence>

        <HeroContent>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <HeroTitle>{featuredMovie?.title}</HeroTitle>
            <HeroDescription>{featuredMovie?.description}</HeroDescription>
            <HeroMetadata>
              <MetadataItem>{featuredMovie?.category}</MetadataItem>
              <MetadataDot />
              <MetadataItem>{featuredMovie?.duration}</MetadataItem>
              <MetadataDot />
              <MetadataItem>{featuredMovie?.year}</MetadataItem>
            </HeroMetadata>
            <HeroButtonGroup>
              <WatchButton onClick={() => handleWatchClick(featuredMovie?.id)}>
                <PlayIcon>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 11.9999V8.43989C4 4.01989 7.13 2.2099 10.96 4.4199L14.05 6.1999L17.14 7.9799C20.97 10.1899 20.97 13.8099 17.14 16.0199L14.05 17.7999L10.96 19.5799C7.13 21.7899 4 19.9799 4 15.5599V11.9999Z"
                      fill="currentColor"
                    />
                  </svg>
                </PlayIcon>
                Ver ahora
              </WatchButton>
              <AddToListButton isActive={isInMyList(featuredMovie?.id)} onClick={() => toggleMyList(featuredMovie)}>
                <PlusIcon>
                  {isInMyList(featuredMovie?.id) ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                        fill="#E91E63"
                        stroke="#E91E63"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.75 12L10.58 14.83L16.25 9.17"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 12H18"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 18V6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </PlusIcon>
                {isInMyList(featuredMovie?.id) ? "Agregado" : "Mi lista"}
              </AddToListButton>
            </HeroButtonGroup>
          </motion.div>
        </HeroContent>
      </HeroSection>

      <ContentContainer>
        {renderMovieCategory("Películas de Acción", actionMovies)}
        {renderMovieCategory("Películas de Suspenso", thrillerMovies)}
        {renderMovieCategory("Películas de Terror", horrorMovies)}
        {renderMovieCategory("Películas de Drama", dramaMovies)}
        {renderMovieCategory("Películas Animadas", animatedMovies)}
        {renderMovieCategory("Películas de Comedia", comedyMovies)}
      </ContentContainer>

      <AnimatePresence>
        {clickedMovie && (
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
                <ModalImage src={clickedMovie.banner || clickedMovie.poster} alt={clickedMovie.title} />
                <ModalImageOverlay />
                <ModalTitle>{clickedMovie.title}</ModalTitle>
              </ModalImageContainer>
              <ModalInfo>
                <ModalDescription>{clickedMovie.description}</ModalDescription>
                <ModalMetadata>
                  <ModalMetadataItem>{clickedMovie.category}</ModalMetadataItem>
                  <ModalMetadataDot />
                  <ModalMetadataItem>{clickedMovie.duration}</ModalMetadataItem>
                  <ModalMetadataDot />
                  <ModalMetadataItem>{clickedMovie.year}</ModalMetadataItem>
                </ModalMetadata>
                <ModalButtonGroup>
                  <ModalButton onClick={handleCloseModal}>Volver</ModalButton>
                  <ModalButton primary onClick={() => handleWatchClick(clickedMovie?.id)}>
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

export default HomeDemo

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

// Estilos
const PageContainer = styled.div`
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #fff;
  padding-top: 0; /* Eliminado el espacio para el header fijo */
  
  @media (max-width: 768px) {
    padding-top: 0;
  }
`

const HeroSection = styled.div`
  position: relative;
  height: 90vh;
  min-height: 600px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 100vh;
    min-height: 500px;
  }
  
  @media (max-width: 480px) {
    height: 100vh;
    min-height: 400px;
  }
`

const FeaturedBanner = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const StaticImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(10, 10, 10, 1) 0%,
    rgba(10, 10, 10, 0.8) 50%,
    rgba(10, 10, 10, 0.4) 100%
  );
  z-index: 2;
`

const HeroContent = styled.div`
  position: absolute;
  bottom: 10%;
  left: 5%;
  max-width: 600px;
  z-index: 3;
  
  @media (max-width: 768px) {
    bottom: 15%;
    left: 5%;
    right: 5%;
    max-width: 90%;
  }
  
  @media (max-width: 480px) {
    bottom: 12%;
  }
`

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`

const HeroDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  max-width: 90%;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
    -webkit-line-clamp: 2;
    margin-bottom: 0.75rem;
  }
`

const HeroMetadata = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
`

const MetadataItem = styled.span`
  font-size: 1rem;
  opacity: 0.8;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const MetadataDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  margin: 0 10px;
  
  @media (max-width: 480px) {
    width: 3px;
    height: 3px;
    margin: 0 6px;
  }
`

const HeroButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

const WatchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(to right, #E91E63, #9C27B0);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.7rem 1rem;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`

const PlayIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`

const AddToListButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: ${(props) => (props.isActive ? "rgba(233, 30, 99, 0.2)" : "rgba(255, 255, 255, 0.1)")};
  backdrop-filter: blur(10px);
  color: ${(props) => (props.isActive ? "#E91E63" : "white")};
  border: 1px solid ${(props) => (props.isActive ? "#E91E63" : "rgba(255, 255, 255, 0.2)")};
  border-radius: 8px;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(props) => (props.isActive ? "rgba(233, 30, 99, 0.3)" : "rgba(255, 255, 255, 0.2)")};
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.7rem 1rem;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`

const PlusIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ContentContainer = styled.div`
  padding: 0 5%;
  
  @media (max-width: 480px) {
    padding: 0 4%;
  }
`

const CategorySection = styled.section`
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
`

const MovieRow = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 1rem;
  
  /* Ocultar scrollbar pero mantener funcionalidad */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    padding-bottom: 0.75rem;
  }
`

const MovieCard = styled.div`
  flex: 0 0 auto;
  width: 180px;
  height: 270px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 160px;
    height: 240px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    width: 120px;
    height: 180px;
    border-radius: 10px;
    
    &:hover {
      transform: scale(1.03);
    }
  }
`

const MoviePoster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  max-width: 550px; // Reducido aún más para mejor estética
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
  height: 250px; // Altura reducida para mejor proporción
  
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
  bottom: 20px;
  left: 20px;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    bottom: 15px;
    left: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    bottom: 12px;
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
    -webkit-line-clamp: 4;
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
  background: ${(props) => (props.primary ? "linear-gradient(to right, #E91E63, #9C27B0)" : "rgba(255, 255, 255, 0.05)")};
  border: ${(props) => (props.primary ? "none" : "1px solid rgba(255, 255, 255, 0.2)")};
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: ${(props) => (props.primary ? "600" : "500")};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(props) =>
      props.primary ? "linear-gradient(to right, #E91E63, #9C27B0)" : "rgba(255, 255, 255, 0.1)"};
    transform: ${(props) => (props.primary ? "translateY(-2px)" : "none")};
    box-shadow: ${(props) => (props.primary ? "0 4px 12px rgba(233, 30, 99, 0.3)" : "none")};
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

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #0a0a0a;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
`

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.1);
  border-top: 6px solid #E91E63;
  border-radius: 50%;
  animation: ${spin} 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    border-width: 5px;
    border-top-width: 5px;
  }
`

const MovieCategory = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`

