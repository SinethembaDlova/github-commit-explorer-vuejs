import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Repo from '@/views/Repo.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/repos/:username', name: 'Repo', component: Repo },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
