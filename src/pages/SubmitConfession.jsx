import { useState } from 'react'
import { supabase } from '../supabaseClient'
import '../styles/SubmitConfession.css'

export default function SubmitConfession({ onSubmitted }) {
  const [confession, setConfession] = useState('')
  const [category, setCategory] = useState('General')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const categories = ['General', 'Love', 'Work', 'Family', 'Friends', 'Personal', 'Other']

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!confession.trim()) {
      setMessageType('error')
      setMessage('Please write something to confess!')
      return
    }

    if (confession.trim().length < 10) {
      setMessageType('error')
      setMessage('Confession must be at least 10 characters long.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('confessions')
        .insert([
          {
            text: confession.trim(),
            category: category,
          }
        ])

      if (error) throw error

      setMessageType('success')
      setMessage('Your confession has been posted anonymously!')
      setConfession('')
      setCategory('General')

      setTimeout(() => {
        setMessage('')
        onSubmitted()
      }, 2000)
    } catch (error) {
      setMessageType('error')
      setMessage('Error submitting confession. Please try again.')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="submit-confession-container">
      <div className="submit-form-wrapper">
        <h2>Share Your Anonymous Confession</h2>
        <p className="form-description">Your identity will remain completely anonymous</p>

        <form onSubmit={handleSubmit} className="confession-form">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="confession">Your Confession</label>
            <textarea
              id="confession"
              value={confession}
              onChange={(e) => setConfession(e.target.value)}
              placeholder="Write what's on your mind..."
              className="confession-textarea"
              rows="8"
            />
            <p className="char-count">{confession.length} characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Submitting...' : 'Post Confession Anonymously'}
          </button>
        </form>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
