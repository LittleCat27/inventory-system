import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InventoryListView from '../views/grids/InventoryListView.vue'
import LoginView from '../views/LoginView.vue'
import AboutView from '../views/AboutView.vue'
import StoreView from '../views/grids/StoreView.vue'
import HistoryView from '../views/grids/HistoryView.vue'
import CatalogView from '../views/grids/CatalogView.vue'
import GridView from '../views/templates/GridView.vue'
import EditItemView from '../views/EditItemView.vue'
import ItemView from '../views/ItemView.vue'
import CategoryView from '../views/grids/CategoryView.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
  {
    path: '/Register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/Categories',
    name: 'Categories',
    component: CategoryView
  },
  {
    path: '/ItemView',
    name: 'ItemView',
    component: ItemView
  },
  {
    path: '/EditItem',
    name: 'EditItem',
    component: EditItemView
  },
  {
    path: '/templates/Grid',
    name: 'Grid',
    component: GridView
  },
  {
    path: '/Catalog',
    name: 'Catalog',
    component: CatalogView
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryView
  },
  {
    path: '/store',
    name: 'store',
    component: StoreView
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryListView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
