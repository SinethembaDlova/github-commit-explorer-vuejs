<script setup>
  import { computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useGitHubStore } from '@/store/githubStore'

  // Get route and store
  const route = useRoute()
  const githubStore = useGitHubStore()

  // Get username from route params
  const username = computed(() => route.params.username)

  // Computed
  const favoriteIds = computed(() => {
    return new Set(githubStore.favorites.map(f => f.sha))
  })

  const sortedCommits = computed(() => {
    const sorted = [...githubStore.commits]
    if (githubStore.sortOrder === 'oldest') {
      sorted.reverse()
    }
    return sorted
  })

  // Methods
  const handleSelectRepo = async (repo) => {
    if (repo && username.value) {
      githubStore.setSelectedRepo(repo)
      githubStore.resetCommits()
      await githubStore.fetchCommits(username.value, repo.name, 1)
    }
  }

  const handleViewDetails = async (commit) => {
    if (username.value && githubStore.selectedRepo) {
      await githubStore.fetchCommitDetails(username.value, githubStore.selectedRepo.name, commit.sha)
    }
  }

  const handleAddFavorite = (commit) => {
    if (githubStore.selectedRepo && username.value) {
      githubStore.addFavorite(commit, githubStore.selectedRepo.name, username.value)
   }
  }

  const toggleFavorite = (commit) => {
    if (favoriteIds.value.has(commit.sha)) {
      githubStore.removeFavorite(commit.sha)
    } else {
      handleAddFavorite(commit)
    }
  }

  const handleLoadMore = () => {
    if (username.value && githubStore.selectedRepo && !githubStore.loading) {
      githubStore.fetchCommits(username.value, githubStore.selectedRepo.name, githubStore.currentPage + 1)
    }
  }

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