<script setup lang="ts">
import PhotoTable from './components/PhotoTable.vue'
</script>

<template>
  <div class="min-h-screen bg-white">
    <header class="p-4 border-b">
      <div class="max-w-[800px] mx-auto">
        <h1 class="text-xl font-bold">Photo Albums</h1>
      </div>
    </header>
    <main>
      <PhotoTable />
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
