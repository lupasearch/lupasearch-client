/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { LupaSearch } from '@getlupa/vue'
import AppProductList from './AppProductList.vue'
import AppContainer from './AppContainer.vue'
import AppRecommender from './AppRecommender.vue'

// For Dev: select feature:
// const Main = AppRecommender
// const Main = AppContainer
// const Main = AppProductList
const Main = App

const app = createApp(Main)

app.use(createPinia())
app.use(LupaSearch)

app.mount('#app')
