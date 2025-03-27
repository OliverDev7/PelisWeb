import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useParams } from "react-router-dom";
import { Play, Plus, Film } from "lucide-react";
import { initialMovies } from "../../data/data";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";

const Detail = () => {
  const { id } = useParams();
  const movie = initialMovies.find((movie) => movie.id === Number(id));
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (movie?.poster) {
      const img = new Image();
      img.src = movie.poster;
      img.onload = () => setImageLoaded(true);
    }
  }, [movie]);

  if (!movie) {
    return <div>Película no encontrada</div>;
  }

  // Función para abrir el reproductor con la URL correcta
  const openPlayer = () => {
    console.log("Intentando abrir el reproductor con URL:", movie.videoUrl);
    if (!movie.videoUrl) {
      alert("No hay URL de video disponible");
      return;
    }
    setIsPlayerOpen(true);
  };

  return (
    <DetailContainer>
      <HeroBannerWrapper>
        <HeroBanner background={movie.staticImage} loaded={imageLoaded} />
      </HeroBannerWrapper>

      <Content>
        <Title>{movie.title}</Title>

        <Metadata>
          <span>{movie.edad}+</span>
          <span>{movie.duration}</span>
          <span>{movie.año}</span>
        </Metadata>

        <Description>{movie.description}</Description>

        <ButtonGroup>
          <WatchButton onClick={openPlayer}>
            <Play size={20} />
            Ver ahora
          </WatchButton>
          <TelepartyButton>Start a Teleparty</TelepartyButton>
        </ButtonGroup>

        <ActionButtons>
          <ActionButton>
            <Plus size={24} />
            Mi lista
          </ActionButton>
          <ActionButton>
            <Film size={24} />
            Tráiler
          </ActionButton>
        </ActionButtons>

        <Tags>
          <span>Categoria: {movie.category}</span>
        </Tags>
      </Content>

      {/* Reproductor de video: solo se muestra si isPlayerOpen es true */}
      {isPlayerOpen && 
      <VideoPlayer videoUrl={movie.videoUrl} 
      onClose={() => setIsPlayerOpen(false)} />
      }
    </DetailContainer>
  );
};

export default Detail;


// 🎨 Estilos (sin cambios)
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const DetailContainer = styled.div`
  position: relative;
  min-height: 100vh;
  color: #fff;
`;

const HeroBannerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 56.25vw;
  max-height: 100vh;
  min-height: 400px;
  background-color: #0b0b0b;
`;

const HeroBanner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(${(props) => props.background}) no-repeat center center;
  background-size: cover;
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  animation: ${fadeIn} 2s ease-in-out;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    background: linear-gradient(180deg, rgba(11,11,11,0) 0%, rgba(11,11,11,1) 100%);
  }
`;

const Content = styled.div`
  position: absolute;
  bottom: 10%;
  left: 4%;
  right: 4%;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Metadata = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  color: #fff;
`;

const Description = styled.p`
  font-size: clamp(0.9rem, 2vw, 1rem);
  max-width: 600px;
  margin-bottom: 2rem;
  line-height: 1.5;
  color: #fff;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  padding: 0.8rem 2rem;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  min-width: 200px;

  &:hover {
    opacity: 0.9;
  }
`;

const WatchButton = styled(Button)`
  background: #fff;
  color: #000;
`;

const TelepartyButton = styled(Button)`
  background: linear-gradient(to right, #E91E63, #9C27B0);
  color: #fff;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #fff;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Tags = styled.div`
  display: flex;
  gap: 1rem;
  color: #ccc;
  font-size: 17px;
  font-weight: bold;
`;
