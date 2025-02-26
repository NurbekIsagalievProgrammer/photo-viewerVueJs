<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePhotosStore } from '../stores/photos'

const store = usePhotosStore()
const tableContainer = ref<HTMLDivElement | null>(null)

const columns = [
  { key: 'id', label: 'Ид', width: '80px', sortable: true },
  { key: 'albumId', label: 'Альбом', width: '100px', sortable: true },
  { key: 'title', label: 'Название', width: '350px', sortable: true },
  { key: 'url', label: 'Ссылка', width: '350px', sortable: false },
  { key: 'thumbnailUrl', label: 'Миниатюра', width: '200px', sortable: false }
] as const

const handleScroll = (event: Event) => {
  const target = event.target as HTMLDivElement
  const { scrollTop, scrollHeight, clientHeight } = target
  
  // Проверяем, достигли ли мы конца прокрутки
  if (scrollHeight - scrollTop <= clientHeight + 50) { // 50px запас
    if (!store.loading && store.hasMoreItems) {
      store.loadMore()
    }
  }
}

const handleSort = (key: keyof typeof store.photos[0]) => {
  if (columns.find(col => col.key === key)?.sortable) {
    store.setSorting(key)
  }
}

onMounted(() => {
  store.fetchPhotos()
})
</script>

<template>
  <div class="max-w-[1200px] mx-auto p-4">
    <!-- Фильтр альбомов -->
    <div class="mb-4">
      <input
        v-model="store.filterAlbumIds"
        type="text"
        placeholder="Введите ID альбомов через пробел (например: 1 2 3)"
        class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        @keyup.enter="store.fetchPhotos()"
      />
      <button
        @click="store.fetchPhotos()"
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Поиск
      </button>
    </div>

    <!-- Таблица с фотографиями -->
    <div class="border rounded dark:border-gray-700">
      <div class="overflow-x-auto">
        <div 
          ref="tableContainer"
          @scroll="handleScroll"
          class="max-h-[600px] overflow-y-auto table-container"
        >
          <table class="w-full border-collapse">
            <thead class="sticky top-0 bg-white dark:bg-gray-800">
              <tr>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  class="p-3 text-left border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  :style="{ width: col.width }"
                  :class="{ 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700': col.sortable }"
                  @click="col.sortable && handleSort(col.key)"
                >
                  <div class="flex items-center gap-1">
                    {{ col.label }}
                    <span v-if="col.sortable" class="text-gray-400">
                      <template v-if="store.sortKey === col.key">
                        {{ store.sortDirection === 'asc' ? '↑' : '↓' }}
                      </template>
                      <template v-else>↕</template>
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-if="store.loading && !store.displayedPhotos.length">
                <!-- Скелетон для первой загрузки -->
              </template>
              <template v-else>
                <tr
                  v-for="photo in store.displayedPhotos"
                  :key="photo.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td
                    v-for="col in columns"
                    :key="col.key"
                    class="p-3 border-b dark:border-gray-700"
                  >
                    <div
                      v-if="col.key === 'thumbnailUrl'"
                      class="w-20 h-20 overflow-hidden rounded"
                    >
                      <img
                        :src="photo[col.key]"
                        :alt="photo.title"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div
                      v-else-if="col.key === 'url'"
                      class="truncate"
                      :title="photo[col.key]"
                    >
                      <a 
                        :href="photo[col.key]" 
                        target="_blank" 
                        class="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                      >
                        {{ photo[col.key] }}
                      </a>
                    </div>
                    <div
                      v-else
                      class="truncate"
                      :title="String(photo[col.key])"
                    >
                      {{ photo[col.key] }}
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          
          <!-- Индикатор загрузки при подгрузке данных -->
          <div 
            v-if="store.loading && store.displayedPhotos.length > 0"
            class="p-4 text-center"
          >
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: transparent;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

/* Добавляем горизонтальный скролл при необходимости */
.overflow-x-auto {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style> 