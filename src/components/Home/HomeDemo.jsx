"use client"
import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { initialMovies, topMovies, recommendedMovies } from "../../data/data"
import useBlockBackNavigation from "../../hooks/BlockNavigation"

const categories = ["Todas", "Terror", "Acción", "Drama", "Ciencia Ficción", "Animadas"]

const HomeDemo = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [movies, setMovies] = useState(initialMovies)
  const [currentTopIndex, setCurrentTopIndex] = useState(0)
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [clickedMovie, setClickedMovie] = useState(null)
  const videoRef = useRef(null)
  const topMoviesRef = useRef(null)
  const navigate = useNavigate()

  useBlockBackNavigation(user !== null)

  useEffect(() => {
    if (!user) {
      navigate("/home")
      return
    }
  }, [user, navigate])

  useEffect(() => {
    const randomMovie = movies[Math.floor(Math.random() * movies.length)]
    setFeaturedMovie(randomMovie)

    const interval = setInterval(() => {
      const newRandomMovie = movies[Math.floor(Math.random() * movies.length)]
      setFeaturedMovie(newRandomMovie)
    }, 30000)

    return () => clearInterval(interval)
  }, [movies])

  useEffect(() => {
    if (videoRef.current && featuredMovie) {
      videoRef.current.load()
      videoRef.current.play().catch((err) => console.error("Error al reproducir video:", err))
    }
  }, [featuredMovie])

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const startCycle = () => {
      setShowVideo(false)
      setTimeout(() => {
        setShowVideo(true)
        if (videoRef.current) videoRef.current.play()
      }, 6000)
    }

    const handleVideoEnd = () => {
      setShowVideo(false)
      setTimeout(startCycle, 3000)
    }

    startCycle()

    if (videoRef.current) {
      videoRef.current.addEventListener("ended", handleVideoEnd)
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("ended", handleVideoEnd)
      }
    }
  }, [])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
  }

  const handleTopMoviesScroll = (direction) => {
    const visibleMovies = window.innerWidth <= 768 ? 2 : 6
    setCurrentTopIndex((prev) => {
      const newIndex = direction === "left" ? prev - 1 : prev + 1
      return Math.max(0, Math.min(topMovies.length - visibleMovies, newIndex))
    })
  }

  const handleWatchClick = (movieId) => {
    navigate(`/detail/${movieId}`)
  }

  const filteredMovies =
    selectedCategory === "Todas" ? movies : movies.filter((movie) => movie.category === selectedCategory)

  const handleMovieClick = (movie) => {
    setClickedMovie(movie)
  }

  const handleCloseModal = () => {
    setClickedMovie(null)
  }

  if (loading) {
    return (
      <LoaderContainer>
        <Spinner />
      </LoaderContainer>
    )
  }

  return (
    <>
      <Container>
        <BackgroundVideo ref={videoRef} autoPlay muted show={showVideo}>
          <source src={featuredMovie?.trailer} type="video/mp4" />
        </BackgroundVideo>
        <StaticImage src={featuredMovie?.staticImage} alt={featuredMovie?.title} show={!showVideo} />
        <MovieDetails>
          <h1>{featuredMovie?.title}</h1>
          <p>{featuredMovie?.description}</p>
          <div className="details">
            <span> {featuredMovie?.category}</span>
            <span> {featuredMovie?.duration}</span>
          </div>
          <WatchNowButton onClick={() => handleWatchClick(featuredMovie?.id)}>Ver ahora</WatchNowButton>
        </MovieDetails>
      </Container>

      <MovieSection>
        <h2 style={{ color: "white", textAlign: "center" }}>Películas recomendadas</h2>
        <MovieList>
          {recommendedMovies.map((movie, index) => (
            <MovieItem key={index} onClick={() => handleMovieClick(movie)}>
              <img src={movie.poster || "/placeholder.svg"} alt={movie.title} width="200" />
            </MovieItem>
          ))}
        </MovieList>
      </MovieSection>

      <TopMoviesSection>
        <h2 
        style={{ color: "white", textAlign: "center" }}>TOP 10</h2>
        <h2
         style={{ color: "white", textAlign: "center" }}>Películas más vistas</h2>

        <TopMoviesContainer>
          <ArrowButton className="left" onClick={() => handleTopMoviesScroll("left")}>
            &#10094;
          </ArrowButton>
          <TopMoviesList ref={topMoviesRef} style={{ transform: `translateX(-${currentTopIndex * (230 / 6)}%)` }}>
            {topMovies.map((movie, index) => (
              <TopMovieItem key={index} onClick={() => handleMovieClick(movie)}>
                <img src={movie.poster || "/placeholder.svg"} alt={movie.title} />
                <div className="rank">{movie.rank}</div>
              </TopMovieItem>
            ))}
          </TopMoviesList>
          <ArrowButton className="right" onClick={() => handleTopMoviesScroll("right")}>
            &#10095;
          </ArrowButton>
        </TopMoviesContainer>
      </TopMoviesSection>

      <CategoriesSection>
        <h2 style={{ color: "white", textAlign: "center" }}>Categorías</h2>
        <CategoriesList>
          {categories.map((category, index) => (
            <CategoryItem
              key={index}
              onClick={() => handleCategoryClick(category)}
              style={{
                background: selectedCategory === category ? "#8E24AA" : "#1c1c1c",
              }}
            >
              {category}
            </CategoryItem>
          ))}
        </CategoriesList>
      </CategoriesSection>

      <MovieSection>
        <h2 style={{ color: "white", textAlign: "center" }}>
          {selectedCategory === "Todas" ? "Todas las películas" : `Películas de ${selectedCategory}`}
        </h2>
        <MovieList>
          {filteredMovies.map((movie, index) => (
            <MovieItem key={index} onClick={() => handleMovieClick(movie)}>
              <img src={movie.poster || "/placeholder.svg"} alt={movie.title} />
            </MovieItem>
          ))}
        </MovieList>
      </MovieSection>

      {clickedMovie && (
          <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <video muted loop autoPlay>
              <source src={clickedMovie.trailer} type="video/mp4" />
            </video>
            <div className="info">
              <h4>{clickedMovie.title}</h4>
              <TruncatedDescription>{clickedMovie.description}</TruncatedDescription>
              <div className="details">
                <span>{clickedMovie.category}</span>
                <span>{clickedMovie.duration}</span>
              </div>
              <ButtonContainer>
                <CloseButton onClick={handleCloseModal}>Volver</CloseButton>
                <WatchNowButton onClick={() => handleWatchClick(clickedMovie?.id)}>Ver película</WatchNowButton>
              </ButtonContainer>
            </div>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default HomeDemo

const Container = styled.div`
  width: 100%;
  height: 91vh;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 70vh;
  }

  @media (max-width: 480px) {
    height: 60vh;
  }
`

const BackgroundVideo = styled.video`
  background-color: #000000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${(props) => (props.show ? "block" : "none")};
  background: linear-gradient(180deg, rgba(11, 11, 11, 0.49) 0%, rgba(11, 11, 11, 1) 100%);
`

const StaticImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${(props) => (props.show ? "block" : "none")};
`

const MovieDetails = styled.div`
  position: absolute;
  bottom: 40px;
  left: 20px;
  color: #ccd0cf;
  max-width: 500px;
  background: rgba(13, 13, 13, 0.72);
  padding: 20px;
  border-radius: 10px;
  z-index: 2;

  h1 {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    margin-bottom: 15px;
  }

  .details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 0.9rem;
    color: white;
  }

  @media (min-width: 1440px) {
    max-width: 600px;
    padding: 25px;

    h1 {
      font-size: 2.5rem;
    }

    p {
      font-size: 1.2rem;
    }

    .details {
      font-size: 1rem;
    }
  }

  @media (max-width: 1024px) {
    max-width: 400px;
    padding: 15px;
    background: rgba(13, 13, 13, 0.43);

    h1 {
      font-size: 1.8rem;
    }

    p {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 10px;
    bottom: 20px;
    left: 10px;
    background: rgba(13, 13, 13, 0.39);

    h1 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    background: rgba(13, 13, 13, 0.39);
    h1 {
      font-size: 1.2rem;
    }

    p {
      font-size: 0.7rem;
    }
  }
`

const WatchNowButton = styled.button`
  background: linear-gradient(to right, #d81b60, #8e24aa);
  color: #fff;
  padding: 15px 30px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  border: none;

  &:hover {
    background: white;
    color: black;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`

const MovieSection = styled.div`
  background: #000000;
  padding: 40px 20px;
  position: relative;
  margin-top: 0;

  @media (max-width: 768px) {
    padding: 20px 10px;
  }
`

const MovieList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 30px;
  justify-content: center;
  margin: 0 auto;
  max-width: 1200px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 25px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
`

const MovieItem = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`

const TopMoviesSection = styled.section`
  background: #000000;
  padding: 60px 20px;
  position: relative;
  margin-top: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 40px 10px;
  }
`

const TopMoviesContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  overflow: hidden;
  padding: 20px 0;

  @media (max-width: 768px) {
    padding: 10px 0;
  }
`

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(9, 11, 19, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 3;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(29, 29, 29, 0.8);
  }

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    width: 25px;
    height: 25px;
    font-size: 1rem;
  }
`


const TopMoviesList = styled.div`
  display: flex;
  gap: 20px;
  transition: transform 0.5s ease;
  padding: 0 2rem;

  @media (max-width: 768px) {
    gap: 15px;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    gap: 10px;
    padding: 0 0.5rem;
  }
`

const TopMovieItem = styled.div`
  position: relative;
  flex: 0 0 200px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    z-index: 2;
  }

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(9, 11, 19, 0.3);
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  &:hover img {
    border-color: rgba(255, 255, 255, 0.8);
    border-width: 4px;
  }

  .rank {
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 5rem;
    font-weight: bold;
    color: transparent;
    -webkit-text-stroke: 2px #fff;
    text-shadow: 0 0 10px rgba(141, 36, 170, 0.53);
    transform: translate(-30%, 20%);
    transition: all 0.3s ease;
  }

  &:hover .rank {
    font-size: 6rem;
    color: #8e24aa;
    -webkit-text-stroke: 1px #fff;
    transform: translate(-40%, 5%);
  }

  @media (max-width: 768px) {
    flex: 0 0 150px;

    img {
      height: 225px;
    }

    .rank {
      font-size: 4rem;
    }

    &:hover .rank {
      font-size: 5rem;
    }
  }

  @media (max-width: 480px) {
    flex: 0 0 120px;

    img {
      height: 180px;
    }

    .rank {
      font-size: 3rem;
    }

    &:hover .rank {
      font-size: 4rem;
    }
  }
`

const CategoriesSection = styled.div`
  background: #000000;
  padding: 40px 20px;
  position: relative;
  margin-top: 0;

  @media (max-width: 768px) {
    padding: 20px 10px;
  }
`

const CategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`

const CategoryItem = styled.div`
  background: #000000;
  color: #ccd0cf;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #4a5c6a;
    color: white;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background:rgba(0, 0, 0, 0.81);
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;

  video {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  h4 {
    font-size: 1.8rem;
    color: #fff;
    margin-bottom: 10px;
  }

  .details {
    display: flex;
    justify-content: space-between;
    color: #ccc;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;

    h4 {
      font-size: 1.5rem;
    }
  }
`

const TruncatedDescription = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ccc;
  margin-bottom: 15px;
`

const CloseButton = styled.button`
  background: transparent;
  color: #fff;
  border: 1px solid #fff;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
`

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.93);
  border-top: 6px solid rgb(226, 30, 102);
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
