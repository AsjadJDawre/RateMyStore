import React, { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

function RatingModal({ store, userRating: initialUserRating, onClose, onSuccess, onError }) {
  const [rating, setRating] = useState(initialUserRating || null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [userRatingId, setUserRatingId] = useState(null)
  const { user, role } = useAuth()
  const navigate = useNavigate()

  // Prevent non-USER from rating
  useEffect(() => {
    if (role !== 'USER') {
      onClose()
      navigate('/app/stores')
    }
  }, [role, onClose, navigate])

  // Fetch existing rating details (including ID and comment) when modal opens
  useEffect(() => {
    if (initialUserRating && user) {
      setFetching(true)
      apiClient
        .get(`/api/ratings/store/${store.id}`)
        .then(({ data }) => {
          const myRating = Array.isArray(data)
            ? data.find((r) => (r.user?.id === user.id) || (r.userId === user.id))
            : null
          if (myRating) {
            setUserRatingId(myRating.id)
            setRating(myRating.rating)
            setComment(myRating.comment || '')
          }
        })
        .catch((err) => {
          console.error('Failed to fetch rating details:', err)
        })
        .finally(() => {
          setFetching(false)
        })
    } else if (!initialUserRating) {
      // Reset form when no existing rating
      setRating(null)
      setComment('')
      setUserRatingId(null)
    }
  }, [store.id, initialUserRating, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating || rating < 1 || rating > 5) {
      onError('Please select a rating between 1 and 5')
      return
    }

    setLoading(true)
    try {
      if (userRatingId) {
        // Update existing rating
        await apiClient.put(`/api/ratings/${userRatingId}`, { rating, comment: comment || null })
      } else {
        // Create new rating
        await apiClient.post(`/api/ratings/store/${store.id}`, { rating, comment: comment || null })
      }
      onSuccess()
    } catch (err) {
      console.error('Rating error:', err)
      const errorMsg = err?.response?.data?.error || 'Failed to save rating'
      onError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!userRatingId) return
    if (!confirm('Are you sure you want to delete your rating?')) return

    setLoading(true)
    try {
      await apiClient.delete(`/api/ratings/${userRatingId}`)
      onSuccess()
    } catch (err) {
      console.error('Delete rating error:', err)
      onError(err?.response?.data?.error || 'Failed to delete rating')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {userRatingId ? 'Modify Rating' : 'Rate Store'}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">Store</label>
            <div className="rounded border bg-slate-50 px-3 py-2 text-sm">
              <div className="font-semibold text-slate-900">{store.name}</div>
              <div className="text-xs text-slate-600">{store.address}</div>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Rating <span className="text-red-500">*</span>
            </label>
            <select
              value={rating || ''}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              required
              disabled={loading || fetching}
            >
              <option value="">Select rating (1-5)</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'star' : 'stars'}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">1 = Poor, 5 = Excellent</p>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">Comment (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="Share your experience..."
              rows={3}
              maxLength={400}
              disabled={loading || fetching}
            />
            <p className="mt-1 text-xs text-slate-500">{comment.length}/400 characters</p>
          </div>

          {fetching && (
            <div className="mb-4 text-center text-sm text-slate-500">Loading rating details...</div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading || fetching || !rating}
              className="flex-1 rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : userRatingId ? 'Update Rating' : 'Submit Rating'}
            </button>
            {userRatingId && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading || fetching}
                className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading || fetching}
              className="rounded border px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RatingModal

