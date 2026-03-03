import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    // If navigating back (browser back button), restore scroll
    if (savedPosition) {
      return savedPosition
    }

    // If navigating to home, scroll to top
    if (to.path === '/') {
      return { top: 0 }
    }

    // Default scroll for all other routes
    return { top: 0 }
  },

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tos',
      name: 'TermsOfService',
      component: () => import('@/views/TermsOfServiceView.vue'),
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicy',
      component: () => import('@/views/PrivacyPolicyView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/ResetPasswordView.vue'),
    },
    {
      path: '/hbp-management',
      name: 'HbpManagement',
      component: () => import('@/views/HbpManagementView.vue'),
    },
    {
      path: '/hbp-causes',
      name: 'HbpCauses',
      component: () => import('@/views/HbpCausesView.vue'),
    },
    {
      path: '/insights',
      name: 'Insights',
      component: () => import('@/views/InsightsView.vue'),
    },
  ],
})

export default router
