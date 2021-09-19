<template>
<div @click="showDetailInfo" class ="tasks" @dragstart="onDragStart($event, categoryId, index)" draggable="true" @drop="onDropTask($event, categoryId, index)" @dragover.prevent @dragenter.prevent>
    <!-- <button class="btn-remove-task" v-on:click="addToArchive">remove</button> -->
    <div class="header-name"><p>{{task.name}}</p>
         <button class="btn-remove-task" v-on:click="addToArchive($event, categoryId, index)">AddToArchive</button>
    </div>
    <p class="title-task-props">Implementer: {{task.implementer}}</p>
    <p class="title-task-props">Deadline: {{task.deadline}}</p>
</div>
<div v-show="showDetail" >
<button class="btn-close" @click="closeModel">Close</button>
<TaskDetail v-bind:index="index" v-bind:task="task"></TaskDetail>
</div>
</template>

<script>
import TaskDetail from './taskDetail.vue';

export default {
    name: "Task",
    props: ["task", "index", "categoryId"],
    inject: ["categories", "tasks", "archive", "data"],
    data: function() {
        return {
            showDetail: false,
            }
    },
    methods: {
        filterTasks: function(aTasks, sType) {
        return aTasks.filter(function(el) {
        return el.type === sType;
            })
        },

      addToArchive: function(event, categoryId, index){
            let taskIndex = this.tasks[index];
            this.$root.categories.find(el => el.id == categoryId).tasks.splice(index, 1)
            this.archive.tasks.push(taskIndex);

             fetch("http://localhost:3000/tasks", {
                    method: "PATCH",
                    mode: "cors",
                    body: JSON.stringify({categoryId, index})
             })
            event.stopPropagation();
        },

        showDetailInfo() {
        this.showDetail = true;
        },

        closeModel() {
        this.showDetail = false;
        fetch("http://localhost:3000/tasks", {
        method: "PUT",
        mode: "cors",
        body: JSON.stringify([this.task, this.index])
      }).then(oResponse => oResponse.ok ? alert("Задача сохранена") : alert("Ошибка"))
        },

        onDragStart(event, fromCategoryId, fromtaskIndex) {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('fromtaskIndex', fromtaskIndex);
            event.dataTransfer.setData('fromCategoryId', fromCategoryId);
      },

        onDropTask(event, toCategoryId, toTaskIndex) {
          const fromtaskIndex = parseInt(event.dataTransfer.getData('fromtaskIndex'))
          const fromCategoryId = event.dataTransfer.getData('fromCategoryId')
          let oToCategory = this.$root.categories.find(el => el.id == toCategoryId)
          let oFromCategory = this.$root.categories.find(el => el.id == fromCategoryId)
          oToCategory.tasks.splice(toTaskIndex, 1, oFromCategory.tasks.splice(fromtaskIndex, 1)[0], oToCategory.tasks.slice(toTaskIndex)[0]);

                fetch("http://localhost:3000/categories", {
                method: "PATCH",
                mode: "cors",
                body: JSON.stringify({toCategoryId, fromCategoryId, fromtaskIndex, toTaskIndex})
            })

       event.stopPropagation();
    },

    },

    components: {
      TaskDetail
    }

}
</script>

<style scoped>
    .tasks {
        display: flex;
        padding-left: 2px;
        justify-content: center;
        flex-wrap: wrap;
        flex-direction: column;
        width: 70%;
        height: 100px;
        color: white;
        font-size: 14px;
        border-radius: 10px;
        margin: 10px auto;
        text-align:center;
        background-color: rgb(75, 138, 180);
        -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
        -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
        box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
        cursor: pointer;

    }

    .btn-close {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        border: none;
        border-radius: 10px;
        width: 80px;
        height: 30px;
        box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
        -webkit-box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
        background-color: white;
        color: rgb(126, 125, 125);
    }

    .header-name{
        height: 15px;
        width: 95%;
        padding: 5px;
        align-items: center;
        font-weight: 900;
        font-size: 20px;
        display: flex;
        justify-content: space-between;
    }

    .title-task-props {
        margin: 10px 0px 0px 0px;
    }

    .btn-remove-task {
        font-size: 10px;
        width: 80px;
        height: 20px;
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
