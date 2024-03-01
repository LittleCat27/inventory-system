

<template>
    <div class="row mt-4">
        <h2 class="offset-lg-5">Sucursales</h2>
        <div class="d-flex flex-row"> <!-- Div de Filtros -->
            <div class="p-2 mt-auto"><button class="btn btn-dark m-1" @click="agregar()">Agregar nueva Sucursal</button></div>
            <div class="p-2 mt-auto">
                <h5 class="my-auto fs-6">Nombre de Sucursal</h5>
                <input type="text" class=" text-center form-control form-control-lg p-1 fs-6" placeholder="Buscar por Nombre" v-model="name" @input="getStores()">
            </div>       
        </div>
        
        <div class="col-lg-12"> <!-- GRID -->
            <div class="table-responsive rounded">
                <table class="table table-dark table-bordered table-hover">
                    <thead><tr><th>#</th><th>NOMBRE</th><th>#</th><th>DIRECCIÓN</th><th>ACCIONES</th></tr></thead>
                    <tbody class="table-ground-divider" id="contenido">
                        <tr v-for="s in stores" :key="s.storeId">
                            <td>{{ s.storeId }}</td>
                            <td>{{ s.name }}</td>
                            <td>{{ s.addressId }}</td>
                            <td>{{ s.addressName }}</td>
                            <td class="col-2">
                                <button class="btn btn-info mx-2" @click="editar(s.storeId)"><i class="fas fa-pencil"></i></button>
                                <button class="btn btn-info mx-2" @click="eliminar(s.storeId)"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="modal" v-if="this.modal === true" style="display: block;"> <!-- MODAL CRUD-->
        <div class="modal-content p-5 bg-dark">
            <h3 v-if="this.isINS === true" class="text-white">Agregar Sucursal</h3>
            <h3 v-if="this.isUPD === true" class="text-white">Modificar Sucursal</h3>
            <h3 v-if="this.isDLT === true" class="text-white">Eliminar Sucursal</h3>
            <div class="content">
                <div class="row mt-3">
                    <div class="col-6 m-auto"><span class="text-white">NOMBRE DE LA SUCURSAL</span></div>
                </div>
                <div class="row">
                    <div class="col-6 m-auto"><input v-model="this.modalName" type="text" placeholder="Ingrese el nombre de la Sucursal" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/></div>
                </div>
                <div class="row">
                    <div class="col-6 m-auto"><span class="text-white">DIRECCIÓN</span></div>
                </div>
                <div class="row">
                    <div class="col-6 m-auto">
                    <select class="form-control form-control-lg fs-6" v-model="this.address">
                        <option v-for="(a, index) in addresses" :value="a.id" :key="index">{{ a.name }}</option>
                    </select>
                    </div>
                </div>
            </div>
            <div class="buttons mt-3">
                <button class="btn btn-warning mx-2" v-if="this.isINS === true"  @click="insert()">Agregar</button>
                <button class="btn btn-warning mx-2" v-if="this.isUPD === true"  @click="update()">Modificar</button>
                <button class="btn btn-danger mx-2" v-if="this.isDLT === true"  @click="this.delete()">Eliminar</button>
                <button class="btn btn-warning mx-2"  @click="close()">Volver</button>
            </div>
        </div>
    </div>

</template>

<script scoped >
  import axios from 'axios';
  import { ref } from 'vue';
  import router from '@/router';
import store from '@/store';

  export default {
      data(){
          return{
              stores: [],
              name: "",
              modalName: "",
              modalId: "",
              isINS: false,
              isUPD: false,
              isDLT: false,
              modal: false,
              addresses: [],
              address: 0
          }
      },
      mounted(){
            this.emitter.emit('needLogin');
            this.getStores();
            this.getAddresses();
      },
      methods:{
            getAddresses(){
                axios.get(this.host + "Store/GetAddressList").then(
                    response => {
                        this.addresses = response.data;
                        this.address = response.data[0].id;
                    }).catch(error =>{
                        console.error(error);
                });
            },
            getStores(){
                axios.get(this.host + "Store/GetList?filtro="+ this.name).then(
                    response => {
                        this.stores = response.data;

                    }).catch(error =>{
                        console.error(error);
                });
            },
            agregar(){
                this.modal = true;
                this.isINS = true;
            },
            editar(id){
                this.loadModal(id)
                this.isUPD = true;
            },
            eliminar(id){
                this.loadModal(id)
                this.isDLT = true;
            },
            async delete(){
                await axios.delete(this.host + "Store/Delete?id="+this.modalId).then(
                    response =>{
                        alert("Se elimino la sucursal correctamente");
                        this.close();
                        this.getStores();
                    }).catch(error => {
                            console.error(error);
                    });
            },
            loadModal(id){
                this.modal = true;
                this.modalId = id;
                const s = this.stores.filter(i => i.storeId === id)[0];
                console.log(id);
                this.modalName = s.name;
                this.address = s.addressId
            },
            close(){
                this.modalName = "";
                this.modal = false;
                this.isDLT = false;
                this.isINS = false;
                this.isUPD = false;
            },
            insert(){
                const store = {
                    storeId: 0,
                    name: this.modalName,
                    addressId: this.address,
                    addressName: ""
                }
                axios.post(this.host + "Store/Create", store).then(
                    response => {
                        alert("Se genero una nueva sucursal");
                        this.close();
                        this.getStores();
                    }).catch(error => {
                            console.error(error);
                    });
            },
            update(){
                const store = {
                    storeId: this.modalId,
                    name: this.modalName,
                    addressId: this.address,
                    addressName: ""
                }
                axios.put(this.host + "Store/Update", store).then(
                    response => {
                        alert("Se actualizo la sucursal");
                        this.close();
                        this.getStores();
                    }).catch(error => {
                            console.error(error);
                    });
            }
      }
  }
</script>
