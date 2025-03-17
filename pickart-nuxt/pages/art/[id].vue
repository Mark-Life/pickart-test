<script setup lang="ts">
import type { ArtPiece } from "~/types";
import { definePageMeta, useRoute, useAsyncData } from '#imports'
import { useSupabase } from '~/composables/useSupabase'

definePageMeta({
  static: true,
  revalidate: 604800, // 1 week in seconds
});

const route = useRoute();
const { getArtPiece } = useSupabase();

// Fetch art piece at build time
const { data: piece } = await useAsyncData<ArtPiece>(`art-piece-${route.params.id}`, () =>
  getArtPiece(route.params.id as string)
);
</script>

<template>
  <div v-if="piece" class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-4">
        <NuxtImg
          v-for="(image, index) in piece.images"
          :key="index"
          :src="image"
          :alt="`${piece.title} - Image ${index + 1}`"
          class="w-full rounded-lg shadow-md"
        />
      </div>
      <div>
        <h1 class="text-4xl font-bold mb-4">{{ piece.title }}</h1>
        <p class="text-xl text-gray-600 mb-6">by {{ piece.artist }}</p>
        <p class="text-3xl font-bold mb-6">
          ${{ piece.price.toLocaleString() }}
        </p>
        <div class="space-y-4">
          <p class="text-gray-700">{{ piece.description }}</p>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold">Dimensions</h3>
              <p>{{ piece.dimensions }}</p>
            </div>
            <div>
              <h3 class="font-semibold">Medium</h3>
              <p>{{ piece.medium }}</p>
            </div>
            <div>
              <h3 class="font-semibold">Style</h3>
              <p>{{ piece.style }}</p>
            </div>
            <div>
              <h3 class="font-semibold">Year</h3>
              <p>{{ piece.year }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto px-4 py-8">
    <p>Art piece not found</p>
  </div>
</template>
