<template>
  <div class="dark min-h-screen">
    <!-- Header -->
    <Navbar
      :title="`${username}'s Repositories`"
      subtitle="Explore commits and manage favorites"
      :show-back-button="true"
      back-to="/"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useGitHubStore } from '../store/githubStore';
  import { storeToRefs } from 'pinia';
  import Navbar from '../components/Navbar.vue';
  import type { Repository, Commit, SortOrder } from '../types/github';

  const route = useRoute();
  const router = useRouter();
  const githubStore = useGitHubStore();

  // Get reactive state from store
  const {
    repositories,
    commits,
    favorites,
    selectedRepo,
    selectedCommitDetails,
    currentPage,
    hasMoreCommits,
    sortOrder,
    loading,
    error,
  } = storeToRefs(githubStore);

  // Get actions from store
  const {
    fetchRepositories,
    fetchCommits,
    fetchCommitDetails,
    addFavorite,
    removeFavorite,
    setSelectedRepo,
    setSortOrder,
    clearError,
    resetCommits,
    clearSelectedCommitDetails,
  } = githubStore;

  // Get username from route params
  const username = computed(() => route.params.username as string);

  // Create a set of favorite commit SHAs for quick lookup
  const favoriteIds = computed(() => {
    return new Set(favorites.value.map(fav => fav.sha));
  });

  // Fetch repositories when component mounts or username changes
  watch(username, (newUsername) => {
    if (newUsername) {
      fetchRepositories(newUsername);
      resetCommits();
      setSelectedRepo(null);
    }
  }, { immediate: true });

  // Handle repository selection
  const handleSelectRepo = async (repo: Repository | null) => {
    if (repo && username.value) {
      setSelectedRepo(repo);
      resetCommits();
      await fetchCommits(username.value, repo.name, 1);
    }
  };

  // Handle viewing commit details
  const handleViewDetails = async (commit: Commit) => {
    if (username.value && selectedRepo.value) {
      await fetchCommitDetails(username.value, selectedRepo.value.name, commit.sha);
    }
  };

  // Handle adding commit to favorites
  const handleAddFavorite = (commit: Commit) => {
    if (selectedRepo.value && username.value) {
      addFavorite(commit, selectedRepo.value.name, username.value);
    }
  };

  // Handle loading more commits (pagination)
  const handleLoadMore = () => {
    if (username.value && selectedRepo.value && !loading.value) {
      fetchCommits(username.value, selectedRepo.value.name, currentPage.value + 1);
    }
  };

  // Watch sortOrder and update store
  watch(sortOrder, (newOrder) => {
    setSortOrder(newOrder as SortOrder);
  });
</script>