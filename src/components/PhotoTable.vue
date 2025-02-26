<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { usePhotosStore } from '../stores/photos'

const store = usePhotosStore()
const tableContainer = ref<HTMLElement | null>(null)
const sortBy = ref('id')
const sortDirection = ref('asc')

const fetchData = () => {
  store.fetchPhotos()
}

const toggleSort = (column: string) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }
}

const sortedPhotos = computed(() => {
  return [...store.displayedPhotos].sort((a, b) => {
    const modifier = sortDirection.value === 'asc' ? 1 : -1
    const aValue = a[sortBy.value as keyof typeof a]
    const bValue = b[sortBy.value as keyof typeof b]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier
    } else {
      return ((aValue < bValue ? -1 : 1) * modifier)
    }
  })
})

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
        class="w-full p-2 border rounded"
      />
      <button
        @click="fetchData"
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Поиск
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th 
              @click="toggleSort('id')" 
              class="border p-2 text-left cursor-pointer hover:bg-gray-200"
            >
              Id {{ sortBy === 'id' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th 
              @click="toggleSort('albumId')" 
              class="border p-2 text-left cursor-pointer hover:bg-gray-200"
            >
              Альбом {{ sortBy === 'albumId' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th 
              @click="toggleSort('title')" 
              class="border p-2 text-left cursor-pointer hover:bg-gray-200"
            >
              Название {{ sortBy === 'title' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th class="border p-2 text-left">Фото</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="photo in sortedPhotos" :key="photo.id" class="hover:bg-gray-50">
            <td class="border p-2">{{ photo.id }}</td>
            <td class="border p-2">{{ photo.albumId }}</td>
            <td class="border p-2">{{ photo.title }}</td>
            <td class="border p-2">
              <img 
                :src="photo.thumbnailUrl" 
                :alt="photo.title"
                class="w-32 h-32 object-cover"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template> 