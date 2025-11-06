<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, Github } from 'lucide-vue-next'
// import { Button } from 'radix-vue'

defineProps<{ username: string }>()

const router = useRouter()

function goBack() {
  router.push('/')
}
</script>

<template>
  <header class="bg-neutral-900 border-b border-neutral-800 backdrop-blur-md sticky top-0 z-10 shadow-sm">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 text-gray-200">
      <div class="flex items-center gap-3">
        <button
          @click="goBack"
          class="flex items-center gap-2 hover:bg-neutral-800 rounded-md px-3 py-2 transition"
        >
          <ArrowLeft class="w-4 h-4 text-gray-400" />
          <span class="hidden sm:inline text-sm">Back</span>
        </button>

        <div class="flex items-center gap-2">
          <div class="p-2 bg-neutral-800 rounded-md">
            <Github class="w-5 h-5 text-gray-300" />
          </div>
          <div>
            <h1 class="text-sm sm:text-base font-medium text-white">{{username}}'s GitHub Repositories</h1>
            <p class="text-xs text-white-500 hidden sm:block">
              Explore repositories and commits
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Optional — for a smooth backdrop */
header {
  backdrop-filter: blur(8px);
}
</style>
