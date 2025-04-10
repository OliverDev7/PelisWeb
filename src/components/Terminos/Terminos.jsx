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
          <Title>Términos y Condiciones</Title>
          <Subtitle>Última actualización: {new Date().toLocaleDateString()}</Subtitle>
        </Header>

        <Section>
          <SectionTitle>1. Introducción</SectionTitle>
          <Paragraph>
            Bienvenido a MovieFilm, tu plataforma de streaming de películas y series. Estos Términos y Condiciones rigen
            el uso de nuestros servicios, incluyendo nuestro sitio web, aplicaciones, contenido audiovisual y cualquier
            otro servicio que ofrecemos. Al acceder o utilizar nuestros servicios, usted acepta estar sujeto a estos
            términos.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>2. Definiciones</SectionTitle>
          <Paragraph>
            <strong>Servicio</strong> se refiere a la plataforma MovieFilm, incluyendo el sitio web, aplicaciones
            móviles, contenido de streaming y todos los servicios relacionados.
          </Paragraph>
          <Paragraph>
            <strong>Usuario</strong> se refiere a cualquier persona que acceda o utilice nuestros servicios.
          </Paragraph>
          <Paragraph>
            <strong>Contenido</strong> se refiere a todas las películas, series, documentales, trailers, imágenes,
            textos, gráficos, logotipos, diseños, interfaces y otros materiales que forman parte de nuestros servicios.
          </Paragraph>
          <Paragraph>
            <strong>Catálogo</strong> se refiere a la colección de películas, series y documentales disponibles en
            nuestra plataforma.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>3. Registro y Cuentas de Usuario</SectionTitle>
          <Paragraph>
            Para acceder a ciertas funciones de nuestro servicio, es posible que deba registrarse y crear una cuenta.
            Usted es responsable de mantener la confidencialidad de su información de cuenta y contraseña, y de
            restringir el acceso a su dispositivo. Usted acepta la responsabilidad por todas las actividades que ocurran
            bajo su cuenta.
          </Paragraph>
          <Paragraph>
            Nos reservamos el derecho de cerrar cuentas, eliminar o editar contenido, o cancelar pedidos a nuestra
            entera discreción.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>4. Contenido Audiovisual</SectionTitle>
          <Paragraph>
            MovieFilm ofrece una amplia variedad de contenido audiovisual, incluyendo películas, series y documentales.
            El catálogo disponible puede variar según la ubicación geográfica, derechos de distribución y otros
            factores.
          </Paragraph>
          <Paragraph>
            Nos esforzamos por proporcionar información precisa sobre el contenido, incluyendo sinopsis, clasificación
            por edades, género y año de lanzamiento. Sin embargo, no garantizamos la exactitud completa de esta
            información.
          </Paragraph>
          <Paragraph>
            La disponibilidad del contenido está sujeta a cambios sin previo aviso. MovieFilm se reserva el derecho de
            agregar, eliminar o modificar el contenido disponible en cualquier momento.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>5. Licencia de Uso</SectionTitle>
          <Paragraph>
            Sujeto a estos Términos y Condiciones, le otorgamos una licencia limitada, no exclusiva, no transferible y
            revocable para acceder y utilizar nuestros servicios para su uso personal y no comercial. Esta licencia
            incluye el derecho a:
          </Paragraph>
          <List>
            <ListItem>Ver películas, series y documentales disponibles en nuestro catálogo</ListItem>
            <ListItem>Utilizar funciones como listas personalizadas, búsquedas y recomendaciones</ListItem>
            <ListItem>
              Descargar contenido para visualización sin conexión (cuando esta función esté disponible)
            </ListItem>
            <ListItem>Acceder al contenido desde dispositivos compatibles</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>6. Calidad de Reproducción</SectionTitle>
          <Paragraph>
            La calidad de reproducción del contenido puede variar según diversos factores, incluyendo su ubicación, la
            velocidad de su conexión a Internet, el dispositivo utilizado y su plan de suscripción.
          </Paragraph>
          <Paragraph>
            MovieFilm ofrece diferentes calidades de reproducción, desde definición estándar (SD) hasta alta definición
            (HD) y, en algunos casos, ultra alta definición (4K). La disponibilidad de estas opciones depende de su plan
            de suscripción y de las capacidades de su dispositivo.
          </Paragraph>
          <Paragraph>
            No garantizamos una calidad de reproducción específica en todo momento, ya que esta puede ajustarse
            automáticamente según las condiciones de su conexión a Internet.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>7. Propiedad Intelectual</SectionTitle>
          <Paragraph>
          Todos los derechos de propiedad intelectual relacionados con los servicios ofrecidos
           en esta plataforma y su contenido audiovisual no pertenecen a MovieFilm. Reconocemos 
           y respetamos que dicho contenido está protegido por las leyes nacionales e 
           internacionales de derechos de autor, marcas registradas y otras normativas aplicables en materia de propiedad intelectual.
          </Paragraph>
          <Paragraph>
          MovieFilm no reclama la titularidad ni autoría de ningún contenido audiovisual mostrado 
          en este sitio. Las películas, series, logotipos, nombres de marcas y demás elementos
           visuales pertenecen exclusivamente a sus respectivos propietarios, productoras, 
           estudios y distribuidores. Su aparición en esta plataforma se debe a fines informativos
            y/o de navegación para el usuario.
          </Paragraph>
          <Paragraph>
          Nada de lo que aparece en este sitio debe interpretarse como una transferencia de derechos, 
          licencia implícita o cualquier otro tipo de autorización sobre el contenido protegido. 
          Cualquier uso indebido del contenido podría constituir una violación de las leyes de 
          propiedad intelectual.
          </Paragraph>
          <Paragraph>
          Si usted es titular de derechos y considera que algún contenido infringe los mismos, 
          le invitamos a ponerse en contacto con nosotros para tomar las medidas pertinentes 
          conforme a la normativa vigente.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. Privacidad</SectionTitle>
          <Paragraph>
            Su privacidad es importante para nosotros. Nuestra Política de Privacidad explica cómo recopilamos,
            utilizamos y protegemos su información personal cuando utiliza nuestros servicios, incluyendo sus hábitos de
            visualización y preferencias de contenido.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>9. Modificaciones</SectionTitle>
          <Paragraph>
            Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones
            entrarán en vigor inmediatamente después de su publicación en nuestros servicios. Su uso continuado de
            nuestros servicios después de cualquier modificación constituye su aceptación de los términos modificados.
          </Paragraph>
          <Paragraph>
            También podemos modificar nuestros servicios, incluyendo el catálogo de contenido, funcionalidades y planes
            de suscripción, en cualquier momento y sin previo aviso.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>10. Limitación de Responsabilidad</SectionTitle>
          <Paragraph>
            En la medida permitida por la ley, MovieFilm no será responsable por daños indirectos, incidentales,
            especiales, consecuentes o punitivos, o por cualquier pérdida de beneficios o ingresos, ya sea directa o
            indirectamente, o por cualquier pérdida de datos, uso, buena voluntad u otras pérdidas intangibles.
          </Paragraph>
          <Paragraph>
            No garantizamos que el contenido audiovisual satisfaga sus expectativas o que nuestros servicios estén
            libres de errores o disponibles de forma ininterrumpida.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>11. Ley Aplicable</SectionTitle>
          <Paragraph>
            Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes del país donde MovieFilm
            tiene su sede principal, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>12. Contacto</SectionTitle>
          <Paragraph>
            Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos a través de nuestro
            formulario de contacto o envíenos un correo electrónico a moviefilm@gmail.com.
          </Paragraph>
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

