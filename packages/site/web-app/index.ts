import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'

import '@/styles/index.scss'

createApp(App).use(router).use(createPinia()).mount('#app')
