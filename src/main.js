import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mitt from 'mitt';
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.min.css'


const emitter = mitt();
const host = "https://localhost:7083/";


const app = createApp(App);
app.use(store);
app.use(router);
app.config.globalProperties.emitter = emitter;
app.config.globalProperties.host = host;
app.mount('#app');

import 'bootstrap/dist/js/bootstrap'
import './css/customStyles.css'