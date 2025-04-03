"use client"

import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { useParams, useNavigate } from "react-router-dom"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { motion } from "framer-motion"
// Importar el contexto de MyList
import { useMyList } from "../../context/MyListContext"

const Detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedMovies, setRelatedMovies] = useState([])
  const limit = 4
  // Añadir el hook useMyList
  const { isInMyList, toggleMyList } = useMyList()

  // Cargar datos de la película desde Firestore
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        setError(null)

        // Obtener documento de la película
        const movieRef = doc(db, "movies", id)
        const movieDoc = await getDoc(movieRef)

        if (!movieDoc.exists()) {
          console.error("Documento no encontrado para ID:", id)
          setError("Película no encontrada")
          setLoading(false)
          return
        }

        // Extraer y procesar los datos correctamente
        const movieData = {
          id: movieDoc.id,
          ...movieDoc.data(),
        }

        // Asegurarse de que todos los campos necesarios existan
        const processedMovie = {
          ...movieData,
          title: movieData.title || "Sin título",
          description: movieData.description || "Sin descripción disponible",
          year: movieData.year || "N/A",
          category: movieData.category || "Sin categoría",
          duration: movieData.duration || "N/A",
          rating: movieData.rating || 0,
          director: movieData.director || "Director desconocido",
          cast: Array.isArray(movieData.cast) ? movieData.cast : [],
          staticImage: movieData.staticImage || movieData.poster || movieData.banner,
          poster: movieData.poster || movieData.staticImage || movieData.banner,
          banner: movieData.banner || movieData.poster || movieData.staticImage,
        }

        console.log("Datos de película procesados:", processedMovie)
        setMovie(processedMovie)

        // Cargar películas relacionadas (misma categoría)
        if (processedMovie.category && processedMovie.category !== "Sin categoría") {
          try {
            const relatedQuery = query(
              collection(db, "movies"),
              where("category", "==", processedMovie.category),
              where("id", "!=", id),
              limit(4),
            )

            const relatedSnapshot = await getDocs(relatedQuery)
            const relatedData = relatedSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))

            setRelatedMovies(relatedData)
          } catch (relatedErr) {
            console.error("Error al cargar películas relacionadas:", relatedErr)
            // No establecer error general si solo fallan las películas relacionadas
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("Error al cargar la película:", err)
        setError("Error al cargar los datos de la película. Por favor, inténtalo de nuevo.")
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  // Función para navegar a otra película
  const handleMovieClick = (movieId) => {
    navigate(`/detail/${movieId}`)
  }

  // Función para ir al reproductor de video
  const handleWatchMovie = () => {
    navigate(`/detail/${movie.id}/watch`, { state: { movie } })
  }

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
      <HeroSection>
        <BackgroundImage src={movie.banner} alt={movie.title} />
        <HeroOverlay />

        <BackButton onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
                    <path
                      d="M13.73 3.51L15.49 7.03C15.73 7.52 16.37 7.99 16.91 8.08L20.1 8.61C22.14 8.95 22.62 10.43 21.15 11.89L18.67 14.37C18.25 14.79 18.02 15.6 18.15 16.18L18.86 19.25C19.42 21.68 18.13 22.62 15.98 21.35L12.99 19.58C12.45 19.26 11.56 19.26 11.01 19.58L8.02 21.35C5.88 22.62 4.58 21.67 5.14 19.25L5.85 16.18C5.98 15.6 5.75 14.79 5.33 14.37L2.85 11.89C1.39 10.43 1.86 8.95 3.9 8.61L7.09 8.08C7.62 7.99 8.26 7.52 8.5 7.03L10.26 3.51C11.22 1.6 12.78 1.6 13.73 3.51Z"
                      fill="#FFD700"
                    />
                  </svg>
                  {movie.rating.toFixed(1)}
                </RatingBadge>
              </>
            )}
          </MovieMetadata>

          <MovieDescription>{movie.description}</MovieDescription>

          <MovieDetails>
            {movie.director && (
              <DetailItem>
                <DetailLabel>Director</DetailLabel>
                <DetailValue>{movie.director}</DetailValue>
              </DetailItem>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <DetailItem>
                <DetailLabel>Reparto</DetailLabel>
                <DetailValue>{movie.cast.join(", ")}</DetailValue>
              </DetailItem>
            )}

            {movie.category && (
              <DetailItem>
                <DetailLabel>Género</DetailLabel>
                <DetailValue>{movie.category}</DetailValue>
              </DetailItem>
            )}
          </MovieDetails>

          <ButtonGroup>
            <WatchButton onClick={handleWatchMovie}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 11.9999V8.43989C4 4.01989 7.13 2.2099 10.96 4.4199L14.05 6.1999L17.14 7.9799C20.97 10.1899 20.97 13.8099 17.14 16.0199L14.05 17.7999L10.96 19.5799C7.13 21.7899 4 19.9799 4 15.5599V11.9999Z"
                  fill="currentColor"
                />
              </svg>
              Ver ahora
            </WatchButton>

            <AddButton isActive={isInMyList(movie.id)} onClick={() => toggleMyList(movie)}>
              {isInMyList(movie.id) ? (
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
              {isInMyList(movie.id) ? "Agregado" : "Mi lista"}
            </AddButton>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>

      {relatedMovies.length > 0 && (
        <RelatedSection>
          <SectionTitle>Películas relacionadas</SectionTitle>
          <RelatedMovies>
            {relatedMovies.map((relatedMovie, index) => (
              <RelatedMovie
                key={relatedMovie.id}
                onClick={() => handleMovieClick(relatedMovie.id)}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <RelatedPoster src={relatedMovie.banner || relatedMovie.poster} alt={relatedMovie.title} />
                <RelatedOverlay>
                  <RelatedTitle>{relatedMovie.title}</RelatedTitle>
                  {relatedMovie.year && <RelatedYear>{relatedMovie.year}</RelatedYear>}
                </RelatedOverlay>
              </RelatedMovie>
            ))}
          </RelatedMovies>
        </RelatedSection>
      )}
    </PageContainer>
  )
}

