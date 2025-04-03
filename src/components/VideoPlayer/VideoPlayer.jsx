"use client"

import { useState, useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

const VideoPlayer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const controlsTimeout = useRef(null)

  // Estados para el reproductor
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [showSettings, setShowSettings] = useState(false)
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false)
  const [audioTrack, setAudioTrack] = useState("original")
  const [isLocked, setIsLocked] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewPosition, setPreviewPosition] = useState(0)
  const [mouseActive, setMouseActive] = useState(true)
  const mouseTimeoutRef = useRef(null)
  // Añadir una variable para el idioma de subtítulos
  const [subtitleLanguage, setSubtitleLanguage] = useState("spanish")

  // Modificar el componente LockOverlay para que desaparezca después de 2 segundos
  // y reaparezca al mover el mouse

  // Añadir un nuevo estado para controlar la visibilidad del mensaje de bloqueo
  const [showLockMessage, setShowLockMessage] = useState(true)
  const lockMessageTimeoutRef = useRef(null)

  // Obtener datos del video desde location state o hacer una petición
  const movie = location.state?.movie || { title: "Video", videoUrl: "" }

  // Efecto para entrar en pantalla completa al cargar
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (containerRef.current && document.fullscreenEnabled) {
          await containerRef.current.requestFullscreen()
          setIsFullscreen(true)
        }
      } catch (error) {
        console.error("Error al entrar en pantalla completa:", error)
      }
    }

    // Pequeño retraso para asegurar que el componente esté montado
    const timer = setTimeout(() => {
      enterFullscreen()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Manejar eventos de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)

      // Si salimos de pantalla completa y no fue por el botón de volver, volvemos a la página anterior
      if (!document.fullscreenElement && !isExiting.current) {
        handleExit()
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Manejar teclas de acceso rápido
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          togglePlay()
          break
        case "f":
          toggleFullscreen()
          break
        case "m":
          toggleMute()
          break
        case "arrowleft":
          skipBackward()
          break
        case "arrowright":
          skipForward()
          break
        case "escape":
          if (isFullscreen) {
            handleExit()
          }
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.addEventListener("keydown", handleKeyDown)
    }
  }, [isPlaying, isFullscreen, isMuted])

  // Efecto para detectar movimiento del mouse
  useEffect(() => {
    const handleMouseMove = () => {
      if (isLocked) {
        setShowLockMessage(true)

        if (lockMessageTimeoutRef.current) {
          clearTimeout(lockMessageTimeoutRef.current)
        }

        lockMessageTimeoutRef.current = setTimeout(() => {
          setShowLockMessage(false)
        }, 2000)
      } else {
        setMouseActive(true)
        setShowControls(true)

        if (mouseTimeoutRef.current) {
          clearTimeout(mouseTimeoutRef.current)
        }

        mouseTimeoutRef.current = setTimeout(() => {
          if (isPlaying) {
            setMouseActive(false)
            setShowControls(false)
          }
        }, 2000)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }
      if (lockMessageTimeoutRef.current) {
        clearTimeout(lockMessageTimeoutRef.current)
      }
    }
  }, [isPlaying, isLocked])

  // Iniciar el temporizador para ocultar el mensaje de bloqueo cuando se activa el bloqueo
  useEffect(() => {
    if (isLocked) {
      setShowLockMessage(true)

      lockMessageTimeoutRef.current = setTimeout(() => {
        setShowLockMessage(false)
      }, 2000)

      return () => {
        if (lockMessageTimeoutRef.current) {
          clearTimeout(lockMessageTimeoutRef.current)
        }
      }
    }
  }, [isLocked])

  // Ocultar controles después de un tiempo
  useEffect(() => {
    if (showControls && isPlaying && !loading) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current)
      }
    }
  }, [showControls, isPlaying, loading])

  // Variable para controlar la salida
  const isExiting = useRef(false)

  // Función para salir del reproductor
  const handleExit = () => {
    if (isExiting.current) return
    isExiting.current = true

    // Pausar el video
    if (videoRef.current) {
      videoRef.current.pause()
    }

    // Salir de pantalla completa si estamos en ella
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error al salir de pantalla completa:", err)
      })
    }

    // Navegar hacia atrás
    setTimeout(() => {
      navigate(-1)
    }, 100)
  }

  // Función para alternar reproducción/pausa
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
      setShowControls(true)
      resetControlsTimer()
    }
  }

  // Función para alternar silencio
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
      setShowControls(true)
      resetControlsTimer()
    }
  }

  // Función para cambiar el volumen
  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
    setShowControls(true)
    resetControlsTimer()
  }

  // Función para avanzar 10 segundos
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10)
      setShowControls(true)
      resetControlsTimer()
    }
  }

  // Función para retroceder 10 segundos
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
      setShowControls(true)
      resetControlsTimer()
    }
  }

  // Función para cambiar la posición del video
  const handleSeek = (e) => {
    const seekTime = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
    }
    setShowControls(true)
    resetControlsTimer()
  }

  // Función para alternar pantalla completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current && document.fullscreenEnabled) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error("Error al entrar en pantalla completa:", err)
        })
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error("Error al salir de pantalla completa:", err)
        })
      }
    }
    setShowControls(true)
    resetControlsTimer()
  }

  // Función para cambiar la velocidad de reproducción
  const handlePlaybackRateChange = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
    setShowSettings(false)
    setShowControls(true)
    resetControlsTimer()
  }

  // Función para alternar subtítulos
  const toggleSubtitles = () => {
    setSubtitlesEnabled(!subtitlesEnabled)
    setShowControls(true)
    resetControlsTimer()
  }

  // Función para cambiar el idioma del audio
  const changeAudioTrack = (track) => {
    setAudioTrack(track)
    setShowSettings(false)
    setShowControls(true)
    resetControlsTimer()
  }

  // Función para bloquear/desbloquear la pantalla
  const toggleLock = () => {
    setIsLocked(!isLocked)
    setShowControls(!isLocked) // Mostrar controles al desbloquear, ocultarlos al bloquear
    resetControlsTimer()
  }

  // Función para manejar la previsualización en la barra de progreso
  const handleProgressHover = (e) => {
    if (!duration) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const position = (e.clientX - rect.left) / rect.width
    const previewTime = position * duration

    setPreviewPosition(position)
    setShowPreview(true)
  }

  const handleProgressLeave = () => {
    setShowPreview(false)
  }

  // Función para resetear el temporizador de controles
  const resetControlsTimer = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current)
    }

    if (isPlaying && !isLocked) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false)
      }, 2000)
    }
  }

  // Función para formatear el tiempo (HH:MM:SS)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00:00"

    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = Math.floor(timeInSeconds % 60)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Manejar eventos de tiempo y duración del video
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setLoading(false)
    }
  }

  const handleVideoError = (e) => {
    console.error("Error de video:", e)
    setError("No se pudo cargar el video")
    setLoading(false)
  }

  // Determinar la URL del video
  const videoUrl = movie.videoUrl || "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"

  return (
    <PlayerContainer
      ref={containerRef}
      onClick={() => {
        if (!loading) {
          setShowControls(!showControls)
          if (!showControls) {
            resetControlsTimer()
          }
        }
      }}
    >
      {/* Video */}
      <VideoElement
        ref={videoRef}
        src={videoUrl}
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleVideoError}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Overlay de carga */}
      {loading && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>Cargando video...</LoadingText>
        </LoadingOverlay>
      )}

      {/* Overlay de error */}
      {error && (
        <ErrorOverlay>
          <ErrorMessage>{error}</ErrorMessage>
          <BackButton onClick={handleExit}>Volver</BackButton>
        </ErrorOverlay>
      )}

      {/* Controles del reproductor */}
      {showControls && !loading && !error && (
        <ControlsOverlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Controles superiores */}
          <TopControls>
            <BackButton onClick={handleExit}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Volver</span>
            </BackButton>

            <VideoTitle>{movie.title || "Video"}</VideoTitle>

            <TopRightControls>
              <ControlButton onClick={toggleLock}>
                {isLocked ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.9965 16H16.0054"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.9955 16H12.0045"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.99451 16H8.00349"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9.5 16V17C9.5 19.5 8.5 22 5 22C1.5 22 0.5 19.5 0.5 17V16C0.5 13.5 1.5 11 5 11C8.5 11 9.5 13.5 9.5 16Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.5 11V10C17.5 7.5 16.5 5 13 5C9.5 5 8.5 7.5 8.5 10V11C8.5 13.5 9.5 16 13 16C16.5 16 17.5 13.5 17.5 11Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23.5 6V5C23.5 2.5 22.5 0 19 0C15.5 0 14.5 2.5 14.5 5V6C14.5 8.5 15.5 11 19 11C22.5 11 23.5 8.5 23.5 6Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <span>{isLocked ? "Desbloquear" : "Bloquear"}</span>
              </ControlButton>

              <ControlButton onClick={toggleSubtitles}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                    stroke={subtitlesEnabled ? "#E91E63" : "currentColor"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 17.0801H15.65"
                    stroke={subtitlesEnabled ? "#E91E63" : "currentColor"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.97 17.0801H6.5"
                    stroke={subtitlesEnabled ? "#E91E63" : "currentColor"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 13.3201H11.97"
                    stroke={subtitlesEnabled ? "#E91E63" : "currentColor"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.27 13.3201H6.5"
                    stroke={subtitlesEnabled ? "#E91E63" : "currentColor"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Subtítulos</span>
              </ControlButton>

              <SettingsButton
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSettings(!showSettings)
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SettingsButton>
            </TopRightControls>
          </TopControls>

          {/* Controles centrales */}
          <CenterControls>
            <ControlButton onClick={skipBackward}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.33 15.0001L9.13005 12.3201C8.66005 11.9401 8.66005 11.2601 9.13005 10.8801L12.33 8.20012"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.9201 15.0001L16.7201 12.3201C16.2501 11.9401 16.2501 11.2601 16.7201 10.8801L19.9201 8.20012"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 3V7H21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L17 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>10s</span>
            </ControlButton>

            <PlayPauseButton
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
            >
              {isPlaying ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z"
                    fill="currentColor"
                  />
                  <path
                    d="M21.0016 19.11V4.89C21.0016 3.54 20.4316 3 18.9916 3H15.3616C13.9316 3 13.3516 3.54 13.3516 4.89V19.11C13.3516 20.46 13.9216 21 15.3616 21H18.9916C20.4316 21 21.0016 20.46 21.0016 19.11Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 11.9999V8.43989C4 4.01989 7.13 2.2099 10.96 4.4199L14.05 6.1999L17.14 7.9799C20.97 10.1899 20.97 13.8099 17.14 16.0199L14.05 17.7999L10.96 19.5799C7.13 21.7899 4 19.9799 4 15.5599V11.9999Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </PlayPauseButton>

            <ControlButton onClick={skipForward}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.6699 15.0001L14.8699 12.3201C15.3399 11.9401 15.3399 11.2601 14.8699 10.8801L11.6699 8.20012"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.08008 15.0001L7.28008 12.3201C7.75008 11.9401 7.75008 11.2601 7.28008 10.8801L4.08008 8.20012"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 3V7H3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 2L7 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>10s</span>
            </ControlButton>
          </CenterControls>

          {/* Controles inferiores */}
          <BottomControls>
            <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>

            <ProgressBarContainer onMouseMove={handleProgressHover} onMouseLeave={handleProgressLeave}>
              <ProgressInput
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                step="0.1"
              />
              <ProgressBar style={{ width: `${(currentTime / duration) * 100}%` }} />

              {showPreview && (
                <PreviewTooltip style={{ left: `${previewPosition * 100}%` }}>
                  <PreviewTime>{formatTime(previewPosition * duration)}</PreviewTime>
                  <PreviewThumbnail>
                    <PreviewImage src={movie.poster || movie.banner} alt="Preview" />
                  </PreviewThumbnail>
                </PreviewTooltip>
              )}
            </ProgressBarContainer>

            <TimeDisplay>-{formatTime(duration - currentTime)}</TimeDisplay>

            <VolumeContainer onClick={(e) => e.stopPropagation()}>
              <VolumeButton onClick={toggleMute}>
                {isMuted || volume === 0 ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15 8.37V7.41C15 4.43 12.93 3.29 10.41 4.87L7.49 6.7C7.17 6.9 6.8 7 6.43 7H5C3 7 2 8 2 10V14C2 16 3 17 5 17H7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.41 19.13C12.93 20.71 15 19.56 15 16.59V12.95"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.81 9.42C19.71 11.57 19.44 14.08 18 16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.15 7.8C22.62 11.29 22.18 15.37 19.83 18.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L2 22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2 10V14C2 16 3 17 5 17H6.43C6.8 17 7.17 17.11 7.49 17.3L10.41 19.13C12.93 20.71 15 19.56 15 16.59V7.41C15 4.43 12.93 3.29 10.41 4.87L7.49 6.7C7.17 6.9 6.8 7 6.43 7H5C3 7 2 8 2 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M18 12C18 12.84 17.84 13.64 17.54 14.38"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2 10V14C2 16 3 17 5 17H6.43C6.8 17 7.17 17.11 7.49 17.3L10.41 19.13C12.93 20.71 15 19.56 15 16.59V7.41C15 4.43 12.93 3.29 10.41 4.87L7.49 6.7C7.17 6.9 6.8 7 6.43 7H5C3 7 2 8 2 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M18 8C19.4 10.1 19.5 14.1 18 16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.1 7C23.3 10.4 23.4 16.5 21.1 17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </VolumeButton>
              <VolumeSlider
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
              />
            </VolumeContainer>

            <FullscreenButton
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen()
              }}
            >
              {isFullscreen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 9V6.5C2 4.01 4.01 2 6.5 2H9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 2H17.5C19.99 2 22 4.01 22 6.5V9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 16V17.5C22 19.99 19.99 22 17.5 22H16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22H6.5C4.01 22 2 19.99 2 17.5V15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 10V6H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 14V18H10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </FullscreenButton>
          </BottomControls>
        </ControlsOverlay>
      )}

      {/* Menú de configuración */}
      {showSettings && (
        <SettingsMenu
          onClick={(e) => e.stopPropagation()}
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <SettingsSection>
            <SettingsTitle>Velocidad de reproducción</SettingsTitle>
            <SpeedOptions>
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                <SpeedOption key={rate} active={playbackRate === rate} onClick={() => handlePlaybackRateChange(rate)}>
                  {rate}x
                </SpeedOption>
              ))}
            </SpeedOptions>
          </SettingsSection>

          <SettingsSection>
            <SettingsTitle>Idioma de audio</SettingsTitle>
            <AudioOptions>
              <AudioOption active={audioTrack === "original"} onClick={() => changeAudioTrack("original")}>
                Original
              </AudioOption>
              <AudioOption active={audioTrack === "spanish"} onClick={() => changeAudioTrack("spanish")}>
                Español
              </AudioOption>
              <AudioOption active={audioTrack === "english"} onClick={() => changeAudioTrack("english")}>
                Inglés
              </AudioOption>
            </AudioOptions>
          </SettingsSection>

          <SettingsSection>
            <SettingsTitle>Subtítulos</SettingsTitle>
            <SubtitleOptions>
              <SubtitleOption active={!subtitlesEnabled} onClick={() => setSubtitlesEnabled(false)}>
                Desactivados
              </SubtitleOption>
              <SubtitleOption
                active={subtitlesEnabled && subtitleLanguage === "spanish"}
                onClick={() => {
                  setSubtitlesEnabled(true)
                  setSubtitleLanguage("spanish")
                }}
              >
                Español
              </SubtitleOption>
              <SubtitleOption
                active={subtitlesEnabled && subtitleLanguage === "english"}
                onClick={() => {
                  setSubtitlesEnabled(true)
                  setSubtitleLanguage("english")
                }}
              >
                Inglés
              </SubtitleOption>
            </SubtitleOptions>
          </SettingsSection>
        </SettingsMenu>
      )}

      {/* Añadir subtítulos si están habilitados */}
      {subtitlesEnabled && (
        <SubtitlesContainer>
          <SubtitlesText>
            {subtitleLanguage === "spanish"
              ? "Ejemplo de subtítulos en español para esta escena del video."
              : "Example of English subtitles for this scene in the video."}
          </SubtitlesText>
        </SubtitlesContainer>
      )}

      {/* Añadir mensaje de bloqueo si la pantalla está bloqueada */}
      {isLocked && showLockMessage && (
        <LockOverlay onClick={() => setIsLocked(false)}>
          <LockIcon>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.9965 16H16.0054"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9955 16H12.0045"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.99451 16H8.00349"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </LockIcon>
          <LockMessage>Pantalla bloqueada. Toca para desbloquear.</LockMessage>
        </LockOverlay>
      )}
    </PlayerContainer>
  )
}

// Animaciones
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

// Estilos
const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
`

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #E91E63;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`

const LoadingText = styled.div`
  color: white;
  font-size: 18px;
  font-weight: 500;
`

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
`

const ErrorMessage = styled.div`
  color: white;
  font-size: 18px;
  margin-bottom: 20px;
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(233, 30, 99, 0.8);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #E91E63;
  }
