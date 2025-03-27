"use client"

import { useState, useRef } from "react"
import { useParams } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { seriesData } from "../../data/seriesData"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const SeriesDetailContainer = styled.div`
  background-color: #141414;
  min-height: 100vh;
  color: #fff;
`

const SeriesBanner = styled.div`
  height: 105vh;
  background-image: url(${(props) => props.background});
  background-size: cover;
  background-position: center;
  position: relative;
  animation: ${fadeIn} 2s ease-in;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(20,20,20,0) 50%, rgba(20,20,20,0.8) 80%, rgba(20,20,20,1) 100%);
  }
`

const SeriesInfo = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 20px;

  @media (max-width: 768px) {
    bottom: 20px;
  }
`

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const Description = styled.p`
  font-size: 1rem;
  max-width: 600px;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`

const WatchNowButton = styled.button`
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f40612;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
`

const SeasonSelector = styled.select`
  padding: 10px;
  font-size: 1rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  margin: 20px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px;
    margin: 10px;
  }
`

const EpisodeCarouselContainer = styled.div`
  position: relative;
  padding: 0 40px;
`

const EpisodeCarousel = styled.div`
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`

const EpisodeCard = styled.div`
  flex: 0 0 300px;
  margin-right: 15px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  @media (max-width: 768px) {
    flex: 0 0 250px;
  }

  @media (max-width: 480px) {
    flex: 0 0 100%;
  }
`

const EpisodeImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
  }

  &:hover::after {
    border-color: white;
  }
`

const EpisodeImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${EpisodeImageContainer}:hover & {
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`

const EpisodeOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${EpisodeImageContainer}:hover & {
    opacity: 1;
  }
`

const EpisodeInfo = styled.div`
  padding: 15px;
 background-color: rgba(0, 0, 0, 0.5);
`

const EpisodeTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const EpisodeDuration = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

const Duration = styled.span`
  color: white;
`

const EpisodeNumber = styled.span`
 color: white;
`

const EpisodeDescription = styled.p`
  font-size: 0.9rem;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  font-weight: semibold;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

const PlayButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 2;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
`

const PrevButton = styled(CarouselButton)`
  left: 0;
`

const NextButton = styled(CarouselButton)`
  right: 0;
`

const SeriesDetail = () => {
  const { id } = useParams()
  const serie = seriesData.find((s) => s.id === Number.parseInt(id))
  const [selectedSeason, setSelectedSeason] = useState(1)
  const episodeListRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  if (!serie) {
    return <div>Serie no encontrada</div>
  }

  const handleSeasonChange = (event) => {
    setSelectedSeason(Number.parseInt(event.target.value))
    setScrollPosition(0)
  }

  const scrollToEpisodes = () => {
    episodeListRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleScroll = (direction) => {
    const container = episodeListRef.current
    if (container) {
      const scrollAmount = direction === "next" ? 300 : -300
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setScrollPosition(container.scrollLeft + scrollAmount)
    }
  }

  const currentEpisodes = serie.seasons.find((season) => season.number === selectedSeason).episodes

  return (
    <SeriesDetailContainer>
      <SeriesBanner background={serie.banner}>
        <SeriesInfo>
          <Title>{serie.title}</Title>
          <Description>{serie.description}</Description>
          <WatchNowButton onClick={scrollToEpisodes}>Ver ahora</WatchNowButton>
        </SeriesInfo>
      </SeriesBanner>

      <SeasonSelector onChange={handleSeasonChange} value={selectedSeason}>
        {serie.seasons.map((season, index) => (
          <option key={index} value={season.number}>
            Temporada {season.number}
          </option>
        ))}
      </SeasonSelector>

      <EpisodeCarouselContainer>
        <PrevButton onClick={() => handleScroll("prev")} disabled={scrollPosition <= 0}>
          <ChevronLeft size={24} />
        </PrevButton>
        <EpisodeCarousel ref={episodeListRef}>
          {currentEpisodes.map((episode, index) => (
            <EpisodeCard key={index}>
              <EpisodeImageContainer>
                <EpisodeImage src={episode.thumbnail} alt={episode.title} />
                <EpisodeOverlay>
                  <PlayButton>
                    <Play color="white" size={24} />
                  </PlayButton>
                </EpisodeOverlay>
              </EpisodeImageContainer>
              <EpisodeInfo>
                <EpisodeTitle>{episode.title}</EpisodeTitle>
                <EpisodeDuration>
                  <Duration>{episode.duration}</Duration>
                  <EpisodeNumber>Episodio {episode.number}</EpisodeNumber>
                </EpisodeDuration>
                <EpisodeDescription>{episode.description}</EpisodeDescription>
              </EpisodeInfo>
            </EpisodeCard>
          ))}
        </EpisodeCarousel>
        <NextButton
          onClick={() => handleScroll("next")}
          disabled={scrollPosition >= (currentEpisodes.length - 1) * 300}
        >
          <ChevronRight size={24} />
        </NextButton>
      </EpisodeCarouselContainer>
    </SeriesDetailContainer>
  )
}

export default SeriesDetail

