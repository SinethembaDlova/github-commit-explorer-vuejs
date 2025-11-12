<template>
  <div class="space-y-2 sm:space-y-3">
    <div v-if="commits.length === 0 && !loading" class="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm">
      No commits found for this repository
    </div>

    <!-- Commits list -->
    <div class="space-y-2 sm:space-y-3">
      <div
        v-for="commit in sortedCommits"
        :key="commit.sha"
        class="rounded-lg border bg-card text-card-foreground hover:border-primary/30 hover:bg-accent/50 hover:shadow-md transition-all duration-200"
      >
        <div class="pb-2 sm:pb-3 p-2.5 sm:p-3 md:p-4">
          <div class="flex items-start gap-2 sm:gap-2.5 md:gap-3">
            <div class="relative flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 shrink-0 overflow-hidden rounded-full border border-border/60">
              <img
                v-if="commit.author?.avatar_url"
                :src="commit.author.avatar_url"
                :alt="commit.commit.author.name"
                class="aspect-square h-full w-full"
              />
              <div v-else class="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <User class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <p class="text-[11px] sm:text-xs md:text-sm mb-1 sm:mb-1.5 md:mb-2 break-words line-clamp-2 text-foreground leading-snug">
                {{ commit.commit.message.split('\n')[0] }}
              </p>
              
              <div class="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <User class="w-3 h-3" />
                  <span class="truncate max-w-[120px]">{{ commit.commit.author.name }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Calendar class="w-3 h-3" />
                  <span>{{ formatDate(commit.commit.author.date) }}</span>
                </div>
                <span class="inline-flex items-center rounded bg-muted/80 px-2 py-0.5 text-[10px] font-mono">
                  {{ commit.sha.substring(0, 7) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pt-0 p-2.5 sm:p-3 md:p-4">
          <div class="flex gap-2">
            <button
              @click="$emit('viewDetails', commit)"
              class="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors h-8 text-sm px-3"
            >
              <Info class="w-4 h-4" />
              <span>View Details</span>
            </button>
            
            <button
              @click="favoriteIds.has(commit.sha) ? $emit('removeFavorite', commit.sha) : $emit('addFavorite', commit)"
              :class="[
                'inline-flex items-center justify-center gap-2 rounded-md transition-colors h-8 text-sm px-3',
                favoriteIds.has(commit.sha) 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
              ]"
            >
              <Heart 
                :class="[
                  'w-4 h-4',
                  favoriteIds.has(commit.sha) ? 'fill-current' : ''
                ]"
              />
              <span>{{ favoriteIds.has(commit.sha) ? 'Favorited' : 'Favorite' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Load more button -->
    <div v-if="hasMoreCommits && onLoadMore" class="flex justify-center pt-1.5 sm:pt-2">
      <button
        @click="$emit('loadMore')"
        :disabled="loading"
        class="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto text-[11px] sm:text-xs md:text-sm h-8 sm:h-9 px-4 sm:px-6"
      >
        {{ loading ? 'Loading...' : 'Load More Commits' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import { Heart, Info, Calendar, User } from 'lucide-vue-next';
	import type { Commit, SortOrder } from '../types/github';

	const props = defineProps<{
  	commits: Commit[];
  	favoriteIds: Set<string>;
  	sortOrder: SortOrder;
  	onLoadMore?: () => void;
  	hasMoreCommits: boolean;
  	loading: boolean;
	}>();

	defineEmits<{
  	addFavorite: [commit: Commit];
  	removeFavorite: [sha: string];
  	viewDetails: [commit: Commit];
  	loadMore: [];
	}>();

	// Sort commits based on selected order
	const sortedCommits = computed(() => {
  	return [...props.commits].sort((a, b) => {
    	const dateA = new Date(a.commit.author.date).getTime();
    	const dateB = new Date(b.commit.author.date).getTime();
    
    	return props.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  	});
	});

	// Format date for display
 	const formatDate = (dateString: string) => {
  	const date = new Date(dateString);
   	return new Intl.DateTimeFormat('en-US', {
    	month: 'short',
    	day: 'numeric',
    	year: 'numeric',
    	hour: '2-digit',
    	minute: '2-digit',
  	}).format(date);
	};
</script>