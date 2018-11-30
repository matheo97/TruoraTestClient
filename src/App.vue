<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="danger">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#">TruoraTest</b-navbar-brand>

    </b-navbar>

    <b-card overlay
        img-src="http://carnicos.com.co/files/recetas/header.jpg"
        img-alt="Card Image"
        text-variant="white">
    </b-card>

    <router-view/>

  </div>
</template>

<script>
  export default {
    name: 'App',

  }

</script>
