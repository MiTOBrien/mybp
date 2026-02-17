import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const id = ref(null)
  const email = ref('')
  const name = ref('')
  const isLoggedIn = ref(false)
  const showLoginModal = ref(false)
  const showRegisterModal = ref(false)

  // NEW: readings state
  const readings = ref([])

  // Actions
  async function login(userData) {
    token.value = userData.token
    user.value = userData
    id.value = userData.id
    email.value = userData.email
    name.value = userData.name
    isLoggedIn.value = true
    showLoginModal.value = false
    showRegisterModal.value = false

    localStorage.setItem(
      'user',
      JSON.stringify({
        ...userData,
      }),
    )
  }

  function setUser(userData) {
    const currentToken = token.value
    login({
      ...userData,
      token: userData.token || currentToken,
    })
  }

  function logout() {
    token.value = null
    id.value = null
    email.value = ''
    name.value = ''
    isLoggedIn.value = false
    readings.value = [] // clear readings on logout

    localStorage.removeItem('user')
  }

  // NEW: fetchReadings action
  async function fetchReadings() {
    try {
      const res = await fetch('/.netlify/functions/get-readings', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (!res.ok) {
        throw new Error('Failed to fetch readings')
      }

      const data = await res.json()
      readings.value = data.readings || []
    } catch (err) {
      console.error('Error fetching readings:', err)
      readings.value = []
    }
  }

  function restoreFromLocalStorage() {
    const stored = localStorage.getItem('user')
    if (stored) {
      const userData = JSON.parse(stored)
      login(userData)

      // FIX: fetchShows() was wrong — should be fetchReadings()
      fetchReadings()
    }
  }

  return {
    // State
    user,
    token,
    id,
    email,
    name,
    isLoggedIn,
    showLoginModal,
    showRegisterModal,
    readings,

    // Actions
    login,
    setUser,
    logout,
    restoreFromLocalStorage,
    fetchReadings,
  }
})
