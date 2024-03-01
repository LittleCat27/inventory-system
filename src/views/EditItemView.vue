<template>

    <div class="p-3 bg-dark px-5">
    <div class="content" >
        <div class="row">
            <div class="col-6"><span class="text-white">Nombre del Item</span></div>
        </div>
        <div class="d-flex flex-row mb-2"> 
            <input class="fs-18 border-solid border borderw-3 m-1 rounded p-2 em-2" v-on:change="this.btnUPD = true" v-model="this.itemName"/>
        </div>
        <div class="row">
            <div class="col-lg-4 row ">

                <div>
                    <input type="file"  name="image" id="image" @change="onImageChange" accept="image/*" style="display: none;" >
                    <!--button type="submit" class="btn btn-sm btn-primary" @click.prevent="Submit()"> Submit</button-->
                    <label class="p-3" for="image">
                        <img class="bg-white rounded border border-black" style="width: 90%;" v-if="this.itemImage !== null && this.itemImage !== ''" :src="this.itemImage" alt="Imagen">
                    </label>
                </div>

                <!-- Categorias del Item -->
                <div>
                    <div class="d-flex flex-row">
                        <h4 class="text-white">Categorias</h4>
                    </div>
                    <div class="d-flex flex-row my-2">
                        <select class="form-control form-control-lg fs-6 ml-2" v-model="this.category">
                            <option v-for="(c, index) in categories" :value="c.id" :key="index">{{ c.name }}</option>
                        </select>
                        <button class="btn btn-info mx-2" v-if="this.category !== 0" v-on:click="this.addSelected()"><i class="fas fa-add"></i></button>
                    </div>
                    <div class="row mt-2 px-3">
                        <table class="table table-dark table-bordered table-hover ml-2">
                            <tbody class="table-ground-divider" id="contenido">
                                <tr class="table-active" v-for="(c, index) in selectedCategory" :key="c.id">
                                    <td class="text-center" style="font-size: 1.2em;">{{ c.name }}</td>
                                    <td class="col-2">
                                        <button class="btn btn-info mx-2" @click="delSelected(c.id)"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-8">
                    
                <div class="row mt-3">
                    <div class="col-6"><span class="text-white">Detalle</span></div>
                    <div class="col-12"><input v-on:change="this.btnUPD = true" v-model="this.itemDescription" type="text" placeholder="Descripcion" class="border-solid border borderw-3 m-1 rounded row col-12 p-2"/></div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <span class="text-white">CODIGO</span>
                        <input v-on:change="this.btnUPD = true" v-model="this.itemCode" type="number" placeholder="Code" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/>
                    </div>
                    <div class="col-lg-6">
                        <span class="text-white">URL IMAGEN</span>
                        <input v-on:change="this.btnUPD = true" v-model="this.itemImage" type="text" placeholder="ImageUrl" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <span class="text-white">CODIGO BARRA</span>
                        <input v-on:change="this.btnUPD = true" v-model="this.itemBarcode" type="text" placeholder="Barcode" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/>
                    </div>
                    <div class="col-lg-6">
                        <span class="text-white">PRECIO</span>
                        <input v-on:change="this.btnUPD = true" v-model="this.itemPrice" type="text" placeholder="Precio" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/>
                    </div>
                </div>
                <div class="row">
                    <p class="text-white em-2" placeholder="Cantidad" type="text" v-text="'Cantidad Disponible '+this.quantity"></p>
                    <select class="form-control form-control-lg fs-6 ml-2" v-model="this.store" v-on:change="this.getStoreInfo()">
                        <option v-for="(i, index) in stores" :value="i.storeId" :key="index">{{ i.name }}</option>
                    </select>
                    <div class="d-flex">
                        <p class=" text-white em-2 my-auto" placeholder="Cantidad" type="text" v-text="'Sucursal '+this.storeAddress + ' - Cantidad: '"></p>
                        <div class="p-3">
                            <input v-model="this.storeQuantity" v-on:change="this.changeStoreQuantity()" type="number" class="em-2 text-center"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="buttons mt-3">
            <button class="btn btn-warning mx-2" @click="this.open()">Eliminar</button>
            <button class="btn btn-warning mx-2" v-if="this.btnUPD" @click="this.UpdateItem()">Guardar Cambios</button>
            <button class="btn btn-warning mx-2" v-if="this.btnUPD" @click="this.revertChanges()">Revertir Cambios</button>
            <button class="btn btn-warning mx-2" @click="$router.go(-1)">Volver</button>
        </div>

        <div class="modal" v-if="this.modal === true" style="display: block;"> <!-- MODAL CRUD-->
            <div class="modal-content p-5 bg-dark">
                <h3 class="text-white">Presione Continuar para eliminar el item</h3>
                <div class="buttons mt-3">
                    <button class="btn btn-danger mx-2" @click="this.delete()">Eliminar Item</button>
                    <button class="btn btn-warning mx-2"  @click="close()">Cancelar</button>
                </div>
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
                itemId: 0,
                itemName: "",
                itemDescription: "",
                itemPrice: 0,
                itemImage:"",
                itemCode: "",
                itemBarcode: "",
                categoryList: {},
                categories: {},
                selectedCategory: [],
                idList: [],
                filtro: "",
                category: {},
                btnUPD: false,
                storeQuantity: 0,
                inventory: [],
                store: 0,
                quantity: 0,
                storeAddress: "",
                storeName: "",
                modal: false,
                file: {}
            }
        },
        async mounted(){
            this.emitter.emit('needLogin');
            this.itemId = localStorage.getItem('itemId');
            await this.GetItem();
            await this.getStores();
            this.getCategoryList();
            this.getStoreInfo();
        },
        methods:{
            onImageChange(e){
                this.file = e.target.files[0];
                this.itemImage = URL.createObjectURL(this.file);
                this.btnUPD = true;
            },
            open(){
                this.modal = true;
            },
            close(){
                this.modal = false;
            },
            getStoreInfo(){
                this.storeQuantity = 0;
                this.storeAddress = this.stores.filter(i => i.storeId === this.store)[0].addressName;
                this.storeName = this.stores.filter(i => i.storeId === this.store)[0].name;
                if (this.inventory === null || this.inventory.length === 0 || this.inventory.filter(i => i.storeId === this.store).length === 0) return;
                this.storeQuantity = this.inventory.filter(i => i.storeId === this.store)[0].quantity;
            },
            changeStoreQuantity(){
                this.btnUPD = true;
                if (this.inventory.filter(i => i.storeId === this.store).length === 0) {
                    const inv = {
                        storeId: this.store,
                        storeName: this.storeName,
                        quantity: this.storeQuantity
                    }
                    this.inventory.push(inv);
                }
                this.inventory.filter(i => i.storeId === this.store)[0].quantity = this.storeQuantity;
                this.quantity = 0;
                this.inventory.forEach(i => this.quantity += i.quantity);
            },
            updateCategories(){
                const item = {
                    id: this.itemId,
                    categories: this.idList
                }
                axios.put(this.host + "Item/UpdateCategory",item).then(
                    response => {this.btnUPD = false;}
                    ).catch(error =>{console.error(error);});
            },
            delSelected(id){
                this.selectedCategory = this.selectedCategory.filter(f => f.id != id);
                this.idList = this.idList.filter(f => f != id);
                this.btnUPD = true;
            },
            addSelected(){
                if (this.selectedCategory === null) this.selectedCategory = [];
                if (this.selectedCategory.filter(f => f.id === this.category).length > 0) return;
                this.selectedCategory.push(this.categories.filter(f => f.id === this.category)[0]);
                this.idList.push(this.category);
                this.btnUPD = true;
            },
            filterCategoryList(){
                const emptyItem = {
                    id: 0,
                    name: "Agregar una categoria"
                }
                this.categories = (this.categoryList.filter(f => f.name.toLowerCase().includes(this.filtro.toLowerCase())));
                this.categories.unshift(emptyItem);
                this.category = 0
                
            },
            async getCategoryList(){
                await axios.get(this.host + "Category/GetList?filtro=" + this.filtro).then(
                response => {this.categoryList = response.data;
                    this.categories = this.categoryList;
                    this.filterCategoryList();
                }).catch(error =>{console.error(error);});
            },
            async GetItem(){
                await axios.get(this.host + "Item/GetItem?id=" + this.itemId).then(
                    response => {
                        const item = response.data;
                        if (item.itemId === 0 ) this.$router.push("/catalog");
                        this.itemName = item.name;
                        this.itemDescription = item.description;
                        this.itemCode = item.code;
                        this.itemBarcode = item.barcode;
                        this.itemImage = item.imageUrl;
                        this.itemPrice = item.price;
                        this.selectedCategory = item.categories;
                        this.quantity = item.quantity;
                        this.inventory = item.inventory;
                        if (this.selectedCategory !== null)
                        this.selectedCategory.forEach(element => {
                            this.idList.push(element.id);
                        }); 
                        this.btnUPD = false;
                    }
                ).catch(error =>{console.error(error);});
            },
            async revertChanges(){
                await this.GetItem();
                await this.getCategoryList();
                await this.getStores();
                await this.getStoreInfo();
                this.file = {};
            },
            async getStores(){
                await axios.get(this.host + "Store/GetList").then(
                    response => {
                        this.stores = response.data;
                        this.store= response.data[0].storeId;
                    });
            },
            updateStock(){
                this.inventory.forEach(i => {
                    axios.put(this.host + "Store/UpdateStock?itemId="+this.itemId+"&storeId="+i.storeId+"&stock=" + i.quantity).then(
                    response => {}).catch(error => console.error(error));
                });
                
            },
            async UpdateItem(){

                this.updateStock();
                this.updateCategories();

                /*
                let fd = new FormData();

                fd.append('image', this.file);
                fd.append('itemId', this.itemId);
                fd.append('imageName', "");
                fd.append('imageUrl', "");

                await axios.post(this.host + "Item/UploadImage", fd).then(
                    response => {
                        console.log(response.data);
                        const info = response.data;
                        this.itemImage = info.imageUrl;
                    }).catch(e => console.error(e));
                    */

                const item = {
                    name: this.itemName,
                    description: this.itemDescription,
                    code: this.itemCode,
                    barcode: this.itemBarcode,
                    imageUrl: this.itemImage,
                    itemId: this.itemId,
                    price: this.itemPrice,
                    quantity: 0,
                    inventory: [],
                    categories: []
                }
                
                    
                axios.put(this.host + "Item/UpdateItem",item).then(
                    response =>alert("Item Actualizado")).catch(error =>console.error(error));

                this.getStores();
                this.getStoreInfo();
            },
            delete(){
                const id = this.itemId;
                axios.delete(this.host + "Item/DeleteItem/?id="+ id).then(
                    response =>{
                        alert("Item Eliminado");
                        this.$router.push("/catalog");
                    }).catch(error =>console.error(error));
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