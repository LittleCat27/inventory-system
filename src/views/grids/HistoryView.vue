<template>
    <div class="row mt-4 mx-2">
        <h2 class="offset-lg-5">Historial</h2>
        <div class="d-flex flex-column">
            <h4 class="">Nombre del Item</h4>
            <div class="p-2"><input type="text" class="m-1 rounded text-center p-1" placeholder="Buscar por Nombre" v-model="filtro" @input="getItems()"></div>
        </div>

        
        <div class="col-lg-12">
            <div class="table-responsive rounded">
                <table class="table table-dark table-bordered table-hover">
                    <thead><tr><th>#</th><th>NOMBRE</th><th>PRECIO</th><th>ACTUALIZADO</th><th>ACCIONES</th></tr></thead>
                    <tbody class="table-ground-divider" id="contenido">
                        <tr v-for="ite, i in items" :key="i">
                            <td >{{ ite.itemId }}</td>
                            <td >{{ ite.name }}</td>
                            <td >{{ ite.price }}</td>
                            <td >{{ ite.lastUpdate }}</td>
                            <td class="col-2">
                                <button class="btn btn-info mx-2" @click="Eliminar(ite.itemId, ite.priceId)"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <div class="modal" v-if="this.modal === true" style="display: block;"> <!-- MODAL CRUD-->
      <div class="modal-content p-5 bg-dark">
        <h3 class="text-white">Esta a punto de eliminar un precio, ¿Continuar?</h3>
        <div class="content">
        </div>
        <div class="buttons mt-3">
            <button class="btn btn-danger mx-2"  @click="this.delete()"> Eliminar</button>
            <button class="btn btn-warning mx-2"  @click="close()">Volver</button>
        </div>
      </div>
    </div>

</template>

<script>
    import axios from 'axios';
    import { ref } from 'vue';
    import router from '@/router';

export default {
    data () {
        return {
            items: {},
            filtro:"",
            price: 0,
            item: 0,
            modal: false
        }
    },
    mounted(){
        this.emitter.emit('needLogin');
        this.getItems();
    },
    methods:{
        getItems(){
            axios.get(this.host + "History/GetList?filtro="+this.filtro).then(
                response => {
                    this.items = {}
                    this.items = response.data;
                });
        },
        Eliminar(item, price){
            this.item = item;
            this.price = price;
            this.modal = true;
        },
        close(){
            this.modal = false;
        },
        async delete(){
            const priceDelete = {
                itemId: this.item,
                priceId: this.price
            }
            console.log(priceDelete);
            await axios.delete(this.host + "History/Delete", {
                data:{
                    itemId: this.item,
                    priceId: this.price
                }}).then(
                response => {
                    console.log(response.data);
                    alert("Precio Eliminado");
                    this.close();
                }).catch(error =>{
                    console.error(error);
                });
                this.getItems();
        }
    }
}
</script>

<style lang="scss" scoped>

</style>