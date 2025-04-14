"use client"
import styled from "styled-components"
import { motion } from "framer-motion"
import Footer from "../../components/Footer/Footer"

const Terminos = () => {
  return (
    <Container>
      <Content
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>Sobre MovieFilm</Title>
          <Subtitle>Última actualización: {new Date().toLocaleDateString()}</Subtitle>
        </Header>
        <Section>
          <AboutContainer>
            <AboutParagraph>
              MovieFilm es una plataforma digital que ofrece una experiencia cinematográfica inigualable, convirtiéndose
              en el destino preferido para los amantes del cine y las series. A través de su portal web, los usuarios
              tienen acceso a una vasta colección de películas, series y documentales de alta calidad, abarcando todos
              los géneros. Se destaca por su compromiso con la excelencia visual y la diversidad de opciones, desde los
              últimos estrenos hasta joyas cinematográficas del pasado. Con una interfaz amigable e intuitiva, MovieFilm
              invita a los espectadores a sumergirse en un universo de emociones y aventuras desde la comodidad de su
              hogar.
            </AboutParagraph>

            <AboutSubtitle>Ver películas online</AboutSubtitle>
            <AboutParagraph>
              Olvídate de las largas filas en el cine, ahora puedes disfrutar del cine en casa con todas las películas
              online gratis. Sumérgete en el cine desde la comodidad de tu hogar con solo unos pocos clics. Accede a
              todas las categorías de películas gratis, elige tu favorita, siéntate tranquilo y disfruta de una
              experiencia inigualable sin interrupciones de anuncios. Las películas online se han popularizado
              enormemente, y nuestra plataforma se encarga de llevarte el mejor contenido de películas online completas
              directamente a tu hogar.
            </AboutParagraph>

            <AboutSubtitle>Ver películas en latino</AboutSubtitle>
            <AboutParagraph>
              El cine hispano ha crecido significativamente, convirtiéndose en uno de los favoritos para los
              espectadores de habla hispana en todo el mundo. Gracias a las plataformas de streaming, ahora es más fácil
              encontrar películas en latino. Este fenómeno ha motivado a cineastas de diferentes regiones a crear
              contenido en español, reconociendo su potencial para llegar a una audiencia global. Las películas en
              latino no solo tienen un lugar en los países de habla hispana, sino que también han ganado relevancia en
              el panorama cinematográfico internacional.
            </AboutParagraph>

            <AboutSubtitle>Ver películas gratis</AboutSubtitle>
            <AboutParagraph>
              Existen muchas formas de ver películas gratis en internet, pero ninguna como MovieFilm. Nuestro catálogo
              se adapta a tus necesidades como usuario, ofreciendo una variedad excelente de películas online gratis.
              Cuando el dinero no alcanza para una membresía premium, nuestra plataforma es la solución perfecta.
              Disfruta de maratones de películas gratis con tus amigos y comparte nuestro sitio web para llenar de
              alegría otros hogares con nuestras películas gratis completas.
            </AboutParagraph>
          </AboutContainer>
        </Section>
      </Content>
      <Footer />
    </Container>
  )
}

export default Terminos

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(233, 30, 99, 0.1) 100%
  );
`

const Content = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 100px auto 40px;
  padding: 2rem;
  background-color: rgb(10, 12, 12);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 80px auto 30px;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    margin: 70px auto 20px;
    border-radius: 12px;
  }
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`

const Section = styled.section`
  margin-bottom: 2rem;
`

const AboutContainer = styled.div`
  background: linear-gradient(to bottom, rgba(233, 30, 99, 0.05), rgba(156, 39, 176, 0.05));
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid rgba(233, 30, 99, 0.1);
`

const AboutParagraph = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 1.25rem;
  text-align: justify;
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`

const AboutSubtitle = styled.h3`
  color: #E91E63;
  font-size: 1.25rem;
  margin: 1.5rem 0 0.75rem;
  font-weight: 600;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`

