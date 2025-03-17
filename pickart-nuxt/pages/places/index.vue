<script setup lang="ts">
import type { Place } from "~/types";

definePageMeta({
  static: true,
  revalidate: 604800, // 1 week in seconds
});

const { getPlaces } = useSupabase();
const places = ref<Place[]>([]);

// Fetch places at build time
const { data } = await useAsyncData("places", () => getPlaces());
places.value = data.value || [];
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Art Locations</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="place in places"
        :key="place.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <NuxtImg
          :src="place.image"
          :alt="place.name"
          class="w-full h-64 object-cover"
        />
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">{{ place.name }}</h2>
          <p class="text-gray-600 mb-2">{{ place.type }}</p>
          <p class="text-gray-600 mb-4">{{ place.location }}</p>
          <NuxtLink
            :to="`/places/${place.slug}`"
            class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
