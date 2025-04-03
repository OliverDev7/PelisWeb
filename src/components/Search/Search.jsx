import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { FiSearch, FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(10px); }
`

const SearchIconButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5rem;
`

const ModalContent = styled.div`
  background: #1a1a1a;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  animation: ${({ isClosing }) => isClosing ? fadeOut : fadeIn} 0.3s forwards;
`

const SearchHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: #1a1a1a;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  position: relative;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  padding-right: 3rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

const SearchButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
    padding: 1rem;
  }
`

const MovieCard = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &:hover {
    transform: translateY(-5px) scale(1.03);
  }
`

const MoviePoster = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.75rem;
  
  @media (max-width: 768px) {
    height: 200px;
  }
  
  @media (max-width: 480px) {
    height: 180px;
  }
`

const MovieTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  color: white;
  text-align: center;
  font-weight: 500;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MovieYear = styled.p`
  margin: 0.25rem 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
`

const NoResults = styled.div`
  padding: 3rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
`

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const modalRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isModalOpen) {
      const fetchMovies = async () => {
        try {
          const moviesCollection = collection(db, 'movies')
          const moviesSnapshot = await getDocs(moviesCollection)
          const moviesData = moviesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setMovies(moviesData)
          setFilteredMovies(moviesData)
        } catch (error) {
          console.error('Error fetching movies:', error)
        }
      }
      
      fetchMovies()
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isModalOpen])

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) {
      setFilteredMovies(movies)
    } else {
      const filtered = movies.filter(movie => 
        movie.title.toLowerCase().includes(term) ||
        movie.cast?.some(actor => actor.toLowerCase().includes(term)) ||
        movie.director?.toLowerCase().includes(term)
      )
      setFilteredMovies(filtered)
    }
  }, [searchTerm, movies])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalOpen])

  const openModal = () => {
    setIsModalOpen(true)
    setIsClosing(false)
  }

  const closeModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsModalOpen(false)
      setSearchTerm('')
    }, 300)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleMovieClick = (movieId) => {
    navigate(`/detail/${movieId}`)
    closeModal()
  }

  return (
    <>
      <SearchIconButton onClick={openModal}>
        <FiSearch size={20} />
      </SearchIconButton>

      {isModalOpen && (
        <ModalBackdrop>
          <ModalContent ref={modalRef} isClosing={isClosing}>
            <SearchHeader>
              <SearchForm onSubmit={(e) => e.preventDefault()}>
                <SearchInput
                  type="text"
                  placeholder="Buscar películas, actores, directores..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  ref={inputRef}
                  autoFocus
                />
                <SearchButton type="submit">
                  <FiSearch size={18} />
                </SearchButton>
              </SearchForm>
              <CloseButton onClick={closeModal}>
                <FiX size={20} />
              </CloseButton>
            </SearchHeader>

            {filteredMovies.length > 0 ? (
              <MoviesGrid>
                {filteredMovies.map(movie => (
                  <MovieCard key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                    <MoviePoster 
                      src={movie.poster || 'https://via.placeholder.com/160x240?text=No+Poster'} 
                      alt={movie.title} 
                    />
                    <MovieTitle>{movie.title}</MovieTitle>
                    {movie.year && <MovieYear>{movie.year}</MovieYear>}
                  </MovieCard>
                ))}
              </MoviesGrid>
            ) : (
              <NoResults>
                {searchTerm ? 
                  `No se encontraron resultados para "${searchTerm}"` : 
                  'Cargando películas...'}
              </NoResults>
            )}
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  )
}

export default Search