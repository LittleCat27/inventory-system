<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand px-2" href="#">Inventarios Joaco</a>
    <div class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <router-link to="/" class="nav-link" href="#">Inicio <span class="sr-only">(current)</span></router-link>
            </li>
            <li v-if="this.mostrar" class="nav-item">
                <router-link to="/inventory" class="nav-link" href="#">Inventario</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/catalog" class="nav-link" href="#">Catalogo</router-link>
            </li>
            <li v-if="this.mostrar" class="nav-item">
                <router-link to="/store" class="nav-link" href="#">Sucursales</router-link>
            </li>
            <li v-if="this.mostrar" class="nav-item">
                <router-link to="/history" class="nav-link" href="#">Historial Precios</router-link>
            </li>
            <li v-if="this.mostrar" class="nav-item">
                <router-link to="/categories" class="nav-link" href="#">Categorias</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/about" class="nav-link" href="#">Acerca de</router-link>
            </li>
        </ul>
        <p v-if="this.mostrar" style="cursor: pointer ;" to="/" @click="closeSession()" class="nav-link text-center my-auto text-secondary px-3" href="#">Cerrar Sesion</p>
        <p v-if="!this.mostrar" style="cursor: pointer ;" to="/" @click="$router.push('login')" class="nav-link text-center my-auto text-secondary px-3" href="#">Iniciar Sesion</p>
    </div>
    </nav>
    
    
</template>


<script>
import router from '@/router';

    export default {
        data(){
            return{
                login: JSON.parse(localStorage.getItem('login')) || {},
                mostrar: false
            }
        },
        mounted(){
            if (this.login.loginOK !== 1) this.mostrar = false;
            else this.mostrar = true;
            this.emitter.on('needLogin', () => {
                this.checkLogin();
            });
            this.emitter.on("isLogged", () =>{
                this.canSeeNavbarOptions();
            });
        },
        methods: {
            closeSession(){
                localStorage.removeItem('login');
                this.login = null;
                this.mostrar = false;
                router.push("/login");
            },
            canSeeNavbarOptions(){
                this.login = JSON.parse(localStorage.getItem('login'));
                if (this.login === null) {
                    this.mostrar = false;
                    return;
                }
                if (this.login.loginOK !== 1) this.mostrar = false;
                else this.mostrar = true;
            },
            checkLogin(){
                this.canSeeNavbarOptions();
                if (this.login === null) 
                {
                    router.push("/login");
                    return;
                }
                if (this.login.loginOK !== 1) router.push("/login");
            }
        }
        
    }
</script>

<style scoped>
    .mr-auto{
        margin-right: auto!important;
    }
</style>