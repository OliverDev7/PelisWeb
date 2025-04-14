"use client"
import { useState, useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, query, limit, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { motion, AnimatePresence } from "framer-motion"
import useBlockBackNavigation from "../../hooks/BlockNavigation"
import { useMyList } from "../../context/MyListContext"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { FaArrowDown } from "react-icons/fa";

const Home = ({user}) => {
  const [loading, setLoading] = useState(true)
  const [movies, setMovies] = useState([])
  const [actionMovies, setActionMovies] = useState([])
  const [thrillerMovies, setThrillerMovies] = useState([])
  const [horrorMovies, setHorrorMovies] = useState([])
  const [dramaMovies, setDramaMovies] = useState([])
  const [animatedMovies, setAnimatedMovies] = useState([])
  const [comedyMovies, setComedyMovies] = useState([])
  const [sciencefictionMovies, setSciencefictionMovies] = useState([])
  const [adventureMovies, setAdventureMovies] = useState([])
  const [romanceMovies, setRomanceMovies] = useState([])
  const [christianMovies, setChristianMovies] = useState([])
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [clickedMovie, setClickedMovie] = useState(null)
  const [isChangingFeatured, setIsChangingFeatured] = useState(false)
  const [expandedDescription, setExpandedDescription] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(true);
  const navigate = useNavigate()
  const { isInMyList, toggleMyList } = useMyList()

  // Referencias para los carruseles
  const actionRef = useRef(null)
  const thrillerRef = useRef(null)
  const horrorRef = useRef(null)
  const dramaRef = useRef(null)
  const animatedRef = useRef(null)
  const comedyRef = useRef(null)
  const sciencefictionRef = useRef(null) 
  const adventureRef = useRef(null)
  const romanceRef = useRef(null)
  const christianRef = useRef(null)

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
          const categoryQuery = query(collection(db, "movies"), where("category", "==", category), limit(12))
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
        const sciencefictionData = await fetchMoviesByCategory("Science fiction")
        const adventureData = await fetchMoviesByCategory("Adventure")
        const romanceData = await fetchMoviesByCategory("Romance")
        const christianData = await fetchMoviesByCategory("Christian")

        setActionMovies(actionData)
        setThrillerMovies(thrillerData)
        setHorrorMovies(horrorData)
        setDramaMovies(dramaData)
        setAnimatedMovies(animatedData)
        setComedyMovies(comedyData)
        setSciencefictionMovies(sciencefictionData)
        setAdventureMovies(adventureData)
        setRomanceMovies(romanceData)
        setChristianMovies(christianData)

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
        setExpandedDescription(false)
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollButton(scrollY < 300); // solo muestra si está cerca del top
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Funciones para navegar en los carruseles
  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8

      ref.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      })
    }
  }

  
