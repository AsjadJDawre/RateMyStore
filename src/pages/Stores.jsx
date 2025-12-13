import React, { useEffect, useState, useRef, useCallback } from 'react'
import { apiClient } from '../lib/apiClient'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import RatingModal from '../components/RatingModal.jsx'

function Stores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedStore, setSelectedStore] = useState(null)
  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [nameInput, setNameInput] = useState(searchParams.get('name') || '')
  const [addressInput, setAddressInput] = useState(searchParams.get('address') || '')
  const { user, role } = useAuth()
  const { show } = useToast()
  const nameSearchTimeoutRef = useRef(null)
  const addressSearchTimeoutRef = useRef(null)

  const fetchStores = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = Object.fromEntries(searchParams.entries())
      const { data } = await apiClient.get('/api/stores', { params })
      setStores(data || [])
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.error || 'Failed to load stores')
      show(err?.response?.data?.error || 'Failed to load stores', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [searchParams])

  const handleNameSearch = (e) => {
    const value = e.target.value
    setNameInput(value) // Update input immediately for responsive UI
    
    // Clear existing timeout
    if (nameSearchTimeoutRef.current) {
      clearTimeout(nameSearchTimeoutRef.current)
    }
    
    // Debounce: wait 500ms after user stops typing
    nameSearchTimeoutRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      const trimmed = value.trim()
      if (trimmed) {
        next.set('name', trimmed)
      } else {
        next.delete('name')
      }
      setSearchParams(next)
    }, 500)
  }

  const handleAddressSearch = (e) => {
    const value = e.target.value
    setAddressInput(value) // Update input immediately for responsive UI
    
    // Clear existing timeout
    if (addressSearchTimeoutRef.current) {
      clearTimeout(addressSearchTimeoutRef.current)
    }
    
    // Debounce: wait 500ms after user stops typing
    addressSearchTimeoutRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      const trimmed = value.trim()
      if (trimmed) {
        next.set('address', trimmed)
      } else {
        next.delete('address')
      }
      setSearchParams(next)
    }, 500)
  }

  // Sync inputs when searchParams change externally (e.g., clear filters)
  useEffect(() => {
    setNameInput(searchParams.get('name') || '')
    setAddressInput(searchParams.get('address') || '')
  }, [searchParams])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (nameSearchTimeoutRef.current) clearTimeout(nameSearchTimeoutRef.current)
      if (addressSearchTimeoutRef.current) clearTimeout(addressSearchTimeoutRef.current)
    }
  }, [])

  const handleSort = (e) => {
    const value = e.target.value
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set('sortBy', value)
      next.set('sortOrder', 'desc')
    } else {
      next.delete('sortBy')
      next.delete('sortOrder')
    }
    setSearchParams(next)
  }

  const handleRateClick = (store) => {
    setSelectedStore(store)
    setRatingModalOpen(true)
  }

  const handleRatingSuccess = () => {
    setRatingModalOpen(false)
    setSelectedStore(null)
    fetchStores()
    show('Rating saved successfully!', 'success')
  }

  const handleRatingError = (message) => {
    show(message || 'Failed to save rating', 'error')
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <img
            src="/RateMyStore-logo.png"
            alt="RateMyStore Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-cover shadow-sm"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Stores</h1>
          <p className="text-sm text-slate-600 mt-1">Browse and rate stores</p>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-700">
            <img
              src="/SearchStore-icon.png"
              alt="Search icon"
              className="h-4 w-4 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            Search by Name
          </label>
          <input
            type="text"
            className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
            placeholder="Store name..."
            value={nameInput}
            onChange={handleNameSearch}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-700">
            <img
              src="/SearchStore-icon.png"
              alt="Search icon"
              className="h-4 w-4 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            Search by Address
          </label>
          <input
            type="text"
            className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
            placeholder="Address..."
            value={addressInput}
            onChange={handleAddressSearch}
          />
        </div>
        <div className="min-w-[180px]">
          <label className="mb-1 block text-xs font-medium text-slate-700">Sort By</label>
          <select
            className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
            value={searchParams.get('sortBy') || 'rating'}
            onChange={handleSort}
          >
            <option value="rating">Rating (High to Low)</option>
            <option value="name">Name (A-Z)</option>
            <option value="address">Address</option>
            <option value="createdAt">Newest First</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <img
              src="/RateMyStore-logo.png"
              alt="Loading"
              className="h-12 w-12 animate-pulse rounded-lg object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <p className="text-sm text-slate-600">Loading stores...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !stores.length && !error && (
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center">
              <img
                src="/NoRatings-icon.png"
                alt="No stores found"
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain opacity-50"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">No stores found</p>
              <p className="text-xs text-slate-500">Try adjusting your search filters</p>
            </div>
          </div>
        </div>
      )}

      {/* Stores Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div key={store.id} className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="/TotalStore-icon.png"
                    alt="Store"
                    className="h-5 w-5 object-contain opacity-60"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <h2 className="text-lg font-semibold text-slate-900">{store.name}</h2>
                </div>
                <p className="mt-1 text-sm text-slate-600">{store.address}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end mb-1">
                  <img
                    src="/FiveStarRating-icon.png"
                    alt="Rating"
                    className="h-5 w-5 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <div className="text-2xl font-bold text-indigo-600">
                    {store.averageRating ? store.averageRating.toFixed(1) : '—'}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {store.ratingCount || 0} {store.ratingCount === 1 ? 'rating' : 'ratings'}
                </div>
              </div>
            </div>

            {role === 'USER' && (
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <div className="text-sm text-slate-700">
                  <span className="font-medium">Your rating:</span>{' '}
                  <span className={store.userRating ? 'font-semibold text-indigo-600' : 'text-slate-500'}>
                    {store.userRating ? `${store.userRating}/5` : 'Not rated'}
                  </span>
                </div>
                <button
                  onClick={() => handleRateClick(store)}
                  className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                >
                  {store.userRating ? 'Modify Rating' : 'Rate Store'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rating Modal */}
      {ratingModalOpen && selectedStore && (
        <RatingModal
          store={selectedStore}
          userRating={selectedStore.userRating}
          onClose={() => {
            setRatingModalOpen(false)
            setSelectedStore(null)
          }}
          onSuccess={handleRatingSuccess}
          onError={handleRatingError}
        />
      )}
    </section>
  )
}

export default Stores
