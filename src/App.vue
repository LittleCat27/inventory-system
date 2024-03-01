<template>
  <Navbar />
  <div class="container-fluid" style="--bs-gutter-x: 0;"><router-view/></div>
</template>


<script>
import Navbar from './components/Navbar';

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>