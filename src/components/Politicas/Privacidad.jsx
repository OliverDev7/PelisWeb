"use client"
import styled from "styled-components"
import { motion } from "framer-motion"
import Footer from "../../components/Footer/Footer"

const Privacidad = () => {
  const Subtitle = styled.h2`
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.2rem;
    font-weight: 300;
    margin-top: 0.5rem;
  `

  const Section = styled.section`
    margin-bottom: 2rem;
  `

  const SectionTitle = styled.h3`
      color: #E91E63;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
  `

  const Paragraph = styled.p`
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  `

  const List = styled.ul`
    list-style: disc;
    padding-left: 2rem;
    margin-bottom: 1rem;
  `

  const ListItem = styled.li`
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 0.5rem;
  `

  const ContactInfo = styled.div`
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    line-height: 1.6;
  `

  return (
    <Container>
      <Content
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>Política de Privacidad</Title>
          <Subtitle>Última actualización: {new Date().toLocaleDateString()}</Subtitle>
        </Header>

        <Section>
          <SectionTitle>1. Introducción</SectionTitle>
          <Paragraph>
            En MovieFilm, valoramos y respetamos su privacidad. Esta Política de Privacidad explica cómo recopilamos,
            utilizamos, divulgamos y protegemos su información cuando utiliza nuestra plataforma de streaming, sitio
            web, aplicaciones móviles y servicios relacionados (colectivamente, los Servicios).
          </Paragraph>
          <Paragraph>
            Al utilizar nuestros Servicios, usted acepta las prácticas descritas en esta Política de Privacidad. Si no
            está de acuerdo con esta política, por favor no utilice nuestros Servicios.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>2. Información que Recopilamos</SectionTitle>
          <Paragraph>
            <strong>Información Personal:</strong> Podemos recopilar información personal que usted nos proporciona
            directamente, como su nombre, dirección de correo electrónico, número de teléfono y cualquier otra información que elija proporcionar al crear una cuenta o suscribirse a
            nuestros servicios.
          </Paragraph>
          <Paragraph>
            <strong>Información de Visualización:</strong> Recopilamos datos sobre su actividad de visualización,
            incluyendo:
          </Paragraph>
          <List>
            <ListItem>Películas y series que ha visto</ListItem>
            <ListItem>Búsquedas realizadas en nuestra plataforma</ListItem>
            <ListItem>Calificaciones y reseñas que proporciona</ListItem>
            <ListItem>Contenido guardado en Mi Lista o listas personalizadas</ListItem>
          </List>
          <Paragraph>
            <strong>Información de Uso:</strong> Recopilamos automáticamente información sobre cómo interactúa con
            nuestros Servicios, incluyendo:
          </Paragraph>
          <List>
            <ListItem>Información del dispositivo (tipo, sistema operativo, identificadores únicos)</ListItem>
            <ListItem>
              Información de registro (direcciones IP, fechas y horas de acceso, actividad en el sitio)
            </ListItem>
            <ListItem>Información de ubicación (si ha habilitado esta función)</ListItem>
            <ListItem>Calidad de streaming y problemas técnicos encontrados</ListItem>
            <ListItem>Preferencias de visualización y configuración de audio/subtítulos</ListItem>
          </List>
          <Paragraph>
            <strong>Cookies y Tecnologías Similares:</strong> Utilizamos cookies y tecnologías similares para recopilar
            información sobre su actividad, navegador y dispositivo. Para más información, consulte nuestra Política de
            Cookies.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>3. Cómo Utilizamos su Información</SectionTitle>
          <Paragraph>Utilizamos la información que recopilamos para:</Paragraph>
          <List>
            <ListItem>Proporcionar, mantener y mejorar nuestros servicios de streaming</ListItem>
            <ListItem>
              Personalizar su experiencia de visualización y recomendar contenido basado en sus preferencias
            </ListItem>
            <ListItem>
              Recordar dónde dejó de ver una película o serie para que pueda continuar desde ese punto
            </ListItem>
            <ListItem>Procesar sus suscripciones, pagos y gestionar su cuenta</ListItem>
            <ListItem>Enviar notificaciones sobre nuevo contenido, estrenos o funciones</ListItem>
            <ListItem>Responder a sus comentarios, preguntas y solicitudes de soporte técnico</ListItem>
            <ListItem>Analizar tendencias de visualización para mejorar nuestro catálogo y servicios</ListItem>
            <ListItem>Detectar, prevenir y abordar problemas técnicos y de seguridad</ListItem>
            <ListItem>Cumplir con obligaciones legales y proteger nuestros derechos</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>4. Recomendaciones Personalizadas</SectionTitle>
          <Paragraph>
            MovieFilm utiliza algoritmos de recomendación para sugerirle películas y series que podrían interesarle.
            Estas recomendaciones se basan en:
          </Paragraph>
          <List>
            <ListItem>Su historial de visualización</ListItem>
            <ListItem>Calificaciones y reseñas que ha proporcionado</ListItem>
            <ListItem>Contenido que ha guardado en su lista</ListItem>
            <ListItem>Géneros y categorías que ve con frecuencia</ListItem>
            <ListItem>Comportamientos de visualización de usuarios con gustos similares</ListItem>
          </List>
          <Paragraph>
            Puede ajustar sus preferencias de recomendación o desactivar esta función en la configuración de su cuenta.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>5. Compartir su Información</SectionTitle>
          <Paragraph>Podemos compartir su información en las siguientes circunstancias:</Paragraph>
          <List>
            <ListItem>
              <strong>Con Proveedores de Servicios:</strong> Compartimos información con proveedores de servicios que
              realizan servicios en nuestro nombre, como procesamiento de pagos, análisis de datos, entrega de correo
              electrónico, servicios de alojamiento y servicios de atención al cliente.
            </ListItem>
            <ListItem>
              <strong>Con Titulares de Derechos:</strong> Podemos compartir datos agregados y anónimos sobre
              visualización con los propietarios de los derechos del contenido disponible en nuestra plataforma.
            </ListItem>
            <ListItem>
              <strong>Para Cumplimiento Legal:</strong> Podemos divulgar información si creemos de buena fe que es
              necesario para cumplir con la ley, proteger nuestros derechos o la seguridad de nuestros usuarios.
            </ListItem>
            <ListItem>
              <strong>Con su Consentimiento:</strong> Podemos compartir información con terceros cuando usted nos da su
              consentimiento para hacerlo.
            </ListItem>
            <ListItem>
              <strong>Transferencias Comerciales:</strong> En caso de fusión, adquisición o venta de activos, su
              información puede ser transferida como parte de esa transacción.
            </ListItem>
          </List>
          <Paragraph>
            No vendemos su información personal a terceros ni compartimos su historial de visualización individual con
            anunciantes.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>6. Seguridad de Datos</SectionTitle>
          <Paragraph>
            Implementamos medidas de seguridad diseñadas para proteger su información personal contra acceso no
            autorizado, alteración, divulgación o destrucción. Estas medidas incluyen encriptación de datos, controles
            de acceso y monitoreo regular de nuestros sistemas.
          </Paragraph>
          <Paragraph>
            Sin embargo, ningún sistema es completamente seguro, y no podemos garantizar la seguridad absoluta de su
            información. Le recomendamos mantener seguras sus credenciales de acceso y notificarnos inmediatamente si
            sospecha de cualquier uso no autorizado de su cuenta.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>7. Sus Derechos y Opciones</SectionTitle>
          <Paragraph>
            Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal,
            incluyendo:
          </Paragraph>
          <List>
            <ListItem>
              Acceder a su historial de visualización y otra información personal que tenemos sobre usted
            </ListItem>
            <ListItem>Corregir información inexacta o incompleta en su perfil</ListItem>
            <ListItem>Eliminar su cuenta y datos personales</ListItem>
            <ListItem>Oponerse o restringir ciertos procesamientos de su información</ListItem>
            <ListItem>Solicitar la portabilidad de su información</ListItem>
            <ListItem>Retirar su consentimiento en cualquier momento</ListItem>
          </List>
          <Paragraph>
            Puede ejercer muchos de estos derechos directamente a través de la configuración de su cuenta. Para otras
            solicitudes, contáctenos a través de los métodos proporcionados en la sección Contáctenos.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. Retención de Datos</SectionTitle>
          <Paragraph>
            Conservamos su información personal durante el tiempo que mantenga una cuenta activa con nosotros y durante
            un período razonable después, para cumplir con nuestras obligaciones legales, resolver disputas y hacer
            cumplir nuestros acuerdos.
          </Paragraph>
          <Paragraph>
            Su historial de visualización se mantiene para mejorar sus recomendaciones y experiencia en la plataforma.
            Puede eliminar elementos específicos de su historial de visualización a través de la configuración de su
            cuenta.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>9. Transferencias Internacionales</SectionTitle>
          <Paragraph>
            MovieFilm opera globalmente, y su información puede ser transferida y procesada en países distintos a su
            país de residencia, donde nuestros servidores y proveedores de servicios están ubicados. Estos países pueden
            tener leyes de protección de datos diferentes a las de su país.
          </Paragraph>
          <Paragraph>
            Tomamos medidas para garantizar que su información reciba un nivel adecuado de protección en los países
            donde la procesamos.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>10. Cambios a esta Política</SectionTitle>
          <Paragraph>
            Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas o
            por otros motivos operativos, legales o regulatorios. La versión actualizada se indicará con una fecha de
            Última actualización revisada y la versión actualizada entrará en vigor tan pronto como sea accesible.
          </Paragraph>
          <Paragraph>
            Le notificaremos sobre cambios significativos a través de un aviso prominente en nuestros Servicios o por
            correo electrónico, según corresponda.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>11. Contáctenos</SectionTitle>
          <Paragraph>
            Si tiene preguntas o inquietudes sobre esta Política de Privacidad o nuestras prácticas de datos,
            contáctenos en:
          </Paragraph>
          <ContactInfo>
            <div>Email: moviefilm@gmail.com</div>
          </ContactInfo>
        </Section>
      </Content>
      <Footer />
    </Container>
  )
}

export default Privacidad

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
  color: #fff;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`
