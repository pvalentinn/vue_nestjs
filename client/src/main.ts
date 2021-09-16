import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { HttpLink, split, ApolloClient, InMemoryCache } from '@apollo/client/core';
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { DefaultApolloClient } from '@vue/apollo-composable';

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

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const httpLink = new HttpLink({
    uri: "http://localhost:5000/graphql"
});

const wsLink = new WebSocketLink({
    uri: `ws://localhost:5000/graphql`,
    options: {
      reconnect: true
    }
});

const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
);

const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
})

createApp(App)
.use(router)
.provide(DefaultApolloClient, apolloClient)
.mount('#app');