<template>
  <div class="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 bg-neutral-950 text-gray-100">
    <div class="w-full max-w-md">
      <div class="rounded-xl border border-neutral-800 bg-neutral-900 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
        <div class="pt-6 pb-5 sm:pt-8 sm:pb-6 px-4 sm:px-6">
          <!-- Header -->
          <div class="text-center mb-6 sm:mb-8">
            <div class="flex justify-center mb-3 sm:mb-4">
              <div class="p-2.5 sm:p-3 bg-neutral-800 rounded-xl shadow-inner">
                <Github class="w-6 h-6 sm:w-8 sm:h-8 text-gray-100" />
              </div>
            </div>
            <h1 class="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-1.5 sm:mb-2 text-gray-50">
              GitHub Commit Explorer
            </h1>
            <p class="text-gray-400 text-sm sm:text-base">
              Enter a GitHub username to explore their repositories and commits.
            </p>
          </div>

          <!-- Form -->
          <form @submit="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="username" class="text-sm font-medium text-gray-300">GitHub Username</Label>
              <input
                id="username"
                v-model="username"
                placeholder="e.g., octocat"
                :class="[
                  'w-full px-3 py-2 rounded-md text-sm focus:outline-none transition-all duration-200',
                  error
                    ? 'border border-red-500 bg-neutral-950 focus:ring-2 focus:ring-red-600'
                    : 'border border-neutral-700 bg-neutral-950 focus:ring-2 focus:ring-gray-600'
                ]"
              />
              <p v-if="error" class="text-sm text-red-500 font-medium">{{ error }}</p>
            </div>

            <button
              type="submit"
              class="w-full inline-flex items-center justify-center rounded-md bg-gray-100 text-neutral-900 py-2.5 text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Explore Repositories
            </button>
          </form>

          <!-- Quick Select -->
          <div class="mt-5 pt-5 sm:mt-6 sm:pt-6 border-t border-neutral-800">
            <p class="text-[10px] sm:text-xs text-gray-500 text-center">
              Quickly Select Users:
              <span v-for="(u, i) in ['octocat', 'sinethembadlova']" :key="u">
                <button
                  type="button"
                  @click="selectUser(u)"
                  class="text-gray-300 hover:text-gray-100 hover:underline underline-offset-4 transition-colors"
                >
                  {{ u }}
                </button>
                <span v-if="i < 1"> · </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch  } from 'vue'
  import { useRouter } from 'vue-router';
  import { Github } from 'lucide-vue-next';
  import { Label } from 'radix-vue'

  const router = useRouter();
  const username = ref('');
  const error = ref('');

  const validateUsername = (value: string): boolean => {
    if (!value.trim()) {
      error.value = 'Username is required';
      return false;
    }

    const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    if (!usernameRegex.test(value)) {
      error.value = 'Invalid GitHub username format';
      return false;
    }

    if (value.length > 39) {
      error.value = 'Username must be 39 characters or less';
      return false;
    }
    error.value = '';
    return true;
  }

  const handleSubmit = (e: Event) =>{
     e.preventDefault() 
    if (validateUsername(username.value)) {
      router.push(`/repos/${username.value}`);
    }
  }

  function selectUser(user: string) {
    username.value = user
    validateUsername(user)
}

watch(username, (val) => {
  if (error.value) validateUsername(val)
})
</script>
