<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePhotosStore } from '../stores/photos'

const store = usePhotosStore()
const tableContainer = ref<HTMLElement | null>(null)

const fetchData = async () => {
  console.log('Начало загрузки...')
  await store.fetchPhotos()
  console.log('Загружено фотографий:', store.displayedPhotos.length)
  if (store.displayedPhotos.length > 0) {
    console.log('Пример URL фото:', store.displayedPhotos[0].thumbnailUrl)
  }
}

// Обработчик ошибки загрузки изображения
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.log('Ошибка загрузки изображения:', img.src)
  // Заменяем на дефолтное изображение
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Q0EzQUYiPkVycm9yPC90ZXh0Pjwvc3ZnPg=='
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="max-w-[800px] mx-auto p-4">
    <div class="mb-4">
      <input
        type="text"
        v-model="store.filterAlbumIds"
        placeholder="Введите ID альбомов через пробел (например: 1 2 3)"
        class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <button
        @click="fetchData"
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Поиск
      </button>
    </div>

    <!-- Отладочная информация -->
    <div class="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
      Статус: {{ store.loading ? 'Загрузка...' : 'Готово' }} | 
      Фотографий: {{ store.displayedPhotos.length }}
    </div>

    <div
      ref="tableContainer"
      class="max-h-[600px] overflow-auto border rounded dark:border-gray-600"
    >
      <table class="w-full">
        <thead class="sticky top-0 bg-white dark:bg-gray-800">
          <tr>
            <th class="p-2 border-b dark:border-gray-600 text-left">Id</th>
            <th class="p-2 border-b dark:border-gray-600 text-left">Альбом</th>
            <th class="p-2 border-b dark:border-gray-600 text-left">Название</th>
            <th class="p-2 border-b dark:border-gray-600 text-left">Фото</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="!store.loading && store.displayedPhotos.length > 0">
            <tr v-for="photo in store.displayedPhotos" :key="photo.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="p-2 border-b dark:border-gray-600">{{ photo.id }}</td>
              <td class="p-2 border-b dark:border-gray-600">{{ photo.albumId }}</td>
              <td class="p-2 border-b dark:border-gray-600 truncate" :title="photo.title">
                {{ photo.title }}
              </td>
              <td class="p-2 border-b dark:border-gray-600">
                <div class="flex flex-col items-center">
                  <img 
                    :src="photo.thumbnailUrl" 
                    :alt="photo.title" 
                    class="w-20 h-20 object-cover rounded"
                    @error="handleImageError"
                    loading="lazy"
                  />
                  <div class="text-xs mt-1 text-gray-500">
                    {{ photo.thumbnailUrl }}
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <tr v-else-if="store.loading">
            <td colspan="4" class="text-center p-4">
              <div class="animate-pulse flex justify-center">
                Загрузка...
              </div>
            </td>
          </tr>
          <tr v-else>
            <td colspan="4" class="text-center p-4">
              Нет данных
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template> 