import { useState } from 'react'
import SubmitConfession from './pages/SubmitConfession'
import ConfessionFeed from './pages/ConfessionFeed'
import './styles/App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('feed')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleConfessionSubmitted = () => {
    setRefreshTrigger(prev => prev + 1)
    setCurrentPage('feed')
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>Anonymous Confession Board</h1>
          <p className="subtitle">Share your secrets anonymously</p>
        </div>
        <div className="header-footer">
          <p className="author">Created by Sawan Kumar</p>
        </div>
      </header>

      <nav className="navigation">
        <button
          className={`nav-button ${currentPage === 'feed' ? 'active' : ''}`}
          onClick={() => setCurrentPage('feed')}
        >
          View Confessions
        </button>
        <button
          className={`nav-button ${currentPage === 'submit' ? 'active' : ''}`}
          onClick={() => setCurrentPage('submit')}
        >
          Submit Confession
        </button>
      </nav>

      <main className="main-content">
        {currentPage === 'feed' ? (
          <ConfessionFeed key={refreshTrigger} />
        ) : (
          <SubmitConfession onSubmitted={handleConfessionSubmitted} />
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2025 Anonymous Confession Board. All confessions remain anonymous.</p>
      </footer>
    </div>
  )
}