export default Detail

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
  padding-top: 0px; /* Espacio para el header fijo */

  @media (max-width: 768px) {
    padding-top: 0px; /* Pequeño espacio en móviles si es necesario */
  }
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
  height: 90vh;
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

const MovieDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 1.25rem;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
    -webkit-line-clamp: 3;
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
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
  }
`

const DetailLabel = styled.span`
  width: 100px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);

  @media (max-width: 768px) {
    margin-bottom: 0.25rem;
    width: auto;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.1rem;
  }
`

const DetailValue = styled.span`
  flex: 1;
  
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
  background: ${(props) => (props.isActive ? "rgba(233, 30, 99, 0.2)" : "transparent")};
  color: ${(props) => (props.isActive ? "#E91E63" : "white")};
  border: 1px solid ${(props) => (props.isActive ? "#E91E63" : "rgba(255, 255, 255, 0.2)")};
  border-radius: 8px;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.isActive ? "rgba(233, 30, 99, 0.3)" : "rgba(255, 255, 255, 0.1)")};
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

const RelatedSection = styled.section`
  padding: 3rem 5%;

  @media (max-width: 768px) {
    padding: 2rem 5%;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 5%;
  }
`

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`

const RelatedMovies = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
  }
`

const RelatedMovie = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 2/3;

  &:hover {
    transform: scale(1.05);
    z-index: 1;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 480px) {
    border-radius: 6px;
    
    &:hover {
      transform: scale(1.03);
    }
  }
`

const RelatedPoster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
`

const RelatedOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  opacity: 0;
  transition: all 0.3s ease;

  ${RelatedMovie}:hover & {
    opacity: 1;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`

const RelatedTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.1rem;
  }
`

const RelatedYear = styled.span`
  font-size: 0.8rem;
  opacity: 0.7;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`

