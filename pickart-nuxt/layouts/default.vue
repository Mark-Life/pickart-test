<script setup lang="ts">
import { useRoute } from '#imports'

const route = useRoute()
const navigation = [
  { name: 'Art', href: '/art' },
  { name: 'Places', href: '/places' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-xl font-bold">PickArt</span>
            </NuxtLink>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="inline-flex items-center px-1 pt-1 border-b-2"
                :class="[
                  route.path.startsWith(item.href)
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <slot />
    </main>

    <footer class="bg-white border-t">
      <div class="container mx-auto px-4 py-8">
        <p class="text-center text-gray-500">
          © {{ new Date().getFullYear() }} PickArt. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template> 