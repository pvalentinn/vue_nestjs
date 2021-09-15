import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

import App from './App.vue';
import HelloWorld from './pages/HelloWorld.vue';
import NotFound from './pages/NotFound.vue';
import HomePage from './pages/HomePage.vue';
import LobbyPage from './pages/LobbyPage.vue';

const routes = [
    { path: '/', name:'Home', component: HomePage},
    { path: '/test', name: 'Test', component: HelloWorld, props: true },
    { path: '/lobby/:id', name: 'Lobby', component: LobbyPage },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

// HTTP connection to the API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'http://localhost:5000/graphql',
  })
  
// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
})

const router = createRouter({
    history: createWebHistory(),
    routes,
})


createApp(App)
.use(router)
.provide(DefaultApolloClient, apolloClient)
.mount('#app');