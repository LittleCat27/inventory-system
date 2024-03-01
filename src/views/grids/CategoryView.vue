

<template>
    <div class="row">
        <h2 class="offset-lg-5">Categorias</h2>
        <div class="d-flex flex-row"> <!-- Div de Filtros -->
            <div class="p-2 mt-auto"><button class="btn btn-dark m-1" @click="agregar()">Agregar nueva categoria</button></div>
            <div class="p-2 mt-auto">
                <h5 class="my-auto fs-6">Filtro Nombre</h5>
                <input type="text" class=" text-center form-control form-control-lg p-1 fs-6" placeholder="Buscar por Nombre" v-model="filtro" @input="filterList()">
            </div>          
        </div>
        
        <div class="col-lg-12"> <!-- GRID -->
            <div class="table-responsive rounded">
                <table class="table table-dark table-bordered table-hover">
                    <thead><tr><th>#</th><th>NOMBRE</th><th>ACCIONES</th></tr></thead>
                    <tbody class="table-ground-divider" id="contenido">
                        <tr v-for="c, i in categories" :key="c.id">
                            <td>{{ c.id }}</td>
                            <td>{{ c.name }}</td>
                            <td class="col-2">
                                <button class="btn btn-info mx-2" @click="editar(c.id, c.name)"><i class="fas fa-pencil"></i></button>
                                <button class="btn btn-info mx-2" @click="eliminar(c.id, c.name)"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="modal" v-if="this.modal === true" style="display: block;"> <!-- MODAL CRUD-->
      <div class="modal-content p-5 bg-dark">
        <h3 v-if="this.isINS === true" class="text-white">Agregar Categoria</h3>
        <h3 v-if="this.isUPD === true" class="text-white">Actualizar Categoria</h3>
        <h3 v-if="this.isDLT === true" class="text-white">Eliminar Categoria</h3>
        <div class="content">
            <div class="row mt-3">
                <div class="col-6 m-auto"><span class="text-white">NOMBRE DE LA CATEGORIA</span></div>
            </div>
            <div class="row">
                <div class="col-6 m-auto"><input v-model="this.name" type="text" placeholder="Ingrese el nombre de la Categoria" class="col-12 border-solid borderw-3 px-1 rounded col-12 my-1"/></div>
            </div>
        </div>
        <div class="buttons mt-3">
            <button class="btn btn-warning mx-2" v-if="this.isINS === true"  @click="addCategory()">Agregar</button>
            <button class="btn btn-warning mx-2" v-if="this.isUPD === true"  @click="update()">Actualizar</button>
            <button class="btn btn-danger mx-2" v-if="this.isDLT === true"  @click="this.delete()"> Eliminar</button>
            <button class="btn btn-warning mx-2"  @click="close()">Volver</button>
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
                categories:{},
                fullList:{},
                filtro: "",
                modal: false,
                id: 0,
                name: "",
                isUPD: false,
                isINS: false,
                isDLT: false
            }
        },
        mounted(){
            this.emitter.emit('needLogin');
            this.getList();
        },
        methods:{
            filterList(){
                this.categories = this.fullList.filter(f => f.name.toLowerCase().includes(this.filtro.toLowerCase()));
            },
            async getList(){
                await axios.get(this.host + "Category/GetList?filtro=" + this.filtro).then(
                response => {this.fullList = response.data;
                    this.categories = this.fullList;
                    this.filterList();
                }).catch(error =>{
                    console.error(error);
                });
            },
            agregar(){
                this.isINS = true
                this.modal = true;
                this.name = "";
            },
            eliminar(id, name){
                this.id = id;
                this.name = name;
                this.isDLT = true
                this.modal = true;
            },
            async delete(){
                await axios.delete(this.host + "Category/Delete?id="+this.id).then(
                response => {
                    this.response = response.data;
                    console.log(this.response);
                    alert("Categoria Eliminada");
                    this.close();
                }).catch(error =>{
                    console.error(error);
                });
                this.getList();
            },
            editar(id, name){
                this.id = id;
                this.name = name;
                this.isUPD = true
                this.modal = true;
            },
            async update(){
                const category =
                {
                    id: this.id,
                    name: this.name
                }

                await axios.put(this.host + "Category/Update",category).then(
                response => {
                    this.response = response.data;
                    console.log(this.response);
                    alert("Categoria Actualizada");
                    this.close();
                }).catch(error =>{
                    console.error(error);
                });
                this.getList();
            },
            close(){
                this.modal = false;
                this.isUPD = false
                this.isINS = false
                this.isDLT = false
            },
            async addCategory(){

                const category =
                {
                    id: 0,
                    name: this.name
                }

                await axios.post(this.host + "Category/Create",category).then(
                response => {
                    this.response = response.data;
                    console.log(this.response);
                    alert("Categoria Agregada");
                    this.close();
                }).catch(error =>{
                    console.error(error);
                });
                this.getList();
            }
        }
    }
</script>
