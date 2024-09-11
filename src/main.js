import { createApp } from 'vue';
import App from './App.vue';
import './assets/scss/general.scss';
import * as bootstrap from 'bootstrap';
import router from './router';

window.bootstrap = bootstrap;

const app = createApp(App)
app.use(router)
app.mount('#app')
