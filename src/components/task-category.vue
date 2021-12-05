<template>
  <div
    class="categories"
    @drop="onDrop($event, category.id)"
    @dragover.prevent
    @dragenter.prevent
  >
    <button class="btn-delete" v-on:click="deleteCategory">X</button>
    <div class="category-header">{{ category.name }}</div>
    <div class="tasks">
      <Task
        v-bind:task="task"
        v-bind:index="index"
        v-bind:categoryId="category.id"
        v-bind:key="index"
        v-for="(task, index) in category.tasks"
      >
      </Task>
      <div class="add-new-task">
        <input v-model="newTaskName" type="text" />
        <button class="add-new" v-on:click="addNewTask">add New Task</button>
      </div>
    </div>
  </div>
</template>

<script>
import Task from "./task.vue";

export default {
  name: "TaskCategory",
  props: ["category"],
  inject: ["categories"],
  data: function() {
    return {
      newTaskName: "",
    };
  },
  provide: function() {
    return {
      tasks: this.category.tasks,
    };
  },

  methods: {
    // filterTasks: function(aTasks, sType) {
    //   return aTasks.filter(function(el) {
    //     return el.type === sType;
    //   });
    // },

    onDrop(event, toCategoryId) {
      const fromtaskIndex = parseInt(
        event.dataTransfer.getData("fromtaskIndex")
      );
      const fromCategoryId = event.dataTransfer.getData("fromCategoryId");
      let task = this.$root.categories
        .find((el) => el.id == fromCategoryId)
        .tasks.splice(fromtaskIndex, 1)[0];
      this.$root.categories
        .find((el) => el.id == toCategoryId)
        .tasks.push(task);

      fetch("http://localhost:3000/categories", {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({ toCategoryId, fromCategoryId, fromtaskIndex }),
      });
    },

    addNewTask: function() {
      if (!this.newTaskName) {
        alert("Введите название задачи");
      } else {
        (
          this.$root.categories.find((el) => el.id == this.category.id) || {}
        ).tasks.push({ name: this.newTaskName, type: this.category.id });
        fetch("http://localhost:3000/tasks", {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({
            name: this.newTaskName,
            type: this.category.id,
          }),
        }).then((oResponse) =>
          oResponse.ok ? alert("Задача сохранена") : alert("Ошибка")
        );
        this.newTaskName = "";
      }
    },

    deleteCategory: function() {
      let delCatIndex = this.$root.categories.findIndex(
        (el) => el.id == this.category.id
      );
      console.log(delCatIndex, "set");
      this.$root.categories.splice(delCatIndex, 1);

      fetch("http://localhost:3000/categories", {
        method: "DELETE",
        mode: "cors",
        body: JSON.stringify({
          id: this.category.id,
        }),
      }).then((oResponse) =>
        oResponse.ok ? alert("Категория удалена") : alert("Ошибка")
      );
    },
  },
  components: {
    Task,
  },
};
</script>

<style scoped>
.category-header {
  font-family: "Work Sans", sans-serif;
  color: rgb(82, 81, 81);
  font-size: 20px;
  text-align: center;
  margin: 10px auto;
  border: 1px solid rgb(255, 255, 255);
  border-radius: 6px;
  background-color: rgb(255, 254, 254);
  box-shadow: 0px -1px 26px -11px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px -1px 26px -11px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px -1px 26px -11px rgba(0, 0, 0, 0.75);
  width: 70%;
  padding: 10px;
}

.categories {
  padding: 10px;
  min-width: 250px;
  max-width: 270px;
  min-height: 100%;
  border: 1px solid rgb(223, 222, 222);
  border-radius: 10px;
  background-color: rgb(252, 247, 247, 0.6);
  margin: 10px;
  box-shadow: 0px 5px 10px 2px rgba(245, 245, 245, 0.2) inset;
}

.add-new {
  font-size: 10px;
  width: 100px;
  height: 30px;
  margin-top: 10px;
  border: none;
  border-radius: 10px;
  box-shadow: 0px -1px 26px -11px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px -1px 26px -11px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px -1px 26px -11px rgba(0, 0, 0, 0.75);
  background-color: white;
  color: rgb(126, 125, 125);
  cursor: pointer;
}

.btn-delete {
  font-size: 10px;
  width: 30px;
  border: none;
  border-radius: 10px;
  box-shadow: 0px -1px 26px -11px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px -1px 26px -11px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px -1px 26px -11px rgba(0, 0, 0, 0.75);
  background-color: white;
  color: rgb(126, 125, 125);
  cursor: pointer;
}

.add-new-task {
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 70%;
}

.add-new-task > input {
  border: 1px solid rgb(199, 198, 198);
  height: 20px;
  border-radius: 5px;
}

.tasks {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  color: white;
  font-size: 14px;
  border-radius: 10px;
  margin: 10px auto;
  text-align: center;
  cursor: pointer;
}
</style>
