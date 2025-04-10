"use client"

import { useState, useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import { useParams, useNavigate } from "react-router-dom"
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { motion } from "framer-motion"
import { useMyList } from "../../context/MyListContext"
import { FaArrowDown } from "react-icons/fa";

const Detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [similarMovies, setSimilarMovies] = useState([])
  const { isInMyList, toggleMyList } = useMyList()
  const similarMoviesRef = useRef(null)
  const [expandedDescription, setExpandedDescription] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(true);

  // Función para desplazamiento horizontal del carrusel
  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        setError(null)

        // Obtener película actual
        const movieRef = doc(db, "movies", id)
        const movieDoc = await getDoc(movieRef)

        if (!movieDoc.exists()) {
          setError("Película no encontrada")
          setLoading(false)
          return
        }

        const movieData = {
          id: movieDoc.id,
          ...movieDoc.data(),
          title: movieDoc.data().title || "Sin título",
          description: movieDoc.data().description || "Sin descripción",
          category: movieDoc.data().category || "Sin categoría",
          poster: movieDoc.data().poster || movieDoc.data().banner,
          banner: movieDoc.data().banner || movieDoc.data().poster
        }

        setMovie(movieData)

        // Obtener películas similares
        if (movieData.category && movieData.category !== "Sin categoría") {
          const q = query(
            collection(db, "movies"),
            where("category", "==", movieData.category),
            limit(10)
          )

          const snapshot = await getDocs(q)
          const allMovies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            poster: doc.data().poster || doc.data().banner
          }))

          // Filtrar la película actual
          const filteredMovies = allMovies.filter(m => m.id !== id)
          setSimilarMovies(filteredMovies)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error al cargar la película:", err)
        setError("Error al cargar los datos de la película")
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  const handleMovieClick = (movieId) => {
    navigate(`/detail/${movieId}`)
  }

  const handleWatchMovie = () => {
    if (movie) {
      navigate(`/detail/${movie.id}/watch`, { state: { movie } })
    }
  }

  const toggleDescription = () => {
    setExpandedDescription(!expandedDescription)
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

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    )
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton onClick={() => navigate(-1)}>Volver</BackButton>
      </ErrorContainer>
    )
  }

  if (!movie) {
    return (
      <ErrorContainer>
        <ErrorMessage>Película no encontrada</ErrorMessage>
        <BackButton onClick={() => navigate(-1)}>Volver</BackButton>
      </ErrorContainer>
    )
  }

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <BackgroundImage src={movie.banner} alt={movie.title} />
        <HeroOverlay />

        <BackButton onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </BackButton>

        <HeroContent
          as={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <MovieTitle>{movie.title}</MovieTitle>

          <MovieMetadata>
            {movie.year && <MetadataItem>{movie.year}</MetadataItem>}
            {movie.edad && <AgeBadge>{movie.edad}+</AgeBadge>}
            {movie.duration && (
              <>
                <MetadataDot />
                <MetadataItem>{movie.duration}</MetadataItem>
              </>
            )}
            {movie.rating && (
              <>
                <MetadataDot />
                <RatingBadge>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.73 3.51L15.49 7.03C15.73 7.52 16.37 7.99 16.91 8.08L20.1 8.61C22.14 8.95 22.62 10.43 21.15 11.89L18.67 14.37C18.25 14.79 18.02 15.6 18.15 16.18L18.86 19.25C19.42 21.68 18.13 22.62 15.98 21.35L12.99 19.58C12.45 19.26 11.56 19.26 11.01 19.58L8.02 21.35C5.88 22.62 4.58 21.67 5.14 19.25L5.85 16.18C5.98 15.6 5.75 14.79 5.33 14.37L2.85 11.89C1.39 10.43 1.86 8.95 3.9 8.61L7.09 8.08C7.62 7.99 8.26 7.52 8.5 7.03L10.26 3.51C11.22 1.6 12.78 1.6 13.73 3.51Z" fill="#FFD700" />
                  </svg>
                  {movie.rating.toFixed(1)}
                </RatingBadge>
              </>
            )}
          </MovieMetadata>

          <MovieDescription>
            <DescriptionText $expanded={expandedDescription}>
              {movie.description}
            </DescriptionText>
            {movie.description && movie.description.length > 100 && (
              <ReadMoreButton onClick={toggleDescription}>
                {expandedDescription ? 'leer menos' : '... leer más'}
              </ReadMoreButton>
            )}
          </MovieDescription>

          <MovieDetails>
            {movie.category && (
              <DetailItem>
                <GenreLabel>Género</GenreLabel>
                <CategoryValue>{movie.category}</CategoryValue>
              </DetailItem>
            )}
          </MovieDetails>

          <ButtonGroup>
            <WatchButton onClick={handleWatchMovie}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 11.9999V8.43989C4 4.01989 7.13 2.2099 10.96 4.4199L14.05 6.1999L17.14 7.9799C20.97 10.1899 20.97 13.8099 17.14 16.0199L14.05 17.7999L10.96 19.5799C7.13 21.7899 4 19.9799 4 15.5599V11.9999Z" fill="currentColor" />
              </svg>
              Ver ahora
            </WatchButton>

            <AddButton $isActive={isInMyList(movie.id)} onClick={() => toggleMyList(movie)}>
              {isInMyList(movie.id) ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" fill="#E91E63" stroke="#E91E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 18V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {isInMyList(movie.id) ? "Agregado" : "Mi lista"}
            </AddButton>
          </ButtonGroup>
        </HeroContent>
        {showScrollButton && (
          <ScrollButton onClick={handleScroll}>
            <ArrowIcon />
          </ScrollButton>  
          )} 
      </HeroSection>
      {/* Sección moderna de "Películas como esta" */}
      {similarMovies.length > 0 && (
        <ModernSimilarSection>
          <ModernSectionTitle id="peliculas-accion">Películas como esta</ModernSectionTitle>
          
          <ModernCarouselContainer ref={similarMoviesRef}>
            {similarMovies.map((movie) => (
              <ModernCarouselItem
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                as={motion.div}
                whileHover={{ scale: 1.05 }}
              >
                <ModernPosterContainer>
                  <ModernPosterImage
                    src={movie.poster}
                    alt={movie.title}
                    onError={(e) => e.target.src = '/placeholder-poster.jpg'}
                  />
                  <ModernPosterOverlay>
                    <ModernPosterContent>
                      <ModernPosterTitle>{movie.title}</ModernPosterTitle>
                      {movie.year && <ModernPosterYear>{movie.year}</ModernPosterYear>}
                      <ModernPosterDescription>
                        {movie.description?.length > 100
                          ? `${movie.description.substring(0, 100)}...`
                          : movie.description}
                      </ModernPosterDescription>
                    </ModernPosterContent>
                  </ModernPosterOverlay>
                </ModernPosterContainer>
              </ModernCarouselItem>
            ))}
          </ModernCarouselContainer>

          <ModernCarouselControls>
            <ModernCarouselButton onClick={() => scrollCarousel(similarMoviesRef, 'left')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ModernCarouselButton>
            <ModernCarouselButton onClick={() => scrollCarousel(similarMoviesRef, 'right')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.90997 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.90997 4.08008" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ModernCarouselButton>
          </ModernCarouselControls>
        </ModernSimilarSection>
      )}
    </PageContainer>
  )
}

export default Detail

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

// Estilos base
const PageContainer = styled.div`
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #fff;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0a0a0a;
`

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #E91E63;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0a0a0a;
  padding: 2rem;
  text-align: center;
`

const ErrorMessage = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 2rem;
`

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(233, 30, 99, 0.7);
  }

  @media (max-width: 768px) {
    top: 1.5rem;
    left: 1.5rem;
    width: 36px;
    height: 36px;
  }
  
  @media (max-width: 480px) {
    top: 1rem;
    left: 1rem;
    width: 32px;
    height: 32px;
  }
`

const HeroSection = styled.div`
  position: relative;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    min-height: 500px;
  }
  
  @media (max-width: 480px) {
    min-height: 450px;
    height: 85vh;
  }
