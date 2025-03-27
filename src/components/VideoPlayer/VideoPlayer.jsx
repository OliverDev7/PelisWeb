import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Estilos de video.js
import "@videojs/themes/dist/forest/index.css"; // Tema personalizado (opcional)

const CustomVideoPlayer = ({ videoUrl, subtitles, onClose }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  console.log("Renderizando CustomVideoPlayer..."); // Verifica si esto se imprime

  useEffect(() => {
    console.log("Elemento <video>:", videoRef.current); // Verifica que el elemento <video> esté en el DOM
    if (videoRef.current) {
      console.log("Inicializando video.js...");

      // Retrasa la inicialización de video.js para asegurarse de que el elemento <video> esté en el DOM
      const timeoutId = setTimeout(() => {
        const player = videojs(videoRef.current, {
          controls: true,
          fluid: true,
          sources: [
            {
              src: videoUrl,
              type: "video/mp4",
            },
          ],
          tracks: subtitles,
        });

        playerRef.current = player;
      }, 100); // Retraso de 100ms

      return () => {
        clearTimeout(timeoutId); // Limpia el timeout si el componente se desmonta
        if (playerRef.current) {
          playerRef.current.dispose();
        }
      };
    }
  }, [videoUrl, subtitles]);

  return (
    <VideoPlayerOverlay>
      <VideoPlayerContainer>
        <div data-vjs-player>
          <video ref={videoRef} className="video-js vjs-theme-forest" />
        </div>
        <CloseButton onClick={onClose}>✖</CloseButton>
      </VideoPlayerContainer>
    </VideoPlayerOverlay>
  );
};

export default CustomVideoPlayer;

// Estilos con Styled Components
const VideoPlayerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegúrate de que esté por encima de otros elementos */
`;

const VideoPlayerContainer = styled.div`
  background: #000;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  width: 90%;
  max-width: 800px;
  aspect-ratio: 16 / 9;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .section-to-adjust {
    margin-top: 10px;
    text-align: center;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 10px;

    .section-to-adjust {
      margin-top: 5px;
    }
  }

  @media (max-width: 480px) {
    width: 100%;
    border-radius: 0;
    padding: 0;

    .section-to-adjust {
      margin-top: 0;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background:rgb(255, 0, 0);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  z-index: 1001;

  &:hover {
    background:rgb(255, 255, 255);
    color: black;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;