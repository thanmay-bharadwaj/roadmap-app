import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/roadmap.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')





// import { createApp } from 'vue'

// import { createPinia }
// from 'pinia'

// import App from './App.vue'

// import './assets/roadmap.css'

// const app = createApp(App)

// app.use(createPinia())

// app.mount('#app')
