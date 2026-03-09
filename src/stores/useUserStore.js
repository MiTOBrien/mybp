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

  // Readings
  const recentReadings = ref([])
  const allReadings = ref([])

  // -----------------------------
  // LOGIN
  // -----------------------------
  async function login(userData) {
    token.value = userData.token
    id.value = userData.id
    email.value = userData.email
    name.value = userData.name
    user.value = userData
    isLoggedIn.value = true
    showLoginModal.value = false
    showRegisterModal.value = false

    // Store ONLY auth + profile info
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: id.value,
        email: email.value,
        name: name.value,
        token: token.value,
      }),
    )
  }

  // -----------------------------
  // SET USER (used after refresh)
  // -----------------------------
  function setUser(userData) {
    const currentToken = token.value
    login({
      ...userData,
      token: userData.token || currentToken,
    })
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  function logout() {
    token.value = null
    id.value = null
    email.value = ''
    name.value = ''
    user.value = null
    isLoggedIn.value = false

    // Clear readings
    recentReadings.value = []
    allReadings.value = []

    // Clear localStorage
    localStorage.removeItem('user')
  }

  // -----------------------------
  // FETCH RECENT READINGS
  // -----------------------------
  async function fetchRecentReadings(days = 7) {
    try {
      const res = await fetch(`/.netlify/functions/get-readings?days=${days}`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      const data = await res.json()
      recentReadings.value = data.readings || []
    } catch (err) {
      console.error('Error fetching recent readings:', err)
      recentReadings.value = []
    }
  }

  // -----------------------------
  // FETCH ALL READINGS
  // -----------------------------
  async function fetchAllReadings() {
    try {
      const res = await fetch(`/.netlify/functions/get-readings?all=true`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      const data = await res.json()
      allReadings.value = data.readings || []
    } catch (err) {
      console.error('Error fetching all readings:', err)
      allReadings.value = []
    }
  }

  // -----------------------------
  // RESTORE FROM LOCAL STORAGE
  // -----------------------------
  function restoreFromLocalStorage() {
    const stored = localStorage.getItem('user')
    if (!stored) return

    const userData = JSON.parse(stored)

    // Restore ONLY auth + profile fields
    token.value = userData.token
    id.value = userData.id
    email.value = userData.email
    name.value = userData.name
    user.value = userData
    isLoggedIn.value = true

    // Fetch fresh readings from backend
    fetchRecentReadings(7)
    fetchAllReadings()
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
    recentReadings,
    allReadings,

    // Actions
    login,
    setUser,
    logout,
    restoreFromLocalStorage,
    fetchRecentReadings,
    fetchAllReadings,
  }
})
