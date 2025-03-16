import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import './style.css';

const app = createApp(App);

app.use(ElementPlus);
setupRouter(app);

app.mount('#app');
