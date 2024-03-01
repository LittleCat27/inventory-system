

<template>
    <div class="row mt-4">
        <h2 class="offset-lg-5">Inventario</h2>
        <div class="d-flex flex-row"> <!-- Div de Filtros -->
            <div class="p-2 mt-auto"><button class="btn btn-dark m-1" @click="Agregar()">Agregar nuevo item</button></div>
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
        
        <div class="col-lg-12"> <!--Grid-->
            <div class="table-responsive rounded">
                <table class="table table-dark table-bordered table-hover">
                    <thead><tr><th>#</th><th>NOMBRE</th><th>DESCRIPCION</th><th>CODIGO</th><th>PRECIO</th><th>CANTIDAD</th><th>ACCIONES</th></tr></thead>
                    <tbody class="table-ground-divider" id="contenido">
                        <tr v-for="itemC, i in items" :key="itemC.item_id">
                            <td v-if="this.noStock || itemC.quantity > 0">{{ itemC.itemId }}</td>
                            <td v-if="this.noStock || itemC.quantity > 0">{{ itemC.name }}</td>
                            <td v-if="this.noStock || itemC.quantity > 0">{{ itemC.description }}</td>
                            <td v-if="this.noStock || itemC.quantity > 0">{{ itemC.code }}</td>
                            <td v-if="this.noStock || itemC.quantity > 0">{{ dinero(itemC.price) }}</td>
                            <td v-if="this.noStock || itemC.quantity > 0">
                                {{ itemC.quantity }}
                                <!--button class="btn btn-info mx-2" @click="agregarCant(itemC.itemId)"><i class="fas fa-plus"></i></button--> <!--Para funcionalidad rapida en el futuro-->
                            </td>
                            <td v-if="this.noStock || itemC.quantity > 0" class="col-2">
                                <button class="btn btn-info mx-2" @click="Editar(itemC.itemId)"><i class="fas fa-pencil"></i></button>
                                <button class="btn btn-info mx-2" @click="Visualizar(itemC.itemId)"><i class="fas fa-eye "></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="modal" v-if="showModal === true" > <!--Modal EDIT/UPDATE/DELETE/VIEW-->
      <div class="modal-content p-5 bg-dark">
        <input class="buttons mb-5 border-0 text-center fs-2" v-model="this.modalTitle" readonly="true"/>
        <div class="content">
            <img v-if="this.modalType !== 'C' && this.modalImg !== null && this.modalImg !== ''" :src="this.modalImg" alt="Imagen" style="width: 35%;" class="bg-white rounded border border-black mx-auto d-block">
            <div class="row mt-3">
                <div class="col-6"><span class="text-white">NOMBRE</span></div>
                <div class="col-6"><span class="text-white">DESCRIPCIÓN</span></div>
            </div>
            <div class="row">
                <div class="col-6"><input v-model="this.modalNombre" type="text" placeholder="Nombre" class="col-12 border-solid borderw-3 px-1 rounded my-1"/></div>
                <div class="col-6"><input v-model="this.modalDescripcion" type="text" placeholder="Descripcion" class="col-12 border-solid borderw-3 px-1 rounded my-1"/></div>
            </div>
            <div class="row">
                <div class="col-6"><span class="text-white">CODIGO</span></div>
                <div class="col-6"><span class="text-white">URL IMAGEN</span></div>
            </div>
            <div class="row">
                <div class="col-6"><input v-model="this.modalCode" type="text" placeholder="Code" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/></div>
                <div class="col-6"><input v-model="this.modalImg" type="text" placeholder="ImageUrl" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/></div>
            </div>
            <div class="row">
                <div class="col-6"><span class="text-white">CODIGO BARRA</span></div>
                <div class="col-6"><span class="text-white">PRECIO</span></div>
            </div>
            <div class="row">
                <div class="col-6"><input v-model="this.modalBarcode" type="text" placeholder="Barcode" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/></div>
                <div class="col-6"><input v-model="this.modalPrecio" type="number" placeholder="Precio" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/></div>
            </div>
            <input v-model="this.itemId" type="number" placeholder="id" class="rounded" style="display: none;"/>
        </div>
        <div class="buttons mt-3">
            <button class="btn btn-warning mx-2" v-if="this.modalType === 'C'" @click="addItem()">Agregar</button>
            <button class="btn btn-warning mx-2" v-if="this.modalType === 'D'" @click="DeleteItem()">Eliminar</button>
            <button class="btn btn-warning mx-2" v-if="this.modalType === 'U'" @click="UpdateItem()">Actualizar</button>
            <button class="btn btn-warning mx-2" v-if="this.modalType !== 'R'" @click="cerrarModal()">Cancelar</button>
            <button class="btn btn-warning mx-2" v-if="this.modalType === 'R'" @click="cerrarModal()">Volver</button>
        </div>
      </div>
    </div>


    <div class="modal" v-if="showModalC === true" >
      <div class="modal-content p-5 bg-dark">
        <h3>Actualizar Stock</h3>
        <div class="content">
            <img v-if="this.modalImg !== null && this.modalImg !== ''" :src="this.modalImg" alt="Imagen" style="width: 35%;" class="bg-white rounded border border-black mx-auto d-block">
            <div class="row mt-3">
                <div class="col-6"><span class="text-white">Nombre</span></div>
                <div class="col-6"><span class="text-white">Descripción</span></div>
            </div>
            <div class="row">
                <div class="col-6"><input readonly="true" v-model="this.modalNombre" type="text" placeholder="Nombre" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/></div>
                <div class="col-6"><input readonly="true" v-model="this.modalDescripcion" type="text" placeholder="Descripcion" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/></div>
            </div>
            <div class="row mt-3">
                <h5 class="text-white">Tienda</h5>
                <div class="col-12"><input readonly="true" v-model="this.modalStore" type="text" placeholder="Nombre Store" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/></div>
                <h5 class="text-white">Stock</h5>
                <div class="col-12"><input v-model="this.modalQuantity" type="number" placeholder="Cantidad" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/></div>
            </div>
            <input v-model="this.itemId" type="number" placeholder="id" class="rounded" style="display: none;"/>
        </div>
        <div class="buttons mt-3">
            <button class="btn btn-warning mx-2"  @click="updateStock()">Actualizar Stock</button>
            <button class="btn btn-warning mx-2"  @click="cerrarModal()">Volver</button>
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
                noStock: false,
                items:{},
                stores: {},
                SelectedStore: {},
                showModal: false,
                showModalC: false,
                modalTitle: "Agregar",
                modalNombre: "",
                modalDescripcion: "",
                modalCode: "",
                modalBarcode: "",
                modalImg: "",
                modalType: "R",
                modalUrl: "",
                modalStore: "",
                modalQuantity: 0,
                itemId: 0,
                filtro: "",
                modalPrecio: 0
            }
        },
        mounted(){
            this.emitter.emit('needLogin');

            this.getStores();
            this.getItems();
            this.modalPrecio = null;
            const showModal = ref(false);
        },
        methods:{
            async getItems(){
               await axios.get(this.host + "Item/GetItemList?filtro=" + this.filtro).then(
                    response => {
                        this.items = response.data;
                    }).catch(error =>{
                        console.error(error);
                    });
                for(var i = 0; i < this.items.length; i++){
                    
                    await axios.get(this.host + "Item/GetItemQuantity?item_id="+this.items[i].itemId+"&store_id=" + this.SelectedStore).then(
                    response => {
                        this.items[i].quantity = response.data;
                    }).catch(error =>{
                        console.error(error);
                    });
                }
                
            },
            getStores(){
                axios.get(this.host + "Store/GetList").then(
                    response => {
                        this.stores = response.data;
                        this.SelectedStore = response.data[0].storeId;
                    });
            },
            updateStock(){
                
                axios.put(this.host + "Store/UpdateStock?itemId="+this.itemId+"&storeId="+this.SelectedStore+"&stock=" + this.modalQuantity).then(
                    response => {
                        alert("Stock Actualizado");
                    });
                    this.cerrarModal();
                    this.getItems();
            },
            async addItem(){
                
                const item = {
                    itemId: 0,
                    name: this.modalNombre,
                    description: this.modalDescripcion,
                    code: this.modalCode,
                    barcode: this.modalBarcode,
                    imageUrl: this.modalImg,
                    price: this.modalPrecio,
                    quantity: 0,
                    inventory: [],
                    categories: []
                }

                if(item.name === ""){
                    alert("Debe ingresar un nombre de Item");
                    return;
                }
                if (item.imageUrl.length > 300){
                    alert("La url de la imagen no puede tener mas de 300 digitos");
                    return;
                }

                await axios.post(this.host + "Item/CreateItem",item).then(
                    response =>{ 
                        this.response = response.data;
                        alert("Item Agregado");
                        this.cerrarModal();
                        this.getItems();
                    }
                ).catch(error =>{
                    console.error(error);
                });
            },
            UpdateItem(){

                const item = {
                    name: this.modalNombre,
                    description: this.modalDescripcion,
                    code: this.modalCode,
                    barcode: this.modalBarcode,
                    imageUrl: this.modalImg,
                    itemId: this.itemId,
                    price: this.modalPrecio,
                    quantity: 0,
                    inventory: [],
                    categories: []
                }

                if(item.name !== ""){

                    axios.put(this.host + "Item/UpdateItem",item).then(
                        response =>{ 
                            alert("Item Actualizado");
                            this.cerrarModal();
                            this.getItems();
                        }
                    ).catch(error =>{
                        console.error(error);
                    });
                }else alert("Debe ingresar un nombre de Item");
            },
            DeleteItem(){
                const id = this.itemId;
                axios.delete(this.host + "Item/DeleteItem/?id="+ id).then(
                    response =>{ 
                        console.log(response);
                        this.cerrarModal();
                        this.getItems();
                    }
                ).catch(error =>{
                    console.error(error);
                });
            },
            GetItem(item_id){
                this.itemId = item_id;
                const id = this.itemId;
                axios.get(this.host + "Item/GetItem?id=" + id).then(
                    response => {
                        const item = response.data;
                        this.modalNombre = item.name;
                        this.modalDescripcion = item.description;
                        this.modalCode = item.code;
                        this.modalBarcode = item.barcode;
                        this.modalImg = item.imageUrl;
                        this.modalPrecio = item.price;
                    }
                ).catch(error =>{
                    console.error(error);
                });
                axios.get(this.host + "Item/GetItemQuantity?item_id="+id+"&store_id=" + this.SelectedStore).then(
                    response => {
                        this.modalQuantity = response.data;
                    }
                ).catch(error =>{
                    console.error(error);
                    console.error("Error en GetItemQuantity");
                });
            },
            cerrarModal() {
                this.modalNombre= "";
                this.modalDescripcion= "";
                this.modalCode= "";
                this.modalBarcode= "";
                this.modalImg= "";
                this.modalPrecio = null;
                this.showModal = false;
                this.showModalC = false;
            },
            Agregar(){
                this.modalTitle = "AGREGAR";
                this.modalType = 'C'
                this.showModal = true;
            },
            Editar(id){
                localStorage.setItem('itemId', JSON.stringify(id));
                router.push("/EditItem");
            },
            agregarCant(id){
                this.modalType = 'U';
                this.modalStore = this.stores[this.SelectedStore - 1].name;
                this.showModalC = true;
                this.GetItem(id);
            },
            Visualizar(id){
                localStorage.setItem('itemId', JSON.stringify(id));
                router.push("/ItemView");
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

    *{
        overflow: hidden;
    }
</style>