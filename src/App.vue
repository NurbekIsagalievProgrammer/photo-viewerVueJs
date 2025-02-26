<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PhotoTable from './components/PhotoTable.vue'

const isDark = ref(false)

onMounted(() => {
  // Проверяем сохраненную тему
  const savedTheme = localStorage.getItem('theme')
  
  // Проверяем системные предпочтения
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  // Устанавливаем тему
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  
  // Применяем тему сразу при загрузке
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900">
    <nav class="p-4 transition-colors duration-300 bg-gray-100 dark:bg-gray-800">
      <button 
        @click="toggleTheme"
        class="px-4 py-2 transition-all duration-300 bg-gray-200 dark:bg-gray-700 
               text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 
               dark:hover:bg-gray-600 focus:outline-none focus:ring-2 
               focus:ring-offset-2 focus:ring-gray-500"
      >
        <span class="flex items-center">
          <span class="mr-2 text-xl">{{ isDark ? '🌞' : '🌙' }}</span>
          {{ isDark ? 'Светлая тема' : 'Темная тема' }}
        </span>
      </button>
    </nav>
    <main class="p-4">
      <PhotoTable />
    </main>
  </div>
</template>

<style>
/* Убедимся, что темная тема применяется ко всему приложению */
:root {
  --bg-light: #ffffff;
  --bg-dark: #1a1a1a;
}

/* Добавим плавные переходы для всех элементов */
* {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