`

const ControlsOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 5;
  padding: 20px;
  box-sizing: border-box;
`

const TopControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const TopRightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const VideoTitle = styled.h2`
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`

const CenterControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
`

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: transform 0.2s;
  padding: 8px;

  &:hover {
    transform: scale(1.1);
  }
  
  svg {
    width: 32px;
    height: 32px;
  }
  
  @media (max-width: 768px) {
    gap: 5px;
    padding: 5px;
    
    svg {
      width: 24px;
      height: 24px;
    }
    
    span {
      font-size: 12px;
    }
  }
`

const PlayPauseButton = styled.button`
  background-color: rgba(233, 30, 99, 0.8);
  border: none;
  color: white;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  margin: 0 30px;

  &:hover {
    background-color: #E91E63;
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    margin: 0 20px;
    
    svg {
      width: 28px;
      height: 28px;
    }
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    margin: 0 15px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`

const BottomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
`

const TimeDisplay = styled.div`
  color: white;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  min-width: 70px;
`

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  
  &:hover {
    height: 10px;
  }
  
  @media (max-width: 768px) {
    height: 6px;
    
    &:hover {
      height: 8px;
    }
  }
`

const ProgressBar = styled.div`
  height: 100%;
  background-color: #E91E63;
  border-radius: 4px;
  position: absolute;
  top: 0;
  left: 0;
`

