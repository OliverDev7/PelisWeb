"use client"
import styled from "styled-components"
import { FiDownload, FiSmartphone, FiMonitor } from "react-icons/fi"

const Downloads = () => {
  // URLs para las tiendas de aplicaciones y descarga de APK
  const androidPlayStoreUrl = "https://play.google.com/store/apps/details?id=com.moviefilm.app"
  const iosAppStoreUrl = "https://apps.apple.com/app/moviefilm/id1234567890"
  const apkDownloadUrl = "/downloads/moviefilm.apk" // Ruta relativa al archivo APK
  const androidTvUrl = "https://play.google.com/store/apps/details?id=com.moviefilm.tv"

  // Funciones para manejar los clics en los botones
  const handleAndroidClick = () => {
    window.open(androidPlayStoreUrl, "_blank")
  }

  const handleIOSClick = () => {
    window.open(iosAppStoreUrl, "_blank")
  }

  const handleApkDownload = () => {
    // Crear un elemento <a> temporal para descargar el archivo
    const link = document.createElement("a")
    link.href = apkDownloadUrl
    link.download = "moviefilm.apk"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAndroidTvClick = () => {
    window.open(androidTvUrl, "_blank")
  }

  return (
    <DownloadsContainer>
      <DownloadButton platform="android" onClick={handleAndroidClick}>
        <FiSmartphone size={16} />
        <span>Android</span>
      </DownloadButton>

      <DownloadButton platform="ios" onClick={handleIOSClick}>
        <FiSmartphone size={16} />
        <span>iOS</span>
      </DownloadButton>

      <DownloadButton platform="apk" onClick={handleApkDownload}>
        <FiDownload size={16} />
        <span>APK</span>
      </DownloadButton>

      <DownloadButton platform="tv" onClick={handleAndroidTvClick}>
        <FiMonitor size={16} />
        <span>Android TV</span>
      </DownloadButton>
    </DownloadsContainer>
  )
}

export default Downloads

// Estilos
const DownloadsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  ${(props) => {
    switch (props.platform) {
      case "android":
        return `
          background: linear-gradient(135deg, #3DDC84 0%, #2BB573 100%);
          border-color: #3DDC84;
        `
      case "ios":
        return `
          background: linear-gradient(135deg, #007AFF 0%, #0056B3 100%);
          border-color: #007AFF;
        `
      case "apk":
        return `
          background: linear-gradient(135deg, #E91E63 0%, #9C27B0 100%);
          border-color: #E91E63;
        `
      case "tv":
        return `
          background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%);
          border-color: #FF5722;
        `
      default:
        return ""
    }
  }}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 480px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
`

