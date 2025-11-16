import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ConfessionCard from '../components/ConfessionCard'
import '../styles/ConfessionFeed.css'

export default function ConfessionFeed() {
  const [confessions, setConfessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [filterCategory, setFilterCategory] = useState('All')

  const categories = ['All', 'General', 'Love', 'Work', 'Family', 'Friends', 'Personal', 'Other']

  useEffect(() => {
    fetchConfessions()
  }, [])

  const fetchConfessions = async () => {
    setLoading(true)
    try {
      let query = supabase.from('confessions').select('*')

      const { data, error } = await query

      if (error) throw error

      let sortedData = data || []

      if (sortBy === 'newest') {
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      } else if (sortBy === 'oldest') {
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      } else if (sortBy === 'mostLiked') {
        sortedData.sort((a, b) => b.likes_count - a.likes_count)
      }

      if (filterCategory !== 'All') {
        sortedData = sortedData.filter(c => c.category === filterCategory)
      }

      setConfessions(sortedData)
    } catch (error) {
      console.error('Error fetching confessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id, currentLikes) => {
    try {
      const { error } = await supabase
        .from('confessions')
        .update({ likes_count: currentLikes + 1 })
        .eq('id', id)

      if (error) throw error

      setConfessions(confessions.map(c =>
        c.id === id ? { ...c, likes_count: c.likes_count + 1 } : c
      ))
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  useEffect(() => {
    let timeoutId = setTimeout(() => {
      let filtered = confessions

      if (filterCategory !== 'All') {
        filtered = filtered.filter(c => c.category === filterCategory)
      }

      if (sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      } else if (sortBy === 'oldest') {
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      } else if (sortBy === 'mostLiked') {
        filtered.sort((a, b) => b.likes_count - a.likes_count)
      }

      if (JSON.stringify(filtered) !== JSON.stringify(confessions)) {
        setConfessions(filtered)
      }
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [sortBy, filterCategory])

  return (
    <div className="confession-feed-container">
      <div className="feed-controls">
        <div className="control-group">
          <label htmlFor="sort">Sort By:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="control-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostLiked">Most Liked</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="category">Filter by Category:</label>
          <select
            id="category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="control-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading confessions...</div>
      ) : confessions.length === 0 ? (
        <div className="empty-state">
          <p>No confessions yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="confessions-grid">
          {confessions.map(confession => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              onLike={handleLike}
            />
          ))}
        </div>
      )}
    </div>
  )
}
