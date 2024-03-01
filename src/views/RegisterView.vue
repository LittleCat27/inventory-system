<template>
    <div class="col d-flex justify-content-center py-lg-5">
      <div class="bg-dark text-white p-5 col-lg-6">
        <h3 class="text-cente mb-5">Registro Nuevo Usuario</h3>
        <form>

          <!-- Username input -->
          <div class="form-outline mb-4">
            <input type="email" v-model="usuario" class="form-control" />
            <label class="form-label" for="form2Example1">Usuario</label>
          </div>
          
            <!-- Email input -->
          <div class="row">
            <div class="col-md-6 form-outline mb-4">
              <input type="email" v-model="mail" class="form-control" />
              <label class="form-label" for="form2Example1">Correo Electronico</label>
            </div>

            <div class="col-md-6 form-outline mb-4">
              <input type="email" v-model="mailDuplicate" class="form-control" />
              <label class="form-label" for="form2Example1">Vuelva a ingresar Correo Electronico</label>
            </div>
          </div>
          

          <!-- Password input -->
          <div class="row">
            <div class="col-md-6 form-outline mb-4">
              <input type="password" v-model="password" v-on:keyup.enter="this.login()" class="form-control" />
              <label class="form-label" for="form2Example2">Contraseña</label>
            </div>

            <div class="col-md-6 form-outline mb-4">
              <input type="password" v-model="passwordDuplicate" v-on:keyup.enter="this.login()" class="form-control" />
              <label class="form-label" for="form2Example2">Vuelva a ingresar Contraseña</label>
            </div>
          </div>
          
  
          <!-- Submit button -->
          <button type="button" class="btn btn-primary btn-block mb-4 mx-auto flex" @click="this.register()">Registrarse</button>
  
          <!-- Register buttons -->
          <div class="text-center">
            <p>Ya tienes cuenta? <a href="" @click="login" >Inciar Sesion</a></p>
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
              mail: "",
              passwordDuplicate: "",
              mailDuplicate: ""
            }
          },
          mounted(){
          },
          methods:{
            login(){
              router.push("login");
            },
            register(){
              var regexMail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
              var regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

              if(this.usuario === ""){
                alert("Debe Ingresar un usuario");
                return;
              }
              if(this.mail === "" || !regexMail.test(this.mail)) {
                alert("Debe de ingresar un mail valido");
              return;
              }
              if(this.mail !== this.mailDuplicate) {
                alert("Los mails no coinciden");
                return;
              }
              if(this.password === "" || !regexPassword.test(this.password)){
                alert("Debe ingresar una Contraseña valida"); 
                return;
              }
              if(this.password !== this.passwordDuplicate){
                 alert("Las contraseñas no coinciden");
                 return;
              }

              const register = {
                mail: this.mail,
                password: this.password,
                user: this.usuario
              }

              axios.post(this.host + "Usuario/Register", register).then(
                response => {
                  alert(response.data);
                  router.push("login");
                }
              ).catch( e => console.error(e));
              
            }
          }
      }
  </script>