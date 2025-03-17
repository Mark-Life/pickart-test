<script setup lang="ts">
import type { Place, ArtPiece } from "~/types";
import { definePageMeta, useRoute, useAsyncData } from '#imports'
import { useSupabase } from '~/composables/useSupabase'

definePageMeta({
  static: true,
  revalidate: 604800, // 1 week in seconds
});

const route = useRoute();
const { getPlace, getArtPiece } = useSupabase();

// Fetch place and associated art piece at build time
const { data: place } = await useAsyncData<Place>(`place-${route.params.slug}`, () =>
  getPlace(route.params.slug as string)
);

// Fetch art piece only if place exists and has an art piece ID
const { data: artPiece } = await useAsyncData<ArtPiece | null>(
  `art-piece-${place.value?.art_piece_id}`,
  async () => {
    if (!place.value?.art_piece_id) return null;
    return getArtPiece(place.value.art_piece_id);
  }
);
</script>

<template>
  <div v-if="place" class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <NuxtImg
          :src="place.image"
          :alt="place.name"
          class="w-full rounded-lg shadow-md"
        />
      </div>
      <div>
        <h1 class="text-4xl font-bold mb-4">{{ place.name }}</h1>
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold">Type</h3>
            <p class="capitalize">{{ place.type }}</p>
          </div>
          <div>
            <h3 class="font-semibold">Location</h3>
            <p>{{ place.location }}</p>
          </div>
          <div>
            <h3 class="font-semibold">Description</h3>
            <p class="text-gray-700">{{ place.description }}</p>
          </div>
          <div v-if="artPiece">
            <h3 class="font-semibold mb-2">Featured Art</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="text-xl font-semibold">{{ artPiece.title }}</h4>
              <p class="text-gray-600">by {{ artPiece.artist }}</p>
              <NuxtLink
                :to="`/art/${artPiece.id}`"
                class="mt-2 inline-block text-blue-600 hover:text-blue-700"
              >
                View Art Details →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto px-4 py-8">
    <p>Place not found</p>
  </div>
</template>
