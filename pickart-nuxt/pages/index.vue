<script setup lang="ts">
import type { ArtPiece } from "~/types";
import { useAsyncData } from '#imports'
import { useSupabase } from '~/composables/useSupabase'

const { getArtPieces } = useSupabase()
const { data: featuredPieces } = await useAsyncData<ArtPiece[]>('featured-pieces', () => 
  getArtPieces().then(pieces => pieces.slice(0, 3))
)
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold mb-4">Welcome to PickArt</h1>
      <p class="text-xl text-gray-600">
        Discover and purchase unique art pieces from talented artists around the world
      </p>
    </div>

    <div class="mb-12">
      <h2 class="text-3xl font-bold mb-6">Featured Art Pieces</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="piece in featuredPieces"
          :key="piece.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <NuxtImg
            :src="piece.images[0]"
            :alt="piece.title"
            class="w-full h-64 object-cover"
          />
          <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">{{ piece.title }}</h3>
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

    <div class="text-center">
      <NuxtLink
        to="/art"
        class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
      >
        View All Art Pieces
      </NuxtLink>
    </div>
  </div>
</template> 