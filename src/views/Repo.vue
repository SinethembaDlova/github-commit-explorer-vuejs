<script setup>
  import { computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useGitHubStore } from '@/store/githubStore'

  // Get route and store
  const route = useRoute()
  const githubStore = useGitHubStore()

  // Get username from route params
  const username = computed(() => route.params.username)

  // Lifecycle - Fetch repositories when component mounts or username changes
  watch(
    username,
    (newUsername) => {
      if (newUsername) {
        githubStore.fetchRepositories(newUsername)
        githubStore.resetCommits()
        githubStore.setSelectedRepo(null)
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    if (username.value) {
      githubStore.fetchRepositories(username.value)
    }
  })
</script>