import { useState } from 'react'
import './App.css'

interface WeatherData {
  name: string
  main: {
    temp: number
    humidity: number
  }
  weather: {
    description: string
    icon: string
  }[]
}

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_KEY = 'TU_API_KEY_AQUI' // ← Aquí pones tu API key de OpenWeatherMap

  const getWeather = async () => {
    if (!city.trim()) return

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      )
      const data = await response.json()

      if (data.cod === '404') {
        setError('Ciudad no encontrada')
      } else {
        setWeather(data)
      }
    } catch (err) {
      setError('Error al obtener el clima')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Escribe una ciudad..."
          onKeyDown={(e) => e.key === 'Enter' && getWeather()}
        />
        <button onClick={getWeather}>Buscar</button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p className="temp">{Math.round(weather.main.temp)}°C</p>
          <p className="description">{weather.weather[0].description}</p>
          <p>Humedad: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  )
}

export default App