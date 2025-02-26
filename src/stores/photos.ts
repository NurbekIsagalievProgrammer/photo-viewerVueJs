import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Photo {
  id: number
  albumId: number
  title: string
  url: string
  thumbnailUrl: string
}

export const usePhotosStore = defineStore('photos', () => {
  const photos = ref<Photo[]>([])
  const displayedPhotos = ref<Photo[]>([])
  const loading = ref(false)
  const filterAlbumIds = ref('')

  const fetchPhotos = () => {
    const albumIds = filterAlbumIds.value.trim().split(/\s+/).filter(Boolean)
    
    // Если поле пустое - показываем все 4 альбома
    const albumsToShow = albumIds.length > 0 
      ? albumIds.map(Number)
      : [1, 2, 3, 4]

    const newPhotos = albumsToShow.flatMap(albumId => {
      // Для каждого альбома создаем 3 фото
      return Array.from({ length: 3 }, (_, index) => {
        const photoId = (albumId - 1) * 3 + index + 1
        return {
          id: photoId,
          albumId: albumId,
          title: `Фото ${index + 1} из альбома ${albumId}`,
          url: `https://picsum.photos/id/${photoId}/150/150`,
          thumbnailUrl: `https://picsum.photos/id/${photoId}/150/150`
        }
      })
    })

    photos.value = newPhotos
    displayedPhotos.value = newPhotos
  }

  return {
    photos,
    displayedPhotos,
    loading,
    filterAlbumIds,
    fetchPhotos
  }
}) 