import styled from "styled-components"
const Home = () => {
  return (
    <>
    {/* Primer contenedor o seccion, imagen en grande con detalles */}
      <Container>
        <BackgroundVideo>
          <source src={"/public/videos/video3.mp4"} type="video/mp4"/>
        </BackgroundVideo>
        <StaticImage src="/public/imgs/imgback/peli3bg.png" />
        <MovieDetails>
          <h1>Nombre Pelicula</h1>
          <p>Descripcion</p>
          <div className="details">
              <span>categoria</span>
              <span>duracion</span>
          </div>
          <WatchNow>Ver ahora</WatchNow>
        </MovieDetails>
      </Container>

      {/* Segundo contenedor o seccion, peliculas recomendadas */}
      <MovieSection>
          <h2 
          style={{color: "white", textAlign: "center"}}>Peliculas recomendadas</h2>
          <MovieList>
            <MovieItem>
                <img src="/public/imgs/poster/peli5.jpg" />
            </MovieItem>
          </MovieList>
      </MovieSection>

        {/* tercer contenedor o seccion, peliculas en top vistas*/}
      <TopMoviesSection>
        <h2 style={{ color: "white", textAlign: "center"}}>Top 10</h2>
        <h2 style={{ color: "white", textAlign: "center"}}>Peliculas mas vistas</h2>
        <TopMoviesContainer>
          <ArrowButton className="left">
          &#10094;
          </ArrowButton>
          <TopMoviesList>
            <TopMovieItem>
              <img src="/public/imgs/poster/peli7.jpg" alt="" />
              <div className="rank"></div>
            </TopMovieItem>
          </TopMoviesList>
          <ArrowButton className="right">
          &#10095;
          </ArrowButton>
        </TopMoviesContainer>
      </TopMoviesSection>

       {/* 4 contenedor o seccion, peliculas categorizadas*/}

       <CategoriesSection>
        <h2 style={{ color: "white", textAlign: "center"}}>Categorias</h2>
        <CategoriesList>
          <CategoryItem style={{ background: "#8E24AA"}}>
              Categorias
          </CategoryItem>
        </CategoriesList>
       </CategoriesSection>

       <MovieSection>
        <h2 style={{ color: "white", textAlign: "center"}}>
          Peliculas categorizadas por:
        </h2>
        <MovieList>
          <MovieItem>
            <img src="/public/imgs/poster/peli13.jpg" alt="" />
          </MovieItem>
        </MovieList>
       </MovieSection>

        {/* 5 contenedor o seccion, para mostrar el detalle de la pelicula*/}
        {/*
        <Modal>
          <ModalContent>
            <video muted loop autoPlay>
              <source src={"/public/videos/video13.mp4"} type="video/mp4"/>
            </video>
            <div className="info">
              <h4>Titulo pelicula</h4>
              <TruncatedDescription>Desc pelicula</TruncatedDescription>
              <div className="details">
                <span>Categoria</span>
                <span>Duracion</span>
              </div>
              <ButtonContainer>
                <CloseButton>
                  Volver
                </CloseButton>
                <WatchNow>Ver Pelicula</WatchNow>
              </ButtonContainer>
            </div>
          </ModalContent>
        </Modal>
        */}
    </>
  )
}

export default Home

const Container = styled.div`
  width: 100%;  // El contenedor ocupa todo el ancho de la pantalla
  height: 91vh;  // La altura del contenedor es el 91% de la altura de la ventana del navegador

  position: relative;  // El contenedor se posiciona de manera relativa, lo que permite posicionar elementos dentro de él con "position: absolute"
  overflow: hidden;  // Si algún contenido se sale del contenedor, no se muestra

  @media (max-width: 768px) {  // Si la pantalla tiene un ancho menor o igual a 768px (tabletas y pantallas pequeñas)
    height: 70vh;  // La altura del contenedor se ajusta al 70% de la altura de la ventana
  }

  @media (max-width: 480px) {  // Si la pantalla tiene un ancho menor o igual a 480px (móviles)
    height: 60vh;  // La altura del contenedor se ajusta al 60% de la altura de la ventana
  }
`;

