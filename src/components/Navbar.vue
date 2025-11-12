<template>
  <header class="bg-card/95 backdrop-blur-md border-b sticky top-0 z-10 shadow-sm">
    <div class="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
      <div class="flex items-center gap-2 sm:gap-3 md:gap-4">
        <button
          v-if="showBackButton"
          @click="handleBack"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-2 sm:px-3"
        >
          <ArrowLeft class="w-4 h-4 sm:mr-2" />
          <span class="hidden sm:inline text-sm">Back</span>
        </button>
        
        <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div class="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
            <Github class="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-primary" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-sm sm:text-base md:text-lg lg:text-xl truncate tracking-tight">
              {{ title }}
            </h1>
            <p v-if="subtitle" class="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
              {{ subtitle }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ArrowLeft, Github } from 'lucide-vue-next';
  import { useRouter } from 'vue-router';

  interface Props {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    backTo?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    subtitle: '',
    showBackButton: false,
    backTo: '/',
  });

  const emit = defineEmits<{
    back: [];
  }>();

  const router = useRouter();

  const handleBack = () => {
    emit('back');
    if (props.backTo) {
      router.push(props.backTo);
    }
  };
</script>