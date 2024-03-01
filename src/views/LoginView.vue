<template>
    <div class="row py-lg-5">
      <div class="col-lg-6 offset-lg-1 bg-dark  border border-white rounded py-5 d-none d-lg-block"><img class="rounded" style="width: 100%;" src="../assets/Inventory.jpg" alt="Imagen de Inventario" ></div>
      <div class="bg-dark text-white p-5 col-lg-3 offset-lg-1">

        <h3 class="text-cente mb-3">Login</h3>
        <form>
          <!-- Email input -->
          <div class="form-outline mb-4">
            <input type="email" v-model="usuario" class="form-control" @change="this.failed = false" />
            <label class="form-label" for="form2Example1">Usuario o Correo Electronico</label>
          </div>
  
          <!-- Password input -->
          <div class="form-outline mb-4">
            <input type="password" v-model="password" v-on:keyup.enter="this.login()" @change="this.failed = false" class="form-control" />
            <label class="form-label" for="form2Example2">Contraseña</label>
          </div>
  
          <!-- 2 column grid layout for inline styling -->
          <div class="row mb-4">
            <div class="col d-flex justify-content-center">
              <!-- Checkbox -->
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
                <label class="form-check-label" for="form2Example31">Recordarme</label>
              </div>
            </div>
  
            <div class="col">
              <!-- Simple link -->
              <a href="#!">Contraseña Olvidada?</a>
            </div>
          </div>
  
          <!-- Submit button -->
          <p v-if="this.failed" v-text="this.errorText" class="text-danger"></p>
          <button type="button" class="btn btn-primary btn-block mb-4 mx-auto flex" @click="this.login()">Iniciar Sesion</button>
  
          <!-- Register buttons -->
          <div class="text-center">
            <p>No tienes cuenta? <a href="" @click="register()">Registrarse</a></p>
            <p>o inicia sesion con:</p>
            <button type="button" class="btn btn-link btn-floating mx-1">
              <i class="fab fa-facebook-f"></i>
            </button>
  
            <button type="button" class="btn btn-link btn-floating mx-1">
              <i class="fab fa-google"></i>
            </button>
  
            <button type="button" class="btn btn-link btn-floating mx-1">
              <i class="fab fa-twitter"></i>
            </button>
  
            <button type="button" class="btn btn-link btn-floating mx-1">
              <i class="fab fa-github"></i>
            </button>
          </div>
      </form>
    </div>
  </div>
  
  </template>
  <script>
      import router from '@/router';
      import axios from 'axios';
      export default {
          data(){
            return{
              usuario: "",
              password: "",
              loginTry: {},
              failed: false,
              errorText: ""
            }
          },
          mounted(){
          },
          methods:{
            async login(){

              if(this.usuario === ""){
                this.errorText ="Debe Ingresar un usuario o mail";
                this.failed = true;
                return;
              }
              if(this.password === ""){
                this.errorText = "Debe ingresar una Contraseña"; 
                this.failed = true;
                return;
              }

              const login = {
                user: this.usuario,
                password: this.password
              }
              await axios.post(this.host + "Usuario/Login", login).then(
                  response => {
                    this.loginTry = response.data;
                      if(this.loginTry !== null && this.loginTry.loginOK === 1){
                        localStorage.setItem('login', JSON.stringify(this.loginTry));
                         router.push("inventory")
                        }else
                        {
                          this.errorText = "Usuario o Contraseña Incorrecto";
                          this.failed = true;
                        } 
                  })
                  .catch(error =>{
                    console.error(error)
                  });
            },
            register(){
              this.$router.push("Register");
            }
          }
      }
  </script>