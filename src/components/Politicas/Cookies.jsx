"use client"
import styled from "styled-components"
import { motion } from "framer-motion"
import Footer from "../../components/Footer/Footer"

const Cookies = () => {
  return (
    <Container>
      <Content
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>Política de Cookies</Title>
          <Subtitle>Última actualización: {new Date().toLocaleDateString()}</Subtitle>
        </Header>

        <Section>
          <SectionTitle>1. ¿Qué son las Cookies?</SectionTitle>
          <Paragraph>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computadora, tableta o móvil)
            cuando visita un sitio web. Las cookies son ampliamente utilizadas para hacer que los sitios web funcionen
            de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
          </Paragraph>
          <Paragraph>
            En MovieFilm, utilizamos cookies para mejorar su experiencia de navegación y streaming, recordar sus
            preferencias y ofrecerle contenido personalizado.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>2. Cómo Utilizamos las Cookies</SectionTitle>
          <Paragraph>MovieFilm utiliza cookies y tecnologías similares para diversos propósitos, incluyendo:</Paragraph>
          <List>
            <ListItem>
              <strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento de nuestra plataforma. Le permiten
              navegar, iniciar sesión en su cuenta, reproducir contenido y utilizar funciones esenciales como la lista
              de reproducción y el control de calidad del streaming.
            </ListItem>
            <ListItem>
              <strong>Cookies de Preferencias:</strong> Recuerdan información que cambia la forma en que nuestra
              plataforma se comporta o se ve, como su idioma preferido, calidad de reproducción seleccionada,
              configuración de subtítulos, volumen y punto donde dejó de ver una película o serie.
            </ListItem>
            <ListItem>
              <strong>Cookies Estadísticas:</strong> Nos ayudan a entender cómo los usuarios interactúan con nuestra
              plataforma, qué contenido es más popular, cuánto tiempo pasan viendo diferentes tipos de películas o
              series, y qué funciones utilizan con más frecuencia.
            </ListItem>
            <ListItem>
              <strong>Cookies de Marketing:</strong> Utilizadas para mostrarle recomendaciones de películas y series
              basadas en sus intereses y hábitos de visualización, así como para medir la efectividad de nuestras
              campañas promocionales.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. Tipos de Cookies que Utilizamos</SectionTitle>
          <Table>
            <thead>
              <tr>
                <TableHeader>Categoría</TableHeader>
                <TableHeader>Propósito</TableHeader>
                <TableHeader>Duración</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell>Sesión</TableCell>
                <TableCell>Estas cookies son temporales y se eliminan cuando cierra su navegador.</TableCell>
                <TableCell>Sesión</TableCell>
              </tr>
              <tr>
                <TableCell>Persistentes</TableCell>
                <TableCell>
                  Estas cookies permanecen en su dispositivo hasta que expiran o las elimina manualmente.
                </TableCell>
                <TableCell>Varía (1 mes - 2 años)</TableCell>
              </tr>
              <tr>
                <TableCell>Propias</TableCell>
                <TableCell>Establecidas por nuestro sitio web.</TableCell>
                <TableCell>Varía</TableCell>
              </tr>
              <tr>
                <TableCell>De terceros</TableCell>
                <TableCell>Establecidas por nuestros socios y proveedores de servicios.</TableCell>
                <TableCell>Varía</TableCell>
              </tr>
            </tbody>
          </Table>
        </Section>

        <Section>
          <SectionTitle>4. Cookies Específicas que Utilizamos</SectionTitle>
          <Paragraph>
            A continuación se detallan algunas de las cookies específicas que utilizamos y su propósito:
          </Paragraph>
          <Table>
            <thead>
              <tr>
                <TableHeader>Nombre</TableHeader>
                <TableHeader>Proveedor</TableHeader>
                <TableHeader>Propósito</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell>_ga</TableCell>
                <TableCell>Google Analytics</TableCell>
                <TableCell>
                  Registra una identificación única que se utiliza para generar datos estadísticos sobre cómo el
                  visitante utiliza el sitio web.
                </TableCell>
              </tr>
              <tr>
                <TableCell>_gid</TableCell>
                <TableCell>Google Analytics</TableCell>
                <TableCell>
                  Registra una identificación única que se utiliza para generar datos estadísticos sobre cómo el
                  visitante utiliza el sitio web.
                </TableCell>
              </tr>
              <tr>
                <TableCell>auth_token</TableCell>
                <TableCell>MovieFilm</TableCell>
                <TableCell>Mantiene al usuario conectado durante una sesión.</TableCell>
              </tr>
              <tr>
                <TableCell>preferences</TableCell>
                <TableCell>MovieFilm</TableCell>
                <TableCell>
                  Almacena las preferencias del usuario como el idioma, calidad de reproducción y configuración de
                  subtítulos.
                </TableCell>
              </tr>
              <tr>
                <TableCell>watch_history</TableCell>
                <TableCell>MovieFilm</TableCell>
                <TableCell>
                  Guarda información sobre el contenido que ha visto y dónde dejó de ver cada película o serie.
                </TableCell>
              </tr>
              <tr>
                <TableCell>recommendations</TableCell>
                <TableCell>MovieFilm</TableCell>
                <TableCell>
                  Almacena datos sobre sus preferencias de contenido para mejorar las recomendaciones personalizadas.
                </TableCell>
              </tr>
              <tr>
                <TableCell>player_settings</TableCell>
                <TableCell>MovieFilm</TableCell>
                <TableCell>
                  Guarda su configuración del reproductor, como volumen, velocidad de reproducción y calidad preferida.
                </TableCell>
              </tr>
            </tbody>
          </Table>
        </Section>

        <Section>
          <SectionTitle>5. Cookies y Experiencia de Streaming</SectionTitle>
          <Paragraph>
            Las cookies son especialmente importantes para optimizar su experiencia de streaming en MovieFilm. Nos
            permiten:
          </Paragraph>
          <List>
           
            <ListItem>Ajustar automáticamente la calidad del video según su conexión a internet</ListItem>
            <ListItem>Guardar sus preferencias de audio y subtítulos</ListItem>
            <ListItem>Crear recomendaciones personalizadas basadas en su historial de visualización</ListItem>
            <ListItem>Mantener un registro de su lista de contenido guardado para ver más tarde</ListItem>
          </List>
          <Paragraph>
            Desactivar estas cookies puede afectar significativamente su experiencia de usuario en nuestra plataforma.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>6. Control de Cookies</SectionTitle>
          <Paragraph>
            La mayoría de los navegadores web permiten cierto control de la mayoría de las cookies a través de la
            configuración del navegador. Para obtener más información sobre las cookies, incluido cómo ver qué cookies
            se han establecido y cómo administrarlas y eliminarlas, visite{" "}
            <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
              www.allaboutcookies.org
            </a>
            .
          </Paragraph>
          <Paragraph>
            Puede configurar su navegador para rechazar todas las cookies, aceptar solo cookies de origen, o avisarle
            cuando se envía una cookie. Sin embargo, rechazar las cookies puede afectar su capacidad para utilizar
            ciertas funciones de nuestra plataforma, como el inicio de sesión automático, la reproducción continua y las
            recomendaciones personalizadas.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>7. Cookies y Privacidad</SectionTitle>
          <Paragraph>
            Para obtener más información sobre cómo utilizamos, almacenamos y mantenemos seguros sus datos personales,
            incluyendo la información recopilada a través de cookies, consulte nuestra{" "}
            <a href="/privacidad">Política de Privacidad</a>.
          </Paragraph>
          <Paragraph>
            Respetamos su privacidad y nos comprometemos a ser transparentes sobre cómo utilizamos las cookies para
            mejorar su experiencia en MovieFilm.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. Cambios en nuestra Política de Cookies</SectionTitle>
          <Paragraph>
            Podemos actualizar nuestra Política de Cookies de vez en cuando para reflejar cambios en nuestras prácticas
            o por razones operativas, legales o regulatorias. Le notificaremos cualquier cambio significativo publicando
            la nueva Política de Cookies en esta página y actualizando la fecha de Última actualización en la parte
            superior.
          </Paragraph>
          <Paragraph>
            Le recomendamos que revise esta política periódicamente para estar informado sobre cómo estamos utilizando
            las cookies para mejorar su experiencia de streaming.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>9. Contáctenos</SectionTitle>
          <Paragraph>Si tiene alguna pregunta sobre nuestra Política de Cookies, no dude en contactarnos:</Paragraph>
          <ContactInfo>
            <div>Email: moviefilm@gmail.com</div>
          </ContactInfo>
        </Section>
      </Content>
      <Footer />
    </Container>
  )
}

export default Cookies

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

const SectionTitle = styled.h2`
  color: #E91E63;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`

const Paragraph = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  
  a {
    color: #E91E63;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #9C27B0;
      text-decoration: underline;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`

const List = styled.ul`
  color: rgba(255, 255, 255, 0.8);
  padding-left: 2rem;
  margin-bottom: 1rem;
`

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.6;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
`

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem;
  background-color: rgba(233, 30, 99, 0.2);
  border-bottom: 2px solid #E91E63;
`

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const ContactInfo = styled.div`
  background-color: rgba(233, 30, 99, 0.1);
  border-left: 3px solid #E91E63;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 0 8px 8px 0;
  
  div {
    margin-bottom: 0.5rem;
  }
`

