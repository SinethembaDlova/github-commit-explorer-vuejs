<template>
  <div 
    class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-3 md:p-4 z-50" 
    @click="$emit('close')"
  >
    <div 
      class="rounded-lg border bg-card text-card-foreground w-full max-w-4xl max-h-[96vh] sm:max-h-[94vh] md:max-h-[90vh] flex flex-col shadow-2xl" 
      @click.stop
    >
      <!-- Header -->
      <div class="flex-shrink-0 p-3 sm:p-4 md:p-6 border-b">
        <div class="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-base md:text-lg font-semibold mb-1.5 sm:mb-2 break-words text-foreground leading-snug">
              {{ commitDetails.commit.message.split('\n')[0] }}
            </h3>
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-muted-foreground">
              <span class="truncate max-w-[100px] sm:max-w-[120px] md:max-w-none">{{ commitDetails.commit.author.name }}</span>
              <span class="hidden sm:inline">•</span>
              <span class="hidden sm:inline">{{ formatDate(commitDetails.commit.author.date) }}</span>
              <span class="sm:hidden text-[9px]">{{ new Date(commitDetails.commit.author.date).toLocaleDateString() }}</span>
              <span class="hidden sm:inline">•</span>
              <span class="inline-flex items-center rounded-md border border-border bg-muted/60 px-1 sm:px-1.5 md:px-2 py-0 sm:py-0.5 text-[8px] sm:text-[10px] md:text-xs font-mono">
                {{ commitDetails.sha.substring(0, 7) }}
              </span>
            </div>
          </div>
          <button 
            @click="$emit('close')" 
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground shrink-0 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0"
          >
            <X class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <div class="shrink-0 bg-border" style="height: 1px"></div>

      <!-- Commit stats -->
      <div class="pt-2.5 pb-2.5 sm:pt-3 sm:pb-3 md:pt-4 md:pb-4 flex-shrink-0 px-3 sm:px-4 md:px-6 bg-muted/30">
        <div class="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-4 text-center">
          <div class="p-2 sm:p-2.5 md:p-3 rounded-lg bg-background border shadow-sm">
            <div class="text-lg sm:text-xl md:text-2xl mb-0.5 sm:mb-1 text-foreground font-semibold">
              {{ commitDetails.files.length }}
            </div>
            <div class="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Files Changed</div>
          </div>
          <div class="p-2 sm:p-2.5 md:p-3 rounded-lg bg-background border shadow-sm">
            <div class="text-lg sm:text-xl md:text-2xl text-green-500 mb-0.5 sm:mb-1 flex items-center justify-center gap-0.5 sm:gap-1 font-semibold">
              <Plus class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              {{ commitDetails.stats.additions }}
            </div>
            <div class="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Additions</div>
          </div>
          <div class="p-2 sm:p-2.5 md:p-3 rounded-lg bg-background border shadow-sm">
            <div class="text-lg sm:text-xl md:text-2xl text-red-500 mb-0.5 sm:mb-1 flex items-center justify-center gap-0.5 sm:gap-1 font-semibold">
              <Minus class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              {{ commitDetails.stats.deletions }}
            </div>
            <div class="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Deletions</div>
          </div>
        </div>
      </div>

      <div class="shrink-0 bg-border" style="height: 1px"></div>

      <!-- Files changed -->
      <div class="flex-1 overflow-hidden pt-2.5 sm:pt-3 md:pt-4 px-3 sm:px-4 md:px-6">
        <h3 class="mb-2 sm:mb-2.5 md:mb-3 text-xs sm:text-sm md:text-base font-semibold text-foreground">Files Changed</h3>
        <div class="relative overflow-auto h-full">
          <div class="space-y-2 sm:space-y-2.5 md:space-y-3 pr-2 sm:pr-3 md:pr-4 pb-3 sm:pb-4 md:pb-6">
            <div
              v-for="(file, index) in commitDetails.files"
              :key="index"
              class="rounded-lg border bg-card text-card-foreground hover:shadow-md transition-shadow"
            >
              <div class="p-2.5 sm:p-3 md:p-4">
                <div class="flex items-start gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2">
                  <div class="shrink-0">
                    <FilePlus v-if="file.status === 'added'" class="w-4 h-4 text-green-500" />
                    <FileMinus v-else-if="file.status === 'removed'" class="w-4 h-4 text-red-500" />
                    <FileEdit v-else-if="file.status === 'modified'" class="w-4 h-4 text-blue-500" />
                    <FileText v-else class="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1.5 sm:mb-2">
                      <code class="text-[10px] sm:text-xs md:text-sm break-all text-foreground bg-muted/50 px-1.5 sm:px-2 py-0.5 rounded leading-tight">
                        {{ file.filename }}
                      </code>
                      <span 
                        :class="[
                          'inline-flex items-center rounded-md border px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-semibold',
                          getStatusClass(file.status)
                        ]"
                      >
                        {{ file.status }}
                      </span>
                    </div>
                    
                    <div v-if="file.previous_filename && file.status === 'renamed'" class="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mb-1.5 sm:mb-2">
                      Renamed from: <code class="bg-muted/50 px-1 sm:px-1.5 py-0.5 rounded">{{ file.previous_filename }}</code>
                    </div>
                    
                    <div class="flex items-center gap-1.5 sm:gap-2 md:gap-4 text-[9px] sm:text-[10px] md:text-xs">
                      <span class="text-green-500 flex items-center gap-0.5 sm:gap-1 font-medium">
                        <Plus class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {{ file.additions }}
                      </span>
                      <span class="text-red-500 flex items-center gap-0.5 sm:gap-1 font-medium">
                        <Minus class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {{ file.deletions }}
                      </span>
                      <span class="text-muted-foreground hidden sm:inline">
                        {{ file.changes }} change{{ file.changes !== 1 ? 's' : '' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Show patch/diff if available -->
                <div v-if="file.patch" class="mt-2 sm:mt-2.5 md:mt-3">
                  <div class="relative overflow-auto h-[100px] sm:h-[120px] md:h-[150px] rounded border bg-muted/30">
                    <pre class="p-1.5 sm:p-2 md:p-3 text-[9px] sm:text-[10px] md:text-xs font-mono">
                      <div
                        v-for="(line, i) in file.patch.split('\n')"
                        :key="i"
                        :class="getLineClass(line)"
                      >{{ line || ' ' }}</div>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { X, FileText, FilePlus, FileMinus, FileEdit, Plus, Minus } from 'lucide-vue-next';
  import type { CommitDetails as CommitDetailsType } from '../types/github';
  import { formatDate } from '../utils/date';

  defineProps<{
    commitDetails: CommitDetailsType;
  }>();

  defineEmits<{
    close: [];
  }>();

  // Get status class for file status badge
  const getStatusClass = (status: string) => {
    const colors: Record<string, string> = {
      added: 'bg-green-500/10 text-green-500 border-green-500/30',
      removed: 'bg-red-500/10 text-red-500 border-red-500/30',
      modified: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      renamed: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    };
  
    return colors[status] || 'bg-secondary text-secondary-foreground border-border';
  };

  // Get line class for diff highlighting
  const getLineClass = (line: string) => {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      return 'text-green-400 bg-green-500/10';
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      return 'text-red-400 bg-red-500/10';
    } else if (line.startsWith('@@')) {
      return 'text-blue-400 bg-blue-500/10 font-medium';
    } else {
      return 'text-muted-foreground';
    }
  };
</script>