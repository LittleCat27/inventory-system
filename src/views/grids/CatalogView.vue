<template>
<div class="row p-3 bg-dark text-white table-active">
    <h1 class="text-center text-white col-12 p-3">Catalogo</h1>

    <!-- FILTROS DISPONIBLES -->
    <div class="col-md-3 border rounded">
        <h1 class="text-center">FILTROS</h1>
        <h2>Nombre Item</h2>
        <input class="rounded mb-4 p-2" placeholder="Buscar item.." type="text" v-model="itemName" @input="this.getItems()">
        <div class="row">
            <h2>Categorias</h2>
            <div class="col-9">
                <select class="form-control form-control-lg fs-6" v-model="this.category">
                    <option v-for="(c, index) in categories" :value="c.id" :key="index">{{ c.name }}</option>
                </select>
            </div>
            <div class="col-3"><button class="btn btn-info mx-2" v-on:click="this.addSelected()"><i class="fas fa-add"></i></button></div>
        </div>
        <div class="row">
            <table class="table table-dark table-bordered table-hover">
                <tbody class="table-ground-divider" id="contenido">
                    <tr v-for="(c, index) in selectedCategory" :key="c.id">
                        <td>{{ c.id }}</td>
                        <td>{{ c.name }}</td>
                        <td class="col-2">
                            <button class="btn btn-info mx-2" @click="delSelected(c.id)"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!-- GRID DEL CATALOGO-->
    <div class="col-md-9 px-5">
    <div>
        <div class="row flow-offset-1">
            <div class="col-xs-6 col-md-4 mt-3"  v-for="item, i in items" :key="item.item_id">
            <div v-on:click="viewItem(item.itemId)" style="width: 350px;" class="border rounded shadow card">
                <div><a class="bg-white"><img class="bg-white rounded border-bottom-1 rounded-bottom-0" height="280" width="349" :src="item.imageUrl" alt=""></a>
                    <div class="caption p-2">
                    <h6><a class="">{{item.name}}</a></h6>
                    <div>
                            <span v-for="(c, index) in item.categories" :key="c.id" ><span v-if="index > 0">, </span>{{ c.name }}</span>
                    </div>
                    <span>{{dinero(item.price)}}</span>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</div>
</template>

<script>
    import axios from 'axios';
    import { ref } from 'vue';
    import router from '@/router';

    export default {
        data(){
            return{
                noStock: false,
                items:[],
                stores: {},
                SelectedStore: {},
                itemName: "",
                id: 0,
                selectedCategory: [],
                idList: [],
                categories: [],
                category: 0
            }
        },
        mounted(){
            this.emitter.emit('isLogged');


            this.getStores();
            this.getItems();
            this.getCategoryList();
        },
        methods:{
            delSelected(id){
                this.selectedCategory = this.selectedCategory.filter(f => f.id != id);
                this.idList = this.idList.filter(f => f != id);
                this.getItems()
            },
            addSelected(){
                if (this.category === 0) return;
                if (this.selectedCategory === null) this.selectedCategory = [];
                if (this.selectedCategory.filter(f => f.id === this.category).length > 0) return;
                this.selectedCategory.push(this.categories.filter(f => f.id === this.category)[0]);
                this.idList.push(this.category);
                this.getItems()
            },
            async getCategoryList(){
                await axios.get(this.host + "Category/GetList").then(
                response => {this.categories = response.data;
                    const emptyItem = {
                        id: 0,
                        name: "Seleccione una categoria"
                    }
                    this.categories.unshift(emptyItem);
                }).catch(error =>{
                    console.error(error);
                });
            },
            async getItems(){
                const filter = {
                    itemId: 0,
                    name: this.itemName,
                    description: "string",
                    code: "string",
                    barcode: "",
                    imageUrl: "string",
                    price: 0,
                    quantity: 0,
                    inventory: [],
                    categories: this.selectedCategory
                }
               await axios.post(this.host + "Item/GetList", filter).then(
                    response => {this.items = response.data;}).catch(error =>
                    {console.error(error);
                });
                
            },
            viewItem(id = 0){
                localStorage.setItem('itemId', JSON.stringify(id));
                this.$router.push("/ItemView");
            },
            getStores(){
                axios.get(this.host + "Store/GetList").then(
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

<style scoped>

</style>