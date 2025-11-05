<template>
  <div>
    <h1>Repo for {{ username }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const username = route.params.username;
</script>
