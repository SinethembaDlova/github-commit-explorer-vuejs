<template>
  <div class="min-h-screen">
    <!-- Header -->
    <NavBar
      :title="`${username}'s Repositories`"
      subtitle="Explore commits and manage favorites"
      :show-back-button="true"
      back-to="/"
    />

    <!-- Main content -->
    <main class="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
      <!-- Error alert -->
      <div v-if="error" class="relative w-full rounded-lg border border-destructive bg-destructive/10 p-4 mb-3 sm:mb-4 md:mb-6">
        <div class="flex items-start gap-3">
          <AlertCircle class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive shrink-0 mt-0.5" />
          <div class="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span class="text-xs sm:text-sm text-destructive">{{ error }}</span>
            <button
              @click="clearError"
              class="inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-7 sm:h-8 px-3 shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
        <!-- Left column - Repositories -->
        <div class="md:col-span-2 lg:col-span-3">
          <div class="rounded-lg border bg-card text-card-foreground shadow-lg">
            <div class="border-b bg-muted/50 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <h3 class="text-sm sm:text-base md:text-lg font-semibold tracking-tight">Repositories</h3>
            </div>
            <div class="pt-3 sm:pt-4 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
              <div v-if="loading && repositories.length === 0" class="space-y-3">
                <div v-for="i in 3" :key="i" class="rounded-lg border bg-card">
                  <div class="p-4">
                    <div class="h-6 w-3/4 mb-2 animate-pulse rounded-md bg-muted"></div>
                    <div class="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                  </div>
                </div>
              </div>
              <RepositoryList
                v-else
                :repositories="repositories"
                :selected-repo="selectedRepo"
                @select-repo="handleSelectRepo"
              />
            </div>
          </div>
        </div>

        <!-- Middle column - Commits -->
        <div class="md:col-span-2 lg:col-span-5">
          <div class="rounded-lg border bg-card text-card-foreground shadow-lg">
            <div class="border-b bg-muted/50 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <div class="flex items-center justify-between gap-2 sm:gap-3">
                <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <h3 class="text-sm sm:text-base md:text-lg font-semibold tracking-tight truncate">
                    {{ selectedRepo ? `Commits - ${selectedRepo.name}` : 'Commits' }}
                  </h3>
                  <span v-if="selectedRepo && commits.length > 0" class="inline-flex items-center rounded-md bg-secondary px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-secondary-foreground shrink-0">
                    {{ commits.length }}
                  </span>
                </div>
                <SelectRoot v-if="selectedRepo && commits.length > 0" v-model="sortOrder">
                  <SelectTrigger class="inline-flex items-center justify-between rounded-md border border-white/20 bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[100px] sm:w-[110px] md:w-[140px] h-7 sm:h-8 text-[10px] sm:text-xs gap-2 hover:border-white/40 transition-colors">
                    <span class="text-white">{{ sortOrderText }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 opacity-50 shrink-0 text-white">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent 
                      class="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-white/20 bg-popover text-white shadow-md"
                      :position="'popper'"
                      :side="'bottom'"
                      :align="'end'"
                      :side-offset="4"
                    >
                      <SelectViewport class="p-1">
                        <SelectItem 
                          value="newest" 
                          class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent text-white"
                        >
                          <span v-if="sortOrder === 'newest'" class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-white">
                              <path d="M20 6 9 17l-5-5"/>
                            </svg>
                          </span>
                          <SelectItemText>Newest First</SelectItemText>
                        </SelectItem>
                        <SelectItem 
                          value="oldest" 
                          class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent text-white"
                        >
                          <span v-if="sortOrder === 'oldest'" class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-white">
                              <path d="M20 6 9 17l-5-5"/>
                            </svg>
                          </span>
                          <SelectItemText>Oldest First</SelectItemText>
                        </SelectItem>
                      </SelectViewport>
                    </SelectContent>
                  </SelectPortal>
                </SelectRoot>
              </div>
            </div>
            <div class="pt-3 sm:pt-4 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
              <div v-if="!selectedRepo" class="text-center py-8 sm:py-12 md:py-16 text-muted-foreground">
                <div class="p-3 sm:p-4 bg-muted/50 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                  <Github class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-muted-foreground/60" />
                </div>
                <p class="text-xs sm:text-sm md:text-base">Select a repository to view commits</p>
              </div>
              <div v-else-if="loading && commits.length === 0" class="space-y-3">
                <div v-for="i in 3" :key="i" class="rounded-lg border bg-card">
                  <div class="p-4">
                    <div class="flex gap-3">
                      <div class="h-8 w-8 rounded-full animate-pulse bg-muted"></div>
                      <div class="flex-1 space-y-2">
                        <div class="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                        <div class="h-3 w-2/3 animate-pulse rounded-md bg-muted"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CommitList
                v-else
                :commits="commits"
                :favorite-ids="favoriteIds"
                :sort-order="sortOrder"
                :has-more-commits="hasMoreCommits"
                :loading="loading"
                @add-favorite="handleAddFavorite"
                @remove-favorite="removeFavorite"
                @view-details="handleViewDetails"
                @load-more="handleLoadMore"
              />
            </div>
          </div>
        </div>

        <!-- Right column - Favorites -->
        <div class="md:col-span-2 lg:col-span-4">
          <FavoritesList
            :favorites="favorites"
            @remove-favorite="removeFavorite"
            @clear-all="clearAllFavorites"
          />
        </div>
      </div>
    </main>

    <!-- Commit details modal -->
    <CommitDetails
      v-if="selectedCommitDetails"
      :commit-details="selectedCommitDetails"
      @close="clearSelectedCommitDetails"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router'; 
  import { AlertCircle } from 'lucide-vue-next';
  import {
    SelectRoot,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from 'radix-vue';
  import { useGitHubStore } from '../store/githubStore';
  import { storeToRefs } from 'pinia';
  import Navbar from '../components/Navbar.vue';
  import RepositoryList from '../components/RepositoryList.vue';
  import CommitList from '../components/CommitList.vue';
  import FavoritesList from '../components/FavoritesList.vue';
  // import CommitDetails from '../components/CommitDetails.vue';
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
    clearAllFavorites,
  } = githubStore;

  // Get username from route params
  const username = computed(() => route.params.username as string);

  // Get selected sort order text
  const sortOrderText = computed(() => {
    return sortOrder.value === 'newest' ? 'Newest First' : 'Oldest First';
  });

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