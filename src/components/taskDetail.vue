<template>
 
    <div class="popup-background">
        <div class="edit-popup">
             <button class="btn-edit" v-on:click="showEditPopup=!showEditPopup">{{showEditPopup?'Save':'Edit'}}</button> 
            <div class="popup"> 
                <div class="header"><p class="title-item">Title:</p> <p class="title-props">{{task.name}}</p></div>
                <div  class="item"><p class="title-item">Author:</p> <p class="title-props">{{task.author}}</p></div>
                <div class="item"><p class="title-item">Implementer:</p><p class="title-props">{{task.implementer}}</p></div>
                <div class="item"><p class="title-item">Difficalty:</p><p class="title-props">{{task.difficulty}}</p></div>
                <div class="item"><p class="title-item">Deadline:</p><p class="title-props">{{task.deadline}}</p></div>
                <div class="item">Description: <p class="title-props title-description">{{task.description}}</p></div>
            </div>
        </div>
    </div>
    <div v-show="showEditPopup" class="popup-background-edit-popup">
        <div class="edit-popup">
             <button class="btn-edit" v-on:click="showEditPopup=!showEditPopup">{{showEditPopup?'Save':'Edit'}}</button> 
            <div class="popup edit-background">
                <div class="header">Title: {{task.name}}</div>
                <input type="text" v-model="taskData.name" />
                <div class="item">Author: {{task.author}}</div>         
                <input type="text" v-model="taskData.author" />
                <div class="item">Implementer: {{task.implementer}}</div>
                <input type="text" v-model="taskData.implementer" />
                <div class="item">Difficalty: {{task.difficulty}}</div>
                <input type="text" v-model="taskData.difficulty" />
                <div class="item">Deadline: {{task.deadline}}</div>
                <input type="text" v-model="taskData.deadline" />
                <div class="item">Description:</div>
                <input type="text" v-model="taskData.description" />
            </div>
        </div>
    </div>
</template>

<script>  

export default {
    name: "TaskDetail",
    props: ["task", "index"],
    inject: ["tasks", "categories"],
        computed: {
    taskData: function () {
      return this.tasks[this.index];
        }
    },
     data: function() {
        return { 
            showEditPopup: false,
            }
    },
    methods: {
    },
}   
</script>

<style>
    
    .popup-background, .popup-background-edit-popup {
        position: fixed;
        display:flex;
        justify-content:center;
        align-items:center;
        top:0;
        right:0;
        left:0;
        bottom:0;
        background-color:rgb(133, 108, 108, 0.5)
    }


    .popup {
        font-family: 'Work Sans', sans-serif;
        color: rgb(82, 81, 81);
        background: white;
        display: flex;
        justify-content:center;
        flex-wrap: wrap;
        flex-direction:column;
        border: 1px solid rgb(221, 221, 221);
        box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
        -webkit-box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
        border-radius: 10px;
        background-image: url(https://www.pngitem.com/pimgs/m/113-1133286_national-institute-of-engineering-symbol-hd-png-download.png);
    }

    .edit-background {
         background-position: left;
    }

    .edit-popup {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        flex-direction:column;
        justify-content:center;
        width: 640px;
        height: 530px;
        background-color: white;
        border: 1px solid rgb(221, 221, 221);
        border-radius: 10px;
    }

    .edit-popup > .popup {
        margin: auto;
        width: 90%;
        height: 80%;
    }

  
    .btn-close {
        position: fixed;
        top: 20px;
        right: 20px;
    }

    .btn-edit {
        position: absolute;
        top: 10px;
        right: 30px;
        z-index: 999;
        border: none;
        border-radius: 10px;
        width: 80px;
        height: 30px;
         box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
        -webkit-box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px -1px 26px -11px rgba(0,0,0,0.75);
        color: white;
        background-color: rgb(168, 168, 168);
    }

    .header {
        font-weight: 700;
        align-items: center;
        width: 80%;
        margin-left: 40px;
        display: flex;
        justify-content: space-between;
        }

    .title-props {
        border: 1px solid rgb(189, 189, 189);
        border-radius: 5px;
        width: 70%;
        height: 25px;
        margin-top: 5px;
        margin-bottom: 5px;
        padding-left: 10px;
        background: white;
        opacity: 0.8;
        padding-top: 5px;
        
    }

    .title-description {
        width: 80%;
        height: 60px;
    }

    .item {
        width: 80%;
        margin-left: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .item:last-child {
        margin-top: 10px;
        width: 100%;
        margin-left: 40px;
        display: block;
    }

    .popup > input {
        border: 1px solid rgb(189, 189, 189);
        border-radius: 5px;
        width: 70%;
        height: 30px;
        margin-top: 5px;
        margin-bottom: 5px;
        margin-left: 30px;
        background: white;
        opacity: 0.8;
        padding-left: 10px;
    }

    .popup > input:last-child {
         width: 90%;
        height: 50px;
    }

</style>