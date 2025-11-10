import axios from 'axios'

// Ensure baseURL always ends with /api
const getBaseURL = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
  // If URL doesn't end with /api, add it
  if (!url.endsWith('/api')) {
    return url.endsWith('/') ? `${url}api` : `${url}/api`
  }
  return url
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // En mode dev, si mock user existe, simuler les réponses
    const mockUser = localStorage.getItem('mock_user')
    if (mockUser && process.env.NODE_ENV === 'development') {
      // Les requêtes passeront normalement, mais on peut intercepter certaines réponses
    }
  }
  return config
})

// Mock responses en développement
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Si erreur 401 et qu'on a un mock user, simuler une réponse réussie pour certaines routes
      const mockUser = localStorage.getItem('mock_user')
      if (error.response?.status === 401 && mockUser) {
        const url = error.config?.url || ''
        
        // Mock certaines routes
        if (url.includes('/wallet/balance')) {
          const user = JSON.parse(mockUser)
          return Promise.resolve({
            data: {
              balanceCoins: user.balanceCoins || 10000,
              balanceEur: (user.balanceCoins || 10000) / 1000,
            },
            status: 200,
          })
        }
        
        if (url.includes('/wallet/transactions')) {
          return Promise.resolve({
            data: [],
            status: 200,
          })
        }
        
        if (url.includes('/users/profile')) {
          return Promise.resolve({
            data: JSON.parse(mockUser),
            status: 200,
          })
        }
        
        if (url.includes('/offers')) {
          // Try to get real offers first
          return Promise.resolve({
            data: [],
            status: 200,
          })
        }
        
        if (url.includes('/offerwalls/sync')) {
          return Promise.resolve({
            data: {
              cpx: { synced: 0, errors: 0 },
              adgate: { synced: 0, errors: 0 },
              ayet: { synced: 0, errors: 0 },
              lootably: { synced: 0, errors: 0 },
            },
            status: 200,
          })
        }
        
        if (url.includes('/offerwalls/CPX/url') || url.includes('/offerwalls/cpx/url')) {
          // Mock CPX offerwall URL
          const user = JSON.parse(mockUser)
          const params = new URLSearchParams({
            app_id: process.env.NEXT_PUBLIC_CPX_APP_ID || '29900',
            ext_user_id: user.id || 'dev-user-123',
          })
          if (user.name) params.append('username', user.name)
          if (user.email) params.append('email', user.email)
          
          return Promise.resolve({
            data: {
              url: `https://offers.cpx-research.com/index.php?${params.toString()}`,
            },
            status: 200,
          })
        }
        
        if (url.includes('/games/cases')) {
          return Promise.resolve({
            data: [
              {
                id: '1',
                name: 'Bronze Case',
                description: 'Basic rewards case',
                costCoins: 1000,
              },
            ],
            status: 200,
          })
        }
      }
      
      return Promise.reject(error)
    }
  )
}

export default api


