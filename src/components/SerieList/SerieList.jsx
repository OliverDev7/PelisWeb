import styled from "styled-components"
import { Link } from "react-router-dom"
import { seriesData } from "../../data/seriesData"

const SeriesListContainer = styled.div`
  padding: 20px;
  background-color: #141414;
  min-height: 100vh;
`

const Title = styled.h1`
  color: #fff;
  font-size: 2rem;
  margin-bottom: 20px;
`

const SeriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`

const SerieCard = styled(Link)`
  text-decoration: none;
  color: #fff;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`

const SerieImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
`

const SerieTitle = styled.h3`
  margin-top: 10px;
  font-size: 1rem;
`

const SeriesList = () => {
  return (
    <SeriesListContainer>
      <Title>Series</Title>
      <SeriesGrid>
        {seriesData.map((serie) => (
          <SerieCard key={serie.id} to={`/series/${serie.id}`}>
            <SerieImage src={serie.poster} alt={serie.title} />
            <SerieTitle>{serie.title}</SerieTitle>
          </SerieCard>
        ))}
      </SeriesGrid>
    </SeriesListContainer>
  )
}

export default SeriesList

