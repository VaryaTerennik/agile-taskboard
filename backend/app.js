const http = require('http');
const fs = require('fs');
const { SSL_OP_TLS_ROLLBACK_BUG } = require('constants');

http
  .createServer(function (request, response) {
    response.setHeader(
      'Content-Type',
      'text/html; charset=utf-8;'
    )
    response.setHeader(
        'Access-Control-Allow-Origin',
        '*'
      );

if(request.url === "/categories" && request.method === "GET") {
    fs.readFile("./data/categories.json", function(err, data){
        if(err) throw err;
        console.log(data)
        response.end(data, "utf-8");
        })
    }

    // if(request.url === "/tasks" && request.method === "GET") {
    //     fs.readFile("./data/categories.json", function(err, data){
    //         if(err) throw err;
    //         console.log(data)
    //         response.end(data, "utf-8");
    //         })
    //     }

    if(request.url === "/categories" && request.method === "POST"){
        let newData = '';
        request.on('data', chunk => newData += chunk);
        request.on('end', () => {
            fs.readFile("./data/categories.json", "utf-8", function(err, data){
                if(err) throw err;
                data = JSON.parse(data)
                data.categories.push(JSON.parse(newData))

                fs.writeFile("./data/categories.json", JSON.stringify(data), function() {

                })
                response.statusCode = "201";
                response.end()
                });            
        })
    }

    if(request.url === "/tasks" && request.method === "POST"){
        let newData = '';
        request.on('data', chunk => newData += chunk);
        request.on('end', () => {
            fs.readFile("./data/categories.json", "utf-8", (err, data) => {
                if(err) throw err;
                let aCategories = JSON.parse(data).categories;
                let oTask = JSON.parse(newData);
                (aCategories.find(oCategory => oCategory.id === oTask.type) || {}).tasks.push(oTask);
               
                fs.writeFile("./data/categories.json", JSON.stringify({categories: aCategories}), function() {

                })
                response.statusCode = "201";
                response.end()
                })
            })
    }

    // if(request.url === "/tasks" && request.method === "PUT"){
    //     let newData = '';
    //     request.on('data', index, chunk => newData += chunk);
    //     request.on('end', () => {
    //         fs.readFile("./data/categories.json", "utf-8", (err, data) => {
    //             if(err) throw err;
    //             let aCategories = JSON.parse(data).categories;
    //             let oTask = JSON.parse(newData);
    //             let sCategory = aCategories.find(oCategory => oCategory.id === oTask.type);

    //             sCategory.tasks.splice(sCategory.tasks.findIndex(oOldTask => oOldTask.name === oTask.name), 1, oTask);

    //             fs.writeFile("./data/categories.json", JSON.stringify({categories: aCategories}), function() {

    //             })
    //             response.statusCode = "200";
    //             response.end()
    //             })
    //         })
    // };

    if(request.url === "/tasks" && request.method === "PUT"){
        let newData = '';
        request.on('data', chunk => newData += chunk);
        request.on('end', () => {
            fs.readFile("./data/categories.json", "utf-8", (err, data) => {
                if(err) throw err;
                let aCategories = JSON.parse(data).categories;
                let oTask = JSON.parse(newData);
                let newDataTask = oTask[0];
                let index = oTask[1];
                let sCategory = aCategories.find(oCategory => oCategory.id === newDataTask.type);
                let set = sCategory.tasks[index];

                sCategory.tasks.splice(index, 1, newDataTask);

                fs.writeFile("./data/categories.json", JSON.stringify({categories: aCategories}), function() {

                })
                response.statusCode = "201";
                response.end()
                })
            })
    }


    // if(request.url === "/categories" && request.method === "PUT"){
    //     let newData = '';
    //     request.on('data', chunk => newData += chunk);
    //     request.on('end', () => {
    //         fs.readFile("./data/categories.json", "utf-8", function(err, data){
    //             if(err) throw err;
    //             data = JSON.parse(data)
    //             let newCategory = JSON.parse(newData);
    //             let sCategory = data.categories.findIndex(oCategory => oCategory.id === newCategory.id)
    //             data.categories.splice(sCategory, 1, newCategory);

    //             fs.writeFile("./data/categories.json", JSON.stringify(data), function() {

    //             })
    //             response.statusCode = "201";
    //             response.end()
    //             });            
    //     })
    // }

    if (request.method === "OPTIONS") {
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, PATCH");
        response.setHeader(
          'Access-Control-Allow-Origin',
          '*'
        );
        response.end();
      }

      if(request.url === "/categories" && request.method === "PATCH"){
        let newData = '';
        request.on('data', chunk => newData += chunk);
        request.on('end', () => {
            fs.readFile("./data/categories.json", "utf-8", function(err, data){
                if(err) throw err;
                data = JSON.parse(data);
                let newCategory = JSON.parse(newData);
                let oToCategory = newCategory[0];
                let fromtaskIndex = newCategory[2];
                console.log(fromtaskIndex);
                let toTaskIndex = newCategory[3];
                console.log(toTaskIndex);
                let oFromCategory = newCategory[1];
                let sCategory = data.categories.findIndex(oCategory => oCategory.id === oToCategory.id)
                let sEditCategory = data.categories.findIndex(oCategory => oCategory.id === oFromCategory.id)
                if(toTaskIndex) {
                    oToCategory.tasks.splice(toTaskIndex, 1, oFromCategory.tasks.splice(fromtaskIndex, 1)[0], oToCategory.tasks.slice(toTaskIndex)[0]);
                    // let set = oToCategory.tasks.slice(toTaskIndex)[0];
                    // console.log(set)
                    // oToCategory.tasks.splice(toTaskIndex, 1, oFromCategory.tasks.slice(fromtaskIndex)[0], oToCategory.tasks.slice(toTaskIndex)[0]);
                    // console.log(oToCategory)
                    // oFromCategory.tasks.splice(fromtaskIndex, 1);
                    // console.log(oFromCategory)
                } 
                else {
                    oToCategory.tasks.push(oFromCategory.tasks.splice(fromtaskIndex, 1)[0]);
                }
                data.categories.splice(sCategory, 1, oToCategory);
                data.categories.splice(sEditCategory, 1, oFromCategory);
                
                fs.writeFile("./data/categories.json", JSON.stringify(data), function() {

                })
                response.statusCode = "201";
                response.end()
                });            
        })
    }

    if(request.url === "/tasks" && request.method === "PATCH"){
        let newData = '';
        request.on('data', chunk => newData += chunk);
        request.on('end', () => {
            fs.readFile("./data/categories.json", "utf-8", (err, data) => {
                if(err) throw err;
                let aCategories = JSON.parse(data).categories;
                let aArchive = JSON.parse(data).archive;
                let oTask = JSON.parse(newData);
                let CategoryId = oTask[0];
                let index = oTask[1];
                let sCategory = aCategories.find(oCategory => oCategory.id === newDataTask.type);
                let set = sCategory.tasks[index];

                sCategory.tasks.splice(index, 1, newDataTask);

                fs.writeFile("./data/categories.json", JSON.stringify({categories: aCategories}), function() {

                })
                response.statusCode = "201";
                response.end()
                })
            })
    }

})
.listen(3000);