`

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  transition: opacity 1s ease;
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
`

const HeroContent = styled.div`
  position: absolute;
  bottom: 5%;
  left: 5%;
  max-width: 600px;
  z-index: 2;

  @media (max-width: 768px) {
    left: 5%;
    right: 5%;
    bottom: 8%;
    max-width: 90%;
  }
  
  @media (max-width: 480px) {
    bottom: 6%;
  }
`

const MovieTitle = styled.h1`
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

const MovieMetadata = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`

const MetadataItem = styled.span`
  font-size: 1rem;
  opacity: 0.8;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const AgeBadge = styled.span`
  background-color: #E91E63;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
`

const MetadataDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  margin: 0 0.5rem;
  
  @media (max-width: 480px) {
    width: 3px;
    height: 3px;
    margin: 0 0.3rem;
  }
`

const RatingBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
`

const MovieDescription = styled.div`
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
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.$expanded ? 'unset' : '2'};
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
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

const MovieDetails = styled.div`
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
  }
`

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.75rem;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }
`

const GenreLabel = styled.span`
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

const CategoryValue = styled.span`
  font-size: 1rem;
  opacity: 0.9;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
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
    flex: 1;
    min-width: 150px;
    padding: 0.75rem 1.25rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: ${(props) => (props.$isActive ? "rgba(233, 30, 99, 0.2)" : "transparent")};
  color: ${(props) => (props.$isActive ? "#E91E63" : "white")};
  border: 1px solid ${(props) => (props.$isActive ? "#E91E63" : "rgba(255, 255, 255, 0.2)")};
  border-radius: 8px;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.$isActive ? "rgba(233, 30, 99, 0.3)" : "rgba(255, 255, 255, 0.1)")};
  }

  @media (max-width: 768px) {
    flex: 1;
    min-width: 150px;
    padding: 0.75rem 1.25rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`

// Estilos modernos para la sección "Películas como esta"
const ModernSimilarSection = styled.section`
  padding: 3rem 5%;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 2rem 5%;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 5%;
  }
`

const ModernSectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 308px;
    height: 3px;
    background: linear-gradient(to right, #E91E63, #9C27B0);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`

const ModernCarouselContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1.8rem;
  padding: 1rem 0;
  scroll-behavior: smooth;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`

const ModernCarouselItem = styled.div`
  flex: 0 0 auto;
  width: 220px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    width: 180px;
  }
  
  @media (max-width: 480px) {
    width: 150px;
  }
`

const ModernPosterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 150%;
`

const ModernPosterImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`

const ModernPosterOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  
  ${ModernCarouselItem}:hover & {
    opacity: 1;
  }
`

const ModernPosterContent = styled.div`
  transform: translateY(20px);
  transition: transform 0.3s ease;
  
  ${ModernCarouselItem}:hover & {
    transform: translateY(0);
  }
`

const ModernPosterTitle = styled.h3`
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

const ModernPosterYear = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.8rem;
`

const ModernPosterDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`

const ModernCarouselControls = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  padding: 0 1rem;
  z-index: 2;
  
  @media (max-width: 480px) {
    padding: 0 0.5rem;
  }
`

const ModernCarouselButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
  
  &:hover {
    background: rgba(233, 30, 99, 0.9);
    transform: scale(1.1);
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`