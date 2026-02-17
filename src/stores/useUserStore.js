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

    localStorage.setItem('user', JSON.stringify({ ...userData }))
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
    readings.value = []

    localStorage.removeItem('user')
  }

  async function restoreFromLocalStorage() {
    const stored = localStorage.getItem('user')
    if (stored) {
      const userData = JSON.parse(stored)
      login(userData)
      await fetchReadings()
    }
  }

  async function fetchReadings() {
    if (!token.value) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/get-readings`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      )

      const result = await response.json()
      readings.value = result.readings || []
    } catch (err) {
      console.error("Error fetching readings:", err)
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
