<template>
  <div id="ListarRecetas">
    <br><br>

    <div v-if="recetas.length">
       <div class="container">
           <b-input class="mb-2 mr-sm-2 mb-sm-0" v-model="buscarReceta" placeholder="Buscar Receta" />
           <br>
           <b-button variant="info" v-on:click="buscarRecetaByName()">Buscar Receta</b-button>
           <b-button variant="secondary" v-b-modal.modalCreate>Crear Receta</b-button>
           <b-button variant="warning" v-on:click="getRecetas()">Mostrar Recetas</b-button>
       </div>
       <br><br>
      <div class="container" v-for="receta in recetas">
        <div v-if="editarActive === receta.id">
          <b-card :title="receta.name"
                  sub-title="Estas en el modo edición">
                  <form>
                    <b-form-input type="text"
                                  v-model="receta.name">
                    </b-form-input>
                    <br>
                    <b-form-input type="number"
                                  v-model="receta.preptime">
                    </b-form-input>
                    <br>
                    <b-form-input type="number"
                                  v-model="receta.difficulty">
                    </b-form-input>
                    <br>
                    <b-form-checkbox id="checkbox1"
                                     v-model="receta.vegetarian"
                                     value="true"
                                     unchecked-value="false">
                      Es Vegano
                    </b-form-checkbox>

                  </form>
                  <br><br>
              <b-button v-on:click="confirmarEditar(receta)" variant="info">Confirmar</b-button>
          </b-card>
        </div>
        <div v-else>
          <b-card :title="receta.name"
                  sub-title="Algunos datos">
                  <br>
              <p class="card-text">
                <b>Tiempo de preparacion:</b> {{ receta.preptime }} horas
              </p>
              <p class="card-text">
                <b>Nivel de Dificultad:</b> {{ receta.difficulty }}
              </p>
              <p v-if="receta.vegetarian" class="card-text">
                <b>Es Vegatariana:</b> Si
              </p>
              <p v-else class="card-text">
                <b>Es Vegatariana:</b> No
              </p>
              <br>
              <b-button v-on:click="editarActive = receta.id" variant="primary">Editar</b-button>
              <b-button v-on:click="deleteReceta(receta)" variant="danger">Eliminar</b-button>
          </b-card>
        </div>
        <br><br>
      </div>
    </div>
    <div v-else>
      <br><br>
      <b-jumbotron header="Ops!" lead="Error cargando las recetas" >
        <p>Revisa tu conexión a internet y vuelve a intentar</p>
        <b-btn variant="primary" v-on:click="reload()">Reintentar</b-btn>
      </b-jumbotron>
    </div>

    <!-- model-create -->
    <b-modal id="modalCreate"
             ref="myModalRef"
             title="Crea una receta"
             @ok="handleOk"
             @shown="clearForm">
      <form @submit.stop.prevent="handleSubmit">
        <b-form-group id="exampleInputGroup1"
                      label="Nombre:"
                      label-for="exampleInput1">
            <b-form-input type="text"
                          v-model="name">
            </b-form-input>
        </b-form-group>
        <br>
        <b-form-group id="exampleInputGroup1"
                      label="Tiempo de Preparacion:"
                      label-for="exampleInput1">
            <b-form-input type="number"
                          v-model="preptime">
            </b-form-input>
        </b-form-group>
        <br>
        <b-form-group id="exampleInputGroup1"
                      label="Dificultad:"
                      label-for="exampleInput1">
            <b-form-input type="number"
                          v-model="difficulty">
            </b-form-input>
        </b-form-group>
        <br>
        <b-form-checkbox id="checkbox1"
                         v-model="vegetarian"
                         value="true"
                         unchecked-value="false">
          Es Vegano
        </b-form-checkbox>
      </form>
    </b-modal>

  </div>
</template>

<script>

export default {

   name: "ListarRecetas",

   data: function(){
     return {
        recetas: [],
        name: String,
        preptime : String,
        difficulty: String,
        vegetarian: String,
        nombreRecetaBuscar: String,
        editarActive: null
      };
   },

   methods: {

    reload: function(){
      location.reload();
    },

    buscarRecetaByName: function (){
      if(this.buscarReceta != null)
      {
        fetch("http://localhost:8082/v1/recipes/" + this.buscarReceta, {
          method: "GET"
        })
        .then(response => response.json())
        .then((data) => {
          console.log(data);
          this.recetas = data;
        })
      }
      else {
        alert('Porfavor ingrese una receta valida')
      }

     },

    deleteReceta: function (receta){
      fetch("http://localhost:8082/v1/recipes/" + receta.id, {
        method: "DELETE"
      })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        this.getRecetas();
      })
    },

    updateReceta: function (receta){
      fetch("http://localhost:8082/v1/editRecipe/" + receta.id, {
        method: "POST",
        body: JSON.stringify({ name: receta.name, preptime: Number(receta.preptime), difficulty: Number(receta.difficulty), vegetarian: Boolean(receta.vegetarian) }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
      })
    },

    confirmarEditar: function (receta){
      if (!receta.name) {
        alert('Porfavor ingrese el nombre de la Receta');
      }
      else if (!receta.preptime) {
        alert('Porfavor ingrese el tiempo de preparacion');
      }
      else if (Number(receta.difficulty) > 3 || Number(receta.difficulty) < 1) {
        alert('La dificultad va de 1 a 3');
      }
      else
      {
        this.updateReceta(receta);
        this.editarActive = null;
      }
    },

    getRecetas() {
      fetch("http://localhost:8082/v1/recipes")
        .then(response => response.json())
        .then((data) => {
          this.recetas = data;
          console.log(data);
      })
    },


    //Create
    clearForm () {
      this.name = '';
      this.preptime = '';
      this.difficulty = '';
      this.vegetarian = '';
    },

    handleOk (evt) {
      evt.preventDefault()
      if (!this.name) {
        alert('Porfavor ingrese el nombre de la Receta');
      } else if (!this.preptime){
        alert('Porfavor ingrese el tiempo de preparacion');
      }
      else if (!this.difficulty){
        alert('Porfavor ingrese la dificultad');
      }
      else if (Number(this.difficulty) > 3){
        alert('Porfavor ingrese una dificultad entre 1 y 3');
      }
      else if (Number(this.difficulty) < 1){
        alert('Porfavor ingrese una dificultad entre 1 y 3');
      }
      else
      {
        this.handleSubmit();
      }

    },

    handleSubmit () {

      let lastId = this.recetas.length;
      let idGenerado = Number(lastId) + 1;

      fetch("http://localhost:8082/v1/recipes", {
        body: JSON.stringify({ id : idGenerado, name: this.name, preptime: Number(this.preptime), difficulty: Number(this.difficulty), vegetarian: Boolean(this.vegetarian)}),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'crossdomain': true,
        },
        proxy: {
      	  host: 'localhost',
      	  port: 8082
      	}
      })
      .then(response => response.json())
      .then((data) => {
        this.getRecetas();
        this.$refs.myModalRef.hide();
        alert('Receta creada con exito!');
      })

    }

  },

  mounted() {
    fetch("http://localhost:8082/v1/recipes")
      .then(response => response.json())
      .then((data) => {
        this.recetas = data;
    })
  }
}
</script>
