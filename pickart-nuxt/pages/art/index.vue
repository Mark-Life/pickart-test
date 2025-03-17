<script setup lang="ts">
import type { ArtPiece } from "~/types";

definePageMeta({
  static: true,
  revalidate: 604800, // 1 week in seconds
});

const { getArtPieces } = useSupabase();

// Fetch art pieces at build time
const { data: artPieces } = await useAsyncData("art-pieces", async () => {
  const pieces = await getArtPieces();
  return pieces || [];
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Art Collection</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="piece in artPieces"
        :key="piece.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <NuxtImg
          :src="piece.images?.[0] || '/images/placeholder.jpg'"
          :alt="piece.title"
          class="w-full h-64 object-cover"
        />
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">{{ piece.title }}</h2>
          <p class="text-gray-600 mb-2">by {{ piece.artist }}</p>
          <p class="text-lg font-bold">${{ piece.price.toLocaleString() }}</p>
          <NuxtLink
            :to="`/art/${piece.id}`"
            class="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
