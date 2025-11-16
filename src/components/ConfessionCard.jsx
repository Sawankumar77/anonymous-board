import '../styles/ConfessionCard.css'

export default function ConfessionCard({ confession, onLike }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="confession-card">
      <div className="card-header">
        <span className="category-badge">{confession.category}</span>
        <span className="timestamp">{formatDate(confession.created_at)}</span>
      </div>

      <p className="confession-text">{confession.text}</p>

      <div className="card-footer">
        <button
          className="like-button"
          onClick={() => onLike(confession.id, confession.likes_count)}
        >
          <span className="heart">♥</span>
          <span className="like-count">{confession.likes_count}</span>
        </button>
      </div>
    </div>
  )
}
