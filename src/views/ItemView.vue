<template>
    <div>
      <div class="p-5 bg-dark">
        <div class="content" >
            <div class="d-flex flex-row">
                <h2 class="text-white" v-text="this.itemName"></h2>
                <a v-if="this.editar" class="btn-white mx-2 my-auto" @click="$router.push('/EditItem');">
                    <i class="fa fa-cog" style="font-size: 26px;" aria-hidden="true"></i>
                </a>
            </div>
            <div class="row">
                <div class="col-lg-4 row ">
                    <img class="bg-white rounded border border-black" style="width: 100%;" v-if="this.itemImage !== null && this.itemImage !== ''" :src="this.itemImage" alt="Imagen">
                </div>
                
                <div class="col-lg-8 d-flex flex-column px-5">
                        
                    <div class="">
                        <span class="text-white em-2">Detalle</span>
                        <div class="flex-fill border-solid border borderw-3 my-3 rounded p-3 ml-2">
                            <span v-text="this.itemDescription" type="text" placeholder="Descripcion" class="text-white"></span>
                        </div>
                    </div>
                    <div>
                        <p class="text-white em-2" placeholder="Cantidad" type="text" v-text="'Cantidad Disponible '+this.quantity"></p>
                        <select class="form-control form-control-lg fs-6 ml-2" v-model="this.store" v-on:change="this.getStoreInfo()">
                            <option v-for="(i, index) in stores" :value="i.storeId" :key="index">{{ i.name }}</option>
                        </select>
                        <p class="text-white ml-3 mt-2" style="font-size: 1.5em;" placeholder="Cantidad" type="text" v-text="'Sucursal '+this.storeAddress + ' - Cantidad: '+this.storeQuantity"></p>
                    </div>
                    <div>
                        <p class="text-white em-2">Precio: </p>
                        <p v-text="this.dinero(this.itemPrice)" type="text" placeholder="Precio" class="text-white em-2"></p>
                    </div>
                </div> 
                
                <div class="mt-3 col-lg-4"> <!-- Categorias del Item -->
                    <div class="d-flex flex-row">
                        <h4 class="text-white">Categorias</h4>
                    </div>
                    <div class="row mt-2 px-3">
                        <table class="table table-dark table-bordered table-hover">
                            <tbody class="table-ground-divider" id="contenido">
                                <tr v-for="(c, index) in selectedCategory" :key="c.id">
                                    <td class="text-center table-active">{{ c.name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="buttons mt-3 d-flex justify-content-end">
                <button class="btn btn-warning mx-2" @click="$router.go(-1)">Volver</button>
            </div>
        </div>
      </div>
    </div>
</template>

<script scoped>
    import axios from 'axios';
    import { ref } from 'vue';
    import router from '@/router';

    export default {
        data(){
            return{
                noStock: false,
                stores: [],
                store: 0,
                itemId: 0,
                itemName: "",
                itemDescription: "",
                itemPrice: 0,
                itemImage:"",
                quantity: 0,
                storeQuantity: 0,
                storeAddress: "",
                selectedCategory: [],
                inventory:[],
                editar: false
            }
        },
        async mounted(){
            this.emitter.emit('isLogged');
            var login = JSON.parse(localStorage.getItem('login'));
            if (login !== null && login.loginOK === 1) this.editar = true;

            this.itemId = localStorage.getItem('itemId');
            await this.GetItem();
            await this.getStores();
            this.getStoreInfo();
        },
        methods:{
            getStoreInfo(){
                this.storeQuantity = 0;
                this.storeAddress = this.stores.filter(i => i.storeId === this.store)[0].addressName;
                if (this.inventory === null || this.inventory.length === 0 || this.inventory.filter(i => i.storeId === this.store).length === 0) return;
                this.storeQuantity = this.inventory.filter(i => i.storeId === this.store)[0].quantity;
            },
            async GetItem(){
                await axios.get(this.host + "Item/GetItem?id=" + this.itemId).then(
                    response => {
                        const item = response.data;
                        if (item.itemId === 0 ) this.$router.push("/catalog");
                        this.itemName = item.name;
                        this.itemDescription = item.description;
                        this.itemImage = item.imageUrl;
                        this.itemPrice = item.price;
                        this.selectedCategory = item.categories;
                        this.quantity = item.quantity;
                        this.inventory = item.inventory;
                    }
                ).catch(error =>{
                    console.error(error);
                });
            },
            async getStores(){
                await axios.get( this.host + "Store/GetList").then(
                    response => {
                        this.stores = response.data;
                        this.store = response.data[0].storeId;
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