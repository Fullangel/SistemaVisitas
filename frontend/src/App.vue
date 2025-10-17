<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@vueuse/head'

// Configuración SEO básica
useHead({
  title: 'Sistema Nacional de Visitas',
  meta: [
    {
      name: 'description',
      content: 'Sistema integral de gestión de visitas a nivel nacional',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})

onMounted(() => {
  console.log('Sistema Nacional de Visitas - Iniciado')
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>