const BackgroundVideo = styled.video`
  background-color: #000;  // El fondo del video será negro en caso de que no cargue correctamente o haya algún error
  position: relative;  // El video se posiciona relativamente dentro del contenedor
  top: 0;  // El video se coloca en la parte superior del contenedor
  left: 0;  // El video se coloca en la parte izquierda del contenedor
  width: 100%;  // El video ocupa todo el ancho del contenedor
  height: 100%;  // El video ocupa toda la altura del contenedor
  object-fit: cover;  // El video cubre todo el espacio del contenedor sin deformarse; si es necesario, se recorta
  display: inline-block;  // El video se comporta como un bloque, pero no genera saltos de línea en el diseño
  background: linear-gradient(180deg, rgba(11, 11, 11, 0.49) 0%, rgba(11, 11, 11, 1) 100%);  // Aplica un gradiente oscuro de arriba a abajo en el video
`;

const StaticImage = styled.img`
  position: absolute;  // La imagen se posiciona de manera absoluta dentro del contenedor, sobre el video
  top: 0;  // La imagen se coloca en la parte superior del contenedor
  left: 0;  // La imagen se coloca en la parte izquierda del contenedor
  width: 100%;  // La imagen ocupa todo el ancho del contenedor
  height: 100%;  // La imagen ocupa toda la altura del contenedor
  object-fit: cover;  // La imagen cubre todo el espacio del contenedor sin deformarse; si es necesario, se recorta
  display: inline-block;  // La imagen se comporta como un bloque, pero no genera saltos de línea en el diseño
`;

const MovieDetails = styled.div`
 position: absolute;
 bottom: 40px;
 left: 20px;
 color: #ccd0cf;
 max-width 500px;
 background-color: rgba(13, 13, 13, 0.72);
 padding: 20px;
 border-radius: 10px;
 z-index: 2;

 h1{
   font-size: 2rem;
   margin-bottom: 10px;
 }
 p{
  font-size: 1rem;
  margin-bottom: 15px;
 }

 .details{
   display: flex;
   justify-content: space-between;
   margin-bottom: 10px;
   font-size: 0.9rem;
   color: white;
 }
`;
const WatchNow = styled.button`
 background: linear-gradient(to right, #d81b60, #8e24aa);
 color: white;
 padding: 15px 30px;
 font-size: 18px;
 cursor: pointer;
 border-radius: 5px;
 font-weight: bold;
 border: none;

 &:hover{
 background: white;
 color: black;
 }

 @media (max-width: 768){
  padding: 10px 20px;
  font-size: 16px;
 }
`;

const MovieSection = styled.div`
 background: #000;
 padding: 40px 20px;
 position: relative;
 margin-top: 0;

 @media(max-width: 768){
 padding: 20px 10px
 }
 `;

const MovieList = styled.div`
 display:grid;
 grid-template-columns: repeat(auto-fit, minmax(180px,1fr));
 gap: 39px;
 justify-content: center;
 margin: 0 auto;
 max-width: 1200px;
`;
const MovieItem = styled.div`
 position: relative;
 width: 100%;
 cursor: pointer;

 img: {
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease;
 }

 &:hover img{
  transform: scale(1.05);
 }

 @media (max-width: 768px){
  width: 100%;
 }
`;

const TopMoviesSection = styled.section`
  background-color: #000;
  padding: 60px 20px;
  position: relative;
  margin-top: 0;
  overflow: hidden;

  @media (max-width: 768px){
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

  @media (max-width: 768px){
  padding: 10px 0;
  }
`

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(9, 11, 19, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 3;
  transition: all 0.3s ease;

  &:hover {
  background-color: rgba(29, 29, 29, 0.8);
  }

  &.left{
  left: 10px;
  }

  &.right{
  right: 10px;
  }
`


const TopMoviesList = styled.div`
 display: flex;
 gap: 20px;
 transition: transform 0.5s ease;
 padding: 0 2rem;

 @media (min-width: 768px){
  gap: 15px;
  padding: 0 1rem;
 }

 @media (min-width: 480px){
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

  &:hover img{
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
  
  &: hover .rank{
   font-size: 6rem;
   color: #8e24aa;
   -webkit-text-stroke: 1px #fff;
   transform: translate(-40%, 5%);
  }
`

const CategoriesSection = styled.div`
  background-color: #000;
  padding: 40px 20px;
  position: relative;
  margin-top: 0;
`

const CategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`

const CategoryItem = styled.div`
  background: #000;
  color: #ccd0cf;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover{
   background-color: #4a5c6a;
   color: white;
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
  background: rgba(0, 0, 0, 0.81);
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
    font-size: 1.8rem
    color: #fff;
    margin-bottom: 10px;
   }
   
   .details {
    display: flex;
    justify-content: space-between;
    color: #ccc;
    margin-bottom: 20px;
   }
`

const TruncatedDescription = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ccc;
  margin-bottom 15px;
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

  &:hover{
   background: #rgba(255, 255, 255, 0.1);
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`