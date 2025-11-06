<template>
  <Navbar :username/>
  <h1>Repo for {{ username }}</h1>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import Navbar from '../components/Navbar.vue';

  const route = useRoute();
  const username = route.params.username;
</script>
