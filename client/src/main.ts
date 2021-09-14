import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue';
import HelloWorld from './components/HelloWorld.vue';
import NotFound from './components/NotFound.vue';
import HomePage from './components/HomePage.vue';

const routes = [
    { path: '/', name:'Home', component: HomePage},
    { path: '/test', name: 'Test', component: HelloWorld, props: true },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})


createApp(App)
.use(router)
.mount('#app');