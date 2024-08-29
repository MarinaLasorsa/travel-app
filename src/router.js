import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './pages/HomeView.vue'
import TripView from './pages/TripView.vue'
import StopView from './pages/StopView.vue'


export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/trip/:slug', name: 'trips.show', component: TripView, props: true },
        { path: '/stop/:slug', name: 'stops.show', component: StopView, props: true },
    ],
})