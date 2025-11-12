<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-lg">
    <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b bg-muted/50">
      <div v-if="favorites.length > 0" class="flex items-center justify-between">
        <h3 class="text-sm sm:text-base md:text-lg font-semibold tracking-tight">
          Favorite Commits
        </h3>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center rounded-md bg-secondary px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-secondary-foreground">
            {{ favorites.length }}
          </span>
          <button
            @click="$emit('clearAll')"
            class="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors hover:bg-destructive/10 text-destructive h-7 px-2"
            title="Clear all favorites"
          >
            <Trash2 class="w-3 h-3 mr-1" />
            Clear All
          </button>
        </div>
      </div>
      <h3 v-else class="text-sm sm:text-base md:text-lg font-semibold tracking-tight">
        Favorite Commits
      </h3>
    </div>
    
    <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
      <!-- Empty state -->
      <div v-if="favorites.length === 0" class="text-center py-6 sm:py-8 md:py-12 text-muted-foreground">
        <div class="p-3 sm:p-4 bg-muted/50 rounded-full w-fit mx-auto mb-3 sm:mb-4">
          <Heart class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-muted-foreground/60" />
        </div>
        <p class="text-xs sm:text-sm">No favorite commits yet</p>
        <p class="text-[10px] sm:text-xs mt-1">Mark commits as favorites to see them here</p>
      </div>
      
      <!-- Favorites list -->
      <div v-else class="relative overflow-auto h-[280px] sm:h-[350px] md:h-[400px] pr-2 sm:pr-3 md:pr-4">
        <div class="space-y-2 sm:space-y-2.5 md:space-y-3">
          <div
            v-for="favorite in favorites"
            :key="favorite.sha"
            class="rounded-lg border bg-card text-card-foreground hover:border-primary/30 hover:bg-accent/50 hover:shadow-md transition-all duration-200"
          >
            <div class="p-2.5 sm:p-3 md:p-4">
              <div class="flex items-start justify-between gap-2 sm:gap-2.5 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] sm:text-xs md:text-sm mb-1 sm:mb-1.5 md:mb-2 break-words line-clamp-2 text-foreground leading-snug">
                    {{ favorite.message?.split('\n')[0] || 'No message' }}
                  </p>
                  
                  <div class="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                    <div class="flex items-center gap-1">
                      <User class="w-3 h-3" />
                      <span class="truncate max-w-[100px]">{{ favorite.author || 'Unknown' }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Calendar class="w-3 h-3" />
                      <span>{{ favorite.date ? formatDate(favorite.date) : 'Unknown date' }}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                    <GitBranch class="w-3 h-3" />
                    <span class="truncate">{{ favorite.username }}/{{ favorite.repoName }}</span>
                  </div>
                </div>
                
                <button
                  @click="$emit('removeFavorite', favorite.sha)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-destructive/10 text-destructive shrink-0 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0"
                  :disabled="!favorite.sha"
                >
                  <Trash2 class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
              
              <span class="inline-flex items-center rounded bg-muted/80 px-2 py-0.5 text-[10px] font-mono">
                {{ favorite.sha?.substring(0, 7) || 'N/A' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Heart, Trash2, Calendar, User, GitBranch } from 'lucide-vue-next';
  import type { FavoriteCommit } from '../types/github';

  defineProps<{
    favorites: FavoriteCommit[];
  }>();

  defineEmits<{
    removeFavorite: [sha: string];
    clearAll: [];
  }>();

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };
</script>