const ProgressInput = styled.input`
  position: absolute;
  top: -7.5px;
  left: 0;
  width: 100%;
  height: 20px;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
`

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 120px;
`

const VolumeButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #E91E63;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #E91E63;
    cursor: pointer;
    border: none;
  }
`

const FullscreenButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SettingsMenu = styled.div`
  position: absolute;
  bottom: 80px;
  right: 20px;
  background-color: rgba(28, 28, 28, 0.95);
  border-radius: 10px;
  padding: 20px;
  z-index: 20;
  min-width: 250px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    bottom: 70px;
    right: 15px;
    padding: 15px;
    min-width: 220px;
  }
  
  @media (max-width: 480px) {
    bottom: 60px;
    right: 10px;
    padding: 12px;
    min-width: 200px;
  }
`

const SettingsTitle = styled.h3`
  color: white;
  font-size: 16px;
  margin: 0 0 10px 0;
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin: 0 0 8px 0;
  }
`

const SpeedOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const SpeedOption = styled.button`
  background-color: ${(props) => (props.active ? "#E91E63" : "rgba(255, 255, 255, 0.1)")};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? "#E91E63" : "rgba(255, 255, 255, 0.2)")};
  }
`

const SettingsSection = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const AudioOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const AudioOption = styled.button`
  background-color: ${(props) => (props.active ? "#E91E63" : "rgba(255, 255, 255, 0.1)")};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? "#E91E63" : "rgba(255, 255, 255, 0.2)")};
  }
`

const SubtitleOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const SubtitleOption = styled.button`
  background-color: ${(props) => (props.active ? "#E91E63" : "rgba(255, 255, 255, 0.1)")};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? "#E91E63" : "rgba(255, 255, 255, 0.2)")};
  }
`

const PreviewTooltip = styled.div`
  position: absolute;
  bottom: 25px;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  pointer-events: none;
`

const PreviewTime = styled.div`
  color: white;
  font-size: 12px;
  margin-bottom: 5px;
`

const PreviewThumbnail = styled.div`
  width: 160px;
  height: 90px;
  border-radius: 4px;
  overflow: hidden;
`

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const SubtitlesContainer = styled.div`
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 4;
  pointer-events: none;
`

const SubtitlesText = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  max-width: 80%;
  text-align: center;
  font-size: 16px;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 14px;
    max-width: 90%;
    padding: 6px 12px;
  }
`

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 30;
  cursor: pointer;
`

const LockIcon = styled.div`
  margin-bottom: 20px;
`

const LockMessage = styled.div`
  color: white;
  font-size: 18px;
  font-weight: 500;
`

export default VideoPlayer

