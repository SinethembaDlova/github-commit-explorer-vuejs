<template>
  <div class="space-y-2 sm:space-y-3">
    <div v-if="repositories.length === 0" class="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm">
      No repositories found for this user
    </div>
    
    <div
      v-for="repo in repositories"
      :key="repo.id"
      :class="[
        'rounded-lg border bg-card text-card-foreground cursor-pointer transition-all duration-200 overflow-hidden',
        selectedRepo?.id === repo.id 
          ? 'border-primary/70 bg-primary/5 shadow-lg ring-2 ring-primary/20' 
          : 'hover:border-primary/30 hover:bg-accent/50 hover:shadow-md'
      ]"
      @click="$emit('selectRepo', repo)"
    >
      <div class="pb-2 sm:pb-3 p-2.5 sm:p-3 md:p-4 relative">
        <div v-if="selectedRepo?.id === repo.id" class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3">
          <div class="bg-primary text-primary-foreground rounded-full p-0.5 sm:p-1">
            <Check class="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
          </div>
        </div>
        
        <div class="flex items-start justify-between gap-1.5 sm:gap-2 md:gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1 sm:gap-1.5 md:gap-2 mb-0.5 sm:mb-1">
              <GitBranch 
                :class="[
                  'w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0',
                  selectedRepo?.id === repo.id ? 'text-primary' : 'text-primary'
                ]"
              />
              <h4 
                :class="[
                  'text-xs sm:text-sm md:text-base break-words font-medium',
                  selectedRepo?.id === repo.id ? 'text-primary' : 'text-foreground'
                ]"
              >
                {{ repo.name }}
              </h4>
            </div>
            <p v-if="repo.description" class="text-[10px] sm:text-xs md:text-sm text-muted-foreground break-words line-clamp-2">
              {{ repo.description }}
            </p>
          </div>
          <div v-if="repo.stargazers_count > 0" class="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm text-muted-foreground shrink-0 mr-5 sm:mr-6">
            <Star class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-yellow-500/20 text-yellow-500" />
            <span>{{ repo.stargazers_count }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="repo.language || selectedRepo?.id === repo.id" class="pt-0 p-2.5 sm:p-3 md:p-4">
        <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span v-if="repo.language" class="inline-flex items-center rounded-md bg-secondary px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-secondary-foreground">
            {{ repo.language }}
          </span>
          <span 
            v-if="selectedRepo?.id === repo.id" 
            class="inline-flex items-center rounded-md bg-primary/20 text-primary border border-primary/30 px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium"
          >
            Selected
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GitBranch, Star, Check } from 'lucide-vue-next';
  import type { Repository } from '../types/github';

  defineProps<{
    repositories: Repository[];
    selectedRepo: Repository | null;
  }>();

  defineEmits<{
    selectRepo: [repo: Repository];
  }>();
</script>