const handleScroll = () => {
  const section = document.getElementById("peliculas-accion");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false); // ocultar inmediatamente al hacer click
  }
};

  const toggleDescription = () => {
    setExpandedDescription(!expandedDescription)
  }

  // Renderizar una categoría de películas
  const renderMovieCategory = (title, movies, ref) => {
    if (!movies || movies.length === 0) return null

    // Limitar a 10 películas por categoría
    const limitedMovies = movies.slice(0, 10)

    return (
      <CategorySection>
        <CategoryHeader>
          <CategoryTitle id="peliculas-accion">{title}</CategoryTitle>
          <ViewAllLink
            onClick={() => navigate("/allmovies", { state: { category: title.replace("Películas de ", "") } })}
          >
            Ver todo
          </ViewAllLink>
        </CategoryHeader>
        <CarouselContainer>
          <MovieRow ref={ref}>
            {limitedMovies.map((movie, index) => (
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
                  
                      <MovieCardDescription>
                        {movie.description?.length > 100
                          ? `${movie.description.substring(0, 100)}...`
                          : movie.description}
                      </MovieCardDescription>
                      <MovieCardDetails>
                        {movie.year && <MovieCardYear>{movie.year}</MovieCardYear>}
                        {movie.duration && (
                          <>
                         
                            <MovieCardDuration>{movie.duration}</MovieCardDuration>
                          </>
                        )}
                        {movie.rating && (
                          <>
                      
                            <MovieCardRating>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.73 3.51L15.49 7.03C15.73 7.52 16.37 7.99 16.91 8.08L20.1 8.61C22.14 8.95 22.62 10.43 21.15 11.89L18.67 14.37C18.25 14.79 18.02 15.6 18.15 16.18L18.86 19.25C19.42 21.68 18.13 22.62 15.98 21.35L12.99 19.58C12.45 19.26 11.56 19.26 11.01 19.58L8.02 21.35C5.88 22.62 4.58 21.67 5.14 19.25L5.85 16.18C5.98 15.6 5.75 14.79 5.33 14.37L2.85 11.89C1.39 10.43 1.86 8.95 3.9 8.61L7.09 8.08C7.62 7.99 8.26 7.52 8.5 7.03L10.26 3.51C11.22 1.6 12.78 1.6 13.73 3.51Z" fill="#FFD700" />
                              </svg>
                              {movie.rating.toFixed(1)}
                            </MovieCardRating>
                          </>
                        )}
                      </MovieCardDetails>
                      {movie.category && (
                        <MovieCardCategory>{movie.category}</MovieCardCategory>
                      )}
                    </MovieContent>
                  </MovieOverlay>
                </MoviePosterContainer>
              </MovieCard>
            ))}
          </MovieRow>

          {/* Botones de navegación solo visibles en dispositivos responsivos */}
          <CarouselButton className="carousel-button" direction="left" onClick={() => scroll(ref, "left")}>
            <FiChevronLeft size={24} />
          </CarouselButton>
          <CarouselButton className="carousel-button" direction="right" onClick={() => scroll(ref, "right")}>
            <FiChevronRight size={24} />
          </CarouselButton>
        </CarouselContainer>
      </CategorySection>
    )
  }

  // Efecto para mostrar/ocultar botones de navegación según el contenido
  useEffect(() => {
    const checkOverflow = () => {
      const rows = [
        actionRef.current,
        thrillerRef.current,
        horrorRef.current,
        dramaRef.current,
        animatedRef.current,
        comedyRef.current,
        sciencefictionRef.current,
        adventureRef.current,
        romanceRef.current,
        christianRef.current,
      ]

      rows.forEach((row) => {
        if (row) {
          const isOverflowing = row.scrollWidth > row.clientWidth
          const buttons = row.parentNode.querySelectorAll(".carousel-button")

          buttons.forEach((button) => {
            button.style.display = isOverflowing ? "flex" : "none"
          })
        }
      })
    }

    // Verificar al cargar y al cambiar el tamaño de la ventana
    checkOverflow()
    window.addEventListener("resize", checkOverflow)

    return () => window.removeEventListener("resize", checkOverflow)
  }, [movies, actionMovies, thrillerMovies, horrorMovies, dramaMovies, animatedMovies, comedyMovies, sciencefictionMovies, adventureMovies, romanceMovies, christianMovies ])

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
            <HeroDescription>
              <DescriptionText $expanded={expandedDescription}>
                {featuredMovie?.description}
              </DescriptionText>
              {featuredMovie?.description && featuredMovie.description.length > 100 && (
                <ReadMoreButton onClick={toggleDescription}>
                  {expandedDescription ? 'leer menos' : '... leer más'}
                </ReadMoreButton>
              )}
            </HeroDescription>
            <HeroMetadata>
              {featuredMovie?.category && <CategoryBadge>{featuredMovie.category}</CategoryBadge>}
              {featuredMovie?.duration && (
                <>
                  <MetadataDot />
                  <MetadataItem>{featuredMovie.duration}</MetadataItem>
                </>
              )}
              {featuredMovie?.year && (
                <>
                  <MetadataDot />
                  <MetadataItem>{featuredMovie.year}</MetadataItem>
                </>
              )}
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
              <AddToListButton $isActive={isInMyList(featuredMovie?.id)} onClick={() => toggleMyList(featuredMovie)}>
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
          {showScrollButton && (
          <ScrollButton onClick={handleScroll}>
            <ArrowIcon />
          </ScrollButton>  
          )} 
        </HeroContent>
      </HeroSection>

      <ContentContainer>
        {renderMovieCategory("Películas Acción", actionMovies, actionRef)}
        {renderMovieCategory("Películas Suspenso", thrillerMovies, thrillerRef)}
        {renderMovieCategory("Películas Terror", horrorMovies, horrorRef)}
        {renderMovieCategory("Películas Drama", dramaMovies, dramaRef)}
        {renderMovieCategory("Películas Animadas", animatedMovies, animatedRef)}
        {renderMovieCategory("Películas Comedia", comedyMovies, comedyRef)}
        {renderMovieCategory("Películas Ciencia Ficcion", sciencefictionMovies, sciencefictionRef)}
        {renderMovieCategory("Películas Adventura", adventureMovies, adventureRef)}
        {renderMovieCategory("Películas Romance", romanceMovies, romanceRef)}
        {renderMovieCategory("Películas Cristianas", christianMovies, christianRef)}
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
                <ModalDescription>
                  {clickedMovie.description?.length > 200
                    ? `${clickedMovie.description.substring(0, 200)}...`
                    : clickedMovie.description}
                </ModalDescription>
                <ModalMetadata>
                  {clickedMovie.category && <ModalCategoryBadge>{clickedMovie.category}</ModalCategoryBadge>}
                  {clickedMovie.duration && (
                    <>
                      <ModalMetadataDot />
                      <ModalMetadataItem>{clickedMovie.duration}</ModalMetadataItem>
                    </>
                  )}
                  {clickedMovie.year && (
                    <>
                      <ModalMetadataDot />
                      <ModalMetadataItem>{clickedMovie.year}</ModalMetadataItem>
                    </>
                  )}
                </ModalMetadata>
                <ModalButtonGroup>
                  <ModalButton onClick={handleCloseModal}>Volver</ModalButton>
                  <ModalButton $primary onClick={() => handleWatchClick(clickedMovie?.id)}>
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

