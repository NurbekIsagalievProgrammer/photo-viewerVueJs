import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Photo {
    id: number
    albumId: number
    title: string
    url: string
    thumbnailUrl: string
}

type SortDirection = 'asc' | 'desc' | null
type SortKey = keyof Photo | null

export const usePhotosStore = defineStore('photos', () => {
    const photos = ref<Photo[]>([])
    const displayedPhotos = ref<Photo[]>([])
    const loading = ref(false)
    const filterAlbumIds = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(30)
    const hasMore = ref(true)
    const sortKey = ref<SortKey>(null)
    const sortDirection = ref<SortDirection>(null)

    const sortPhotos = (data: Photo[]) => {
        if (!sortKey.value || !sortDirection.value) return data

        return [...data].sort((a, b) => {
            const aValue = a[sortKey.value!]
            const bValue = b[sortKey.value!]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection.value === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue)
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection.value === 'asc'
                    ? aValue - bValue
                    : bValue - aValue
            }

            return 0
        })
    }

    const setSorting = (key: keyof Photo) => {
        if (sortKey.value === key) {
            // Циклическая смена направления сортировки: asc -> desc -> null
            if (sortDirection.value === 'asc') sortDirection.value = 'desc'
            else if (sortDirection.value === 'desc') {
                sortDirection.value = null
                sortKey.value = null
            }
        } else {
            sortKey.value = key
            sortDirection.value = 'asc'
        }

        // Пересортировка и обновление отображаемых данных
        const sortedData = sortPhotos(photos.value)
        photos.value = sortedData
        displayedPhotos.value = sortedData.slice(0, displayedPhotos.value.length)
    }

    const fetchPhotos = async () => {
        loading.value = true
        try {
            const albumIds = filterAlbumIds.value.trim().split(/\s+/).filter(Boolean)

            let url = 'https://jsonplaceholder.typicode.com/photos'
            if (albumIds.length > 0) {
                url += '?' + albumIds.map(id => `albumId=${id}`).join('&')
            }

            const response = await fetch(url)
            const data: Photo[] = await response.json()

            const modifiedData = data.map(photo => ({
                ...photo,
                url: `https://picsum.photos/id/${photo.id}/600/600`,
                thumbnailUrl: `https://picsum.photos/id/${photo.id}/150/150`
            }))

            photos.value = sortPhotos(modifiedData)
            displayedPhotos.value = photos.value.slice(0, itemsPerPage.value)
            currentPage.value = 1
            hasMore.value = modifiedData.length > itemsPerPage.value
        } catch (error) {
            console.error('Error fetching photos:', error)
        } finally {
            loading.value = false
        }
    }

    const loadMore = () => {
        if (!hasMore.value || loading.value) return

        const start = displayedPhotos.value.length
        const end = start + 20
        const nextItems = photos.value.slice(start, end)

        if (nextItems.length > 0) {
            displayedPhotos.value = [...displayedPhotos.value, ...nextItems]
            hasMore.value = end < photos.value.length
            currentPage.value++
        } else {
            hasMore.value = false
        }
    }

    const hasMoreItems = computed(() => hasMore.value)

    return {
        photos,
        displayedPhotos,
        loading,
        filterAlbumIds,
        fetchPhotos,
        loadMore,
        hasMoreItems,
        setSorting,
        sortKey,
        sortDirection
    }
}) 