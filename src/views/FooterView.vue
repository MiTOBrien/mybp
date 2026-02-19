<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="disclaimer">
        Track My BP is for informational purposes only and does not provide medical advice. Always
        consult a healthcare professional regarding any health concerns.
      </p>

      <div class="legal-links">
        <RouterLink to="/tos">Terms of Service</RouterLink>
        <span class="divider">•</span>
        <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
      </div>

      <p class="copyright">© {{ new Date().getFullYear() }} Track My BP. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-top: 3rem;
  border-top: 1px solid var(--color-border);
}

.disclaimer {
  max-width: 600px;
  margin: 0 auto 1rem auto;
  line-height: 1.5;
  font-size: 0.85rem;
  opacity: 0.9;
}

.legal-links {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.legal-links a {
  color: var(--color-text-secondary);
  text-decoration: none;
}

.legal-links a:hover {
  text-decoration: underline;
}

.divider {
  margin: 0 0.5rem;
  opacity: 0.6;
}

.copyright {
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
