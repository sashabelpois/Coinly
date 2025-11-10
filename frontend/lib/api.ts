import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
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
          return Promise.resolve({
            data: [
              {
                id: '1',
                title: 'Sondage Test',
                description: 'Sondage de développement',
                type: 'survey',
                rewardCoins: 500,
                provider: 'Test',
              },
            ],
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


