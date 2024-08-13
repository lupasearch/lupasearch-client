/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApp } from 'vue'
import App from './App.vue'
import { LupaSearch, initPinia } from '@getlupa/vue'
import AppProductList from './AppProductList.vue'
import AppContainer from './AppContainer.vue'
import AppRecommender from './AppRecommender.vue'
import AppMounted from './AppMounted.vue'

// For Dev: select feature:
// const Main = AppRecommender
// const Main = AppContainer
// const Main = AppProductList
// const Main = AppMounted
const Main = App

const app = createApp(Main)

const pinia = initPinia()

app.use(pinia)
app.use(LupaSearch)

app.mount('#app')