export default Home

// Animaciones

const ArrowIcon = styled(FaArrowDown)`
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }

  @media (min-width: 1600px) {
    font-size: 24px;
  }
`;


  const ScrollButton = styled.button`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.15);
  border: 2px solid white;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: white;
    color: black;
    transform: translateX(-50%) translateY(2px);
  }

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
  }

  @media (max-width: 480px) {
    width: 38px;
    height: 38px;
    bottom: 16px;
  }

  @media (min-width: 1600px) {
    width: 56px;
    height: 56px;
    bottom: 32px;
  }
`;




const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

// Estilos
const PageContainer = styled.div`
  background-color: #0a0a0a;
  min-height: 98vh;
  color: #fff;
  padding-top: 70px;

  @media (max-width: 768px) {
    padding-top: 60px;
  }
`

const HeroSection = styled.div`
  position: relative;
  height: 100vh;
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

const HeroDescription = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`

const DescriptionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  max-width: 90%;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.$expanded ? 'unset' : '2'};
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`

const ReadMoreButton = styled.button`
  background: transparent;
  border: none;
  color: #E91E63;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  font-weight: 500;
  display: inline-block;
  text-decoration: underline;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const HeroMetadata = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`

const CategoryBadge = styled.span`
  display: inline-block;
  background-color: #E91E63;
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    padding: 0.25rem 0.6rem;
    font-size: 0.85rem;
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
  background: ${(props) => (props.$isActive ? "rgba(233, 30, 99, 0.2)" : "rgba(255, 255, 255, 0.1)")};
  backdrop-filter: blur(10px);
  color: ${(props) => (props.$isActive ? "#E91E63" : "white")};
  border: 1px solid ${(props) => (props.$isActive ? "#E91E63" : "rgba(255, 255, 255, 0.2)")};
  border-radius: 8px;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(props) => (props.$isActive ? "rgba(233, 30, 99, 0.3)" : "rgba(255, 255, 255, 0.2)")};
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

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
`

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
`

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.direction === "left" ? "left: -20px;" : "right: -20px;")}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  transition: all 0.2s ease;
  
  @media (max-width: 1440px) {
    display: flex;
  }
  
  &:hover {
    background: rgba(233, 30, 99, 0.7);
    border-color: #E91E63;
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    ${(props) => (props.direction === "left" ? "left: -15px;" : "right: -15px;")}
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    ${(props) => (props.direction === "left" ? "left: -10px;" : "right: -10px;")}
  }
`

const MovieRow = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 0.5rem 0.5rem 1.5rem;
  scroll-behavior: smooth;
  
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    padding-bottom: 1rem;
  }
`

const MovieCard = styled.div`
  flex: 0 0 auto;
  width: 220px;
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
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
`

const MovieCardYear = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
`

const MovieCardDuration = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
`

const MovieCardRating = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  color: #FFD700;
  font-size: 0.8rem;
`

const MovieCardDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.84rem;
  font-weight: semi-bold;
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
    bottom: -25px;
    left: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    bottom: -25px;
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
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
  }
`

const ModalMetadata = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`

const ModalCategoryBadge = styled.span`
  display: inline-block;
  background-color: #E91E63;
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    padding: 0.25rem 0.6rem;
    font-size: 0.85rem;
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

const ViewAllLink = styled.button`
  background: transparent;
  border: none;
  color: #E91E63;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(233, 30, 99, 0.1);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`