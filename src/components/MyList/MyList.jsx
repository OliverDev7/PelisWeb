"use client"

import { useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useMyList } from "../../context/MyListContext"
import { useNavigate } from "react-router-dom"

const MyList = () => {
  const { myList, loading, removeFromMyList } = useMyList()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const navigate = useNavigate()

  const toggleItemSelection = (movieId) => {
    if (selectedItems.includes(movieId)) {
      setSelectedItems(selectedItems.filter((id) => id !== movieId))
    } else {
      setSelectedItems([...selectedItems, movieId])
    }
  }

  const removeSelectedItems = () => {
    selectedItems.forEach((id) => removeFromMyList(id))
    setSelectedItems([])
    setIsEditing(false)
  }

  const handleMoviePress = (movie) => {
    if (isEditing) {
      toggleItemSelection(movie.id)
    } else {
      navigate(`/detail/${movie.id}`, { state: { movie } })
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
          <LoadingText>Cargando tu lista...</LoadingText>
        </LoadingContainer>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>Mi Lista</Title>

        {myList.length > 0 && (
          <HeaderActions>
            {isEditing ? (
              <>
                <HeaderButton
                  onClick={() => {
                    setIsEditing(false)
                    setSelectedItems([])
                  }}
                >
                  Cancelar
                </HeaderButton>

                {selectedItems.length > 0 && (
                  <DeleteButton onClick={removeSelectedItems}>Eliminar ({selectedItems.length})</DeleteButton>
                )}
              </>
            ) : (
              <HeaderButton onClick={() => setIsEditing(true)}>Editar</HeaderButton>
            )}
          </HeaderActions>
        )}
      </Header>

      {myList.length === 0 ? (
        <EmptyContainer>
          <EmptyIcon>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z"
                stroke="#E91E63"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </EmptyIcon>
          <EmptyText>Tu lista está vacía</EmptyText>
          <EmptySubtext>Agrega películas y series a tu lista para verlas más tarde</EmptySubtext>
          <ExploreButton onClick={() => navigate("/")}>Explorar contenido</ExploreButton>
        </EmptyContainer>
      ) : (
        <Grid>
          <AnimatePresence>
            {myList.map((movie, index) => (
              <MyListMovieCard
                key={movie.id}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleMoviePress(movie)}
                selected={selectedItems.includes(movie.id)}
              >
                <ImageContainer>
                  <MovieImage
                    src={movie.poster || movie.banner || "https://via.placeholder.com/300x450?text=No+Image"}
                    alt={movie.title}
                  />
                  <Gradient />
                  <MovieHoverInfo>
                    <MovieTitle>{movie.title || "Sin título"}</MovieTitle>
                    <MovieDescription>
                      {movie.description 
                        ? movie.description.length > 100 
                          ? `${movie.description.substring(0, 100)}...` 
                          : movie.description
                        : "Descripción no disponible"}
                    </MovieDescription>
                    <MovieMeta>
                      {movie.year && <MetaItem>{movie.year}</MetaItem>}
                      {movie.duration && <MetaItem>{movie.duration}</MetaItem>}
                      {movie.rating && (
                        <RatingContainer>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z"
                              fill="#FFD700"
                              stroke="#FFD700"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{movie.rating}</span>
                        </RatingContainer>
                      )}
                    </MovieMeta>
                    {movie.category && (
                      <CategoryBadge>
                        {movie.category}
                      </CategoryBadge>
                    )}
                  </MovieHoverInfo>

                  {isEditing && (
                    <CheckboxContainer>
                      <Checkbox selected={selectedItems.includes(movie.id)}>
                        {selectedItems.includes(movie.id) && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
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
                        )}
                      </Checkbox>
                    </CheckboxContainer>
                  )}
                </ImageContainer>
              </MyListMovieCard>
            ))}
          </AnimatePresence>
        </Grid>
      )}
    </Container>
  )
}

// Estilos
const Container = styled.div`
  padding: 80px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
`

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`

const HeaderButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const DeleteButton = styled.button`
  background: #E91E63;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #d81b60;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #E91E63;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const LoadingText = styled.p`
  color: #fff;
  font-size: 16px;
`

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
`

const EmptyIcon = styled.div`
  margin-bottom: 20px;
  opacity: 0.7;
`

const EmptyText = styled.h2`
  font-size: 24px;
  color: #fff;
  margin-bottom: 10px;
`

const EmptySubtext = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 400px;
  margin-bottom: 30px;
  line-height: 1.5;
`

const ExploreButton = styled.button`
  background: #E91E63;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #d81b60;
    transform: translateY(-2px);
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }
`

const MyListMovieCard = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.selected ? 0.7 : 1)};
  transform: ${(props) => (props.selected ? "scale(0.98)" : "scale(1)")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: ${(props) => (props.selected ? "scale(0.98)" : "scale(1.05)")};
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
`

const ImageContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 2/3;
  margin-bottom: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
`

const MovieImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`

const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
`

const MovieHoverInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  transform: translateY(100%);
  transition: transform 0.5s ease, opacity 0.5s ease;
  opacity: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  ${MyListMovieCard}:hover & {
    transform: translateY(0);
    opacity: 1;
  }
`

const MovieTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
`

const MovieDescription = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const MovieMeta = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
`

const MetaItem = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #FFD700;
  font-weight: 600;
`

const CategoryBadge = styled.div`
  background: #E91E63;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
  align-self: flex-start;
  margin-top: 8px;
`

const CheckboxContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
`

const Checkbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: ${(props) => (props.selected ? "#E91E63" : "rgba(255, 255, 255, 0.3)")};
  border: 2px solid ${(props) => (props.selected ? "#E91E63" : "white")};
  display: flex;
  align-items: center;
  justify-content: center;
`

export default MyList