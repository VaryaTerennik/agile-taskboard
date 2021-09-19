<template>
 <div id="app">
    <div class="flex-container">
      <TaskCategory  v-for="category in categories" v-bind:key="category.id" v-bind:tasks="tasks" v-bind:category="category" >
      </TaskCategory>
      <div class = "add-new-category">New category
        <input v-model="newCategoryName" type="text"/>
        <button class="add-new" v-on:click="addNewCategory">add New Category</button>
         <div id="archive">
        <button class="btn-show-arch" @click="showArchiveInfo">show Archive</button>
        <div class="arc-show" v-show="showArchive">
        <Archive @click="closeArchive" v-bind:archive="archive" v-bind:tasks="archive.tasks"></Archive>
        </div>
      </div>
      </div>
      <!-- <div id="archive">
        <button class="btn-show-arch" @click="showArchiveInfo">Show Archive</button>
        <div class="arc-show" v-show="showArchive">
        <Archive @click="closeArchive" v-bind:archive="archive" v-bind:tasks="archive.tasks"></Archive>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>

import TaskCategory from './components/task-category.vue';
import Archive from './components/archive.vue'

export default {
  name: 'App',
  data: function() {
    return {
    showArchive: false,
    categories: [],
    archive: [],
    // {name: "Archive", id: "archive", tasks:[
    //               {
    //             name: "Task8",
    //             author: "",
    //             implementer: "",
    //             difficulty: "",
    //             deadline: "",
    //             description: "",
    //             type: "done"
    //           },
    //           {
    //             name: "Task10",
    //             author: "",
    //             implementer: "",
    //             difficulty: "",
    //             deadline: "",
    //             description: "",
    //             type: "done"
    //           },
    //           ]},
    categoryCounter: 0,
    newCategoryName: "",
    taskCounter: 0,
    newTaskName: "",
    newTaskType: "",
    }
  },
  provide: function () {
    const data = {}
    Object.defineProperty(data, 'archive', {
      enumerable: true,
      get: () => this.archive,
    })
    Object.defineProperty(data, 'categories', {
      enumerable: true,
      get: () => this.categories,
    })
    return {
      categories: this.categories,
      archive: this.archive,
      data,
    }
},
  components: {
    TaskCategory,
    Archive
  },
  methods: {
    addNewCategory: function(){
      if(!this.newCategoryName) {
        alert("Введите название категории")
      } else {
      this.$root.categories.push({name: this.newCategoryName, id: this.categoryCounter, tasks: []})
      console.log({name: this.newCategoryName, id: this.categoryCounter, tasks: []})
              fetch("http://localhost:3000/categories", {
              method: "POST",
              mode: "cors",
              body: JSON.stringify({name: this.newCategoryName, id: this.categoryCounter, tasks: []})
            }). then(oResponse => oResponse.ok ? alert ("Категория сохранена") : alert ("Ошибка"));
      this.categoryCounter ++;
      this.newCategoryName = "";
      }

    },

  getArchive: function(){
     let oReq = fetch("http://localhost:3000/archive", {
        mode: "cors"
      });

      return oReq
      .then(oResponse => oResponse.json())
      .then(oResponse => this.archive = oResponse.archive)

    },

    getCategories: function(){
     let oReq = fetch("http://localhost:3000/categories", {
        mode: "cors"
      });

      return oReq
      .then(oResponse => oResponse.json())
      .then(oResponse => this.categories = oResponse.categories)

    },

    showArchiveInfo() {
        this.showArchive = true;
        },

     closeArchive() {
        this.showArchive = false;
        },

    // onDrop(event, toCategoryId) {
    //   const fromtaskIndex = parseInt(event.dataTransfer.getData('fromtaskIndex'))
    //   const fromCategoryId = parseInt(event.dataTransfer.getData('fromCategoryId'))
    //   if(toCategoryId == fromCategoryId) {

    //   } else {
    //     let task = this.categories.find(el => el.id == fromCategoryId).tasks.splice(fromtaskIndex, 1)
    //     this.categories[toCategoryId].tasks.push(task);
    //   }
    // }
  },

   created: function(){
      let der = this.getCategories();
      console.log(der)
      let set = this.getArchive();
      console.log(set)
    }

}

</script>

<style scoped>

.task-category {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tasks-container > .tasks {
    width: 300px;
    margin: 20px;
}

.flex-container {
  display: flex;
  min-height: 100vh;
  background-color: rgb(160, 207, 221);
  background-image: url(https://www.pngitem.com/pimgs/m/113-1133286_national-institute-of-engineering-symbol-hd-png-download.png);
  background-repeat: no-repeat;
  background-size: cover;
  font-family: 'Work Sans', sans-serif;
  color: rgb(82, 81, 81);
}

.btn-close-arch {
  z-index: 1000;
}


.add-new-category {
  display: flex;
  flex-direction: column;
  margin: 10px;
}

.add-new-category > input {
  border: 1px solid rgb(199, 198, 198);
  height: 20px;
  border-radius: 5px;
}

.add-new, .btn-show-arch {
  font-size: 10px;
  width: 150px;
  height: 30px;
  margin-top: 10px;
  font-family: 'Work Sans', sans-serif;
  border: none;
  border-radius: 10px;
  box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
  -webkit-box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
  background-color: white;
  color: rgb(126, 125, 125);
  cursor: pointer;
}
</style>
<style>
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@200;300;400;700;800;900&display=swap');
</style>
