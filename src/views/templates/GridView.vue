

<template>
    <div class="row">
        <h2 class="offset-lg-5">Inventario</h2>
        <div class="d-flex flex-row"> <!-- Div de Filtros -->
            <div class="p-2 mt-auto"><button class="btn btn-dark m-1" @click="Agregar()">Agregar nuevo item</button>            </div>
            <div class="p-2 mt-auto">
                <h5 class="my-auto fs-6">Nombre del Item</h5>
                <input type="text" class=" text-center form-control form-control-lg p-1 fs-6" placeholder="Buscar por Nombre" v-model="filtro" @input="getItems()">
            </div>
            <div class="p-2 row ">
                <h5 class="my-auto fs-6">Tienda</h5>
                <select class="form-control form-control-lg fs-6" @change="this.getItems()" v-model="this.SelectedStore">
                    <option v-for="(store, index) in stores" :value="store.storeId" :key="index">{{ store.name }}</option>
                </select>
            </div>
            <div class="p-2 row"  style="width: 200px;">
                <h5 class="my-auto mx-auto text-center fs-6">Mostrar Sin Stock</h5>
                <input class="my-auto mx-auto" type="checkbox" v-model="this.noStock">
            </div>            
        </div>
        
        <div class="col-lg-12"> <!-- GRID -->
            <div class="table-responsive rounded">
                <table class="table table-dark table-bordered table-hover">
                    <thead><tr><th>#</th><th>NOMBRE</th><th>DESCRIPCION</th><th>CODIGO</th><th>PRECIO</th><th>CANTIDAD</th></tr></thead>
                    <tbody class="table-ground-divider" id="contenido">
                        <tr v-for="itemC, i in items" :key="itemC.item_id">
                            <td v-if="this.noStock || itemC.quantity > 0">{{ itemC.itemId }}</td>
                            <td v-if="this.noStock || itemC.quantity > 0">{{ itemC.name }}</td>
                            <td v-if="this.noStock || itemC.quantity > 0">{{ itemC.description }}</td>
                            <td v-if="this.noStock || itemC.quantity > 0">{{ itemC.code }}</td>
                            <td v-if="this.noStock || itemC.quantity > 0">{{ dinero(itemC.price) }}</td>
                            <td v-if="this.noStock || itemC.quantity > 0">{{ itemC.quantity }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script scoped >
    import axios from 'axios';
    import { ref } from 'vue';
    import router from '@/router';

    export default {
        data(){
            return{
                login: JSON.parse(localStorage.getItem('login')) || {},
                noStock: false,
                items:{},
                stores: {},
                SelectedStore: {},
                filtro: ""
            }
        },
        mounted(){
            if (this.login.loginOK !== 1) router.push("/login");

            this.getStores();
            this.getItems();
        },
        methods:{
            async getItems(){
                console.log(this.SelectedStore);
               await axios.get("https://localhost:7083/Item/GetItemList?filtro=" + this.filtro).then(
                    response => {this.items = response.data;});
                for(var i = 0; i < this.items.length; i++){
                    await axios.get("https://localhost:7083/Item/GetItemQuantity?item_id="+this.items[i].itemId+"&store_id=" + this.SelectedStore).then(
                    response => {this.items[i].quantity = response.data;});
                }
                
            },
            getStores(){
                axios.get("https://localhost:7083/Store/GetList").then(
                    response => {
                        this.stores = response.data;
                        this.SelectedStore= response.data[0].storeId;
                    });
            },
            dinero(value){
                var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                });
                return formatter.format(value);
            }
        }
    }
</script>
