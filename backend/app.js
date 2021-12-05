const http = require("http");
const fs = require("fs");
const { SSL_OP_TLS_ROLLBACK_BUG } = require("constants");

http
  .createServer(function(request, response) {
    response.setHeader("Content-Type", "text/html; charset=utf-8;");
    response.setHeader("Access-Control-Allow-Origin", "*");

    if (request.method === "OPTIONS") {
      response.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, OPTIONS, PATCH, DELETE"
      );
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.end();
    }

    if (request.url === "/categories" && request.method === "GET") {
      fs.readFile("./data/categories.json", function(err, data) {
        if (err) throw err;
        console.log(data);
        response.end(data, "utf-8");
      });
    }

    if (request.url === "/archive" && request.method === "GET") {
      fs.readFile("./data/archive.json", function(err, data) {
        if (err) throw err;
        console.log(data);
        response.end(data, "utf-8");
      });
    }

    if (request.url === "/categories" && request.method === "POST") {
      let newData = "";
      request.on("data", (chunk) => (newData += chunk));
      request.on("end", () => {
        fs.readFile("./data/categories.json", "utf-8", function(err, data) {
          if (err) throw err;
          data = JSON.parse(data);
          data.categories.push(JSON.parse(newData));

          fs.writeFile(
            "./data/categories.json",
            JSON.stringify(data),
            function() {}
          );
          response.statusCode = "201";
          response.end();
        });
      });
    }

    if (request.url === "/categories" && request.method === "DELETE") {
      let newData = "";
      request.on("data", (chunk) => (newData += chunk));
      request.on("end", () => {
        fs.readFile("./data/categories.json", "utf-8", function(err, data) {
          if (err) throw err;
          data = JSON.parse(data);
          let delCatId = JSON.parse(newData);
          console.log(delCatId);
          let delCatIndex = data.categories.findIndex(
            (el) => el.id == delCatId
          );
          console.log(delCatIndex);

          data.categories.splice(delCatIndex, 1);

          fs.writeFile(
            "./data/categories.json",
            JSON.stringify(data),
            function() {}
          );
          response.statusCode = "201";
          response.end();
        });
      });
    }

    if (request.url === "/tasks" && request.method === "POST") {
      let newData = "";
      request.on("data", (chunk) => (newData += chunk));
      request.on("end", () => {
        fs.readFile("./data/categories.json", "utf-8", (err, data) => {
          if (err) throw err;
          let aCategories = JSON.parse(data).categories;
          let oTask = JSON.parse(newData);
          (
            aCategories.find((oCategory) => oCategory.id === oTask.type) || {}
          ).tasks.push(oTask);

          fs.writeFile(
            "./data/categories.json",
            JSON.stringify({ categories: aCategories }),
            function() {}
          );
          response.statusCode = "201";
          response.end();
        });
      });
    }

    if (request.url === "/tasks" && request.method === "PUT") {
      let newData = "";
      request.on("data", (chunk) => (newData += chunk));
      request.on("end", () => {
        fs.readFile("./data/categories.json", "utf-8", (err, data) => {
          if (err) throw err;
          let aCategories = JSON.parse(data).categories;
          let oTask = JSON.parse(newData);
          let newDataTask = oTask[0];
          let index = oTask[1];
          let sCategory = aCategories.find(
            (oCategory) => oCategory.id === newDataTask.type
          );

          sCategory.tasks.splice(index, 1, newDataTask);

          fs.writeFile(
            "./data/categories.json",
            JSON.stringify({ categories: aCategories }),
            function() {}
          );
          response.statusCode = "201";
          response.end();
        });
      });
    }

    if (request.url === "/categories" && request.method === "PATCH") {
      let newDataFront = "";
      request.on("data", (chunk) => (newDataFront += chunk));
      request.on("end", () => {
        fs.readFile("./data/categories.json", "utf-8", function(err, data) {
          if (err) throw err;
          data = JSON.parse(data).categories;
          let newData = JSON.parse(newDataFront);
          let oToCategoryId = newData.toCategoryId;
          let fromtaskIndex = newData.fromtaskIndex;
          let toTaskIndex = newData.toTaskIndex;
          let oFromCategoryId = String(newData.fromCategoryId);
          let oToCategory = data.find(
            (oCategory) => oCategory.id == oToCategoryId
          );
          let oFromCategory = data.find(
            (oCategory) => oCategory.id == oFromCategoryId
          );

          if (typeof toTaskIndex === "number") {
            oToCategory.tasks.splice(
              toTaskIndex,
              1,
              oFromCategory.tasks.splice(fromtaskIndex, 1)[0],
              oToCategory.tasks.slice(toTaskIndex)[0]
            );
          } else {
            oToCategory.tasks.push(
              oFromCategory.tasks.splice(fromtaskIndex, 1)[0]
            );
          }

          fs.writeFile(
            "./data/categories.json",
            JSON.stringify({ categories: data }),
            function() {}
          );
          response.statusCode = "201";
          response.end();
        });
      });
    }

    if (request.url === "/tasks" && request.method === "PATCH") {
      let newData = "";
      request.on("data", (chunk) => (newData += chunk));
      request.on("end", () => {
        fs.readFile("./data/categories.json", "utf-8", (err, data) => {
          if (err) throw err;
          let aCategories = JSON.parse(data).categories;
          let oTask = JSON.parse(newData);
          let index = oTask.index;
          let sCategory = aCategories.find(
            (oCategory) => oCategory.id === oTask.categoryId
          );
          let sTask = sCategory.tasks[oTask.index];
          sCategory.tasks.splice(index, 1);

          fs.writeFile(
            "./data/categories.json",
            JSON.stringify({ categories: aCategories }),
            function() {}
          );

          fs.readFile("./data/archive.json", "utf-8", (err, data) => {
            if (err) throw err;
            let aArchive = JSON.parse(data).archive;
            aArchive[0].tasks.push(sTask);

            fs.writeFile(
              "./data/archive.json",
              JSON.stringify({ archive: aArchive }),
              function() {}
            );
            response.statusCode = "201";
            response.end();
          });
          response.statusCode = "201";
          response.end();
        });
      });
    }

    if (request.url === "/archive" && request.method === "PATCH") {
      let newData = "";
      request.on("data", (chunk) => (newData += chunk));
      request.on("end", () => {
        fs.readFile("./data/archive.json", "utf-8", (err, data) => {
          if (err) throw err;
          let aArchive = JSON.parse(data).archive;
          let oTask = JSON.parse(newData);
          let index = oTask.index;
          let typeTask = aArchive[0].tasks[index].type;
          let sTask = aArchive[0].tasks[oTask.index];
          aArchive[0].tasks.splice(index, 1);

          fs.writeFile(
            "./data/archive.json",
            JSON.stringify({ archive: aArchive }),
            function() {}
          );

          fs.readFile("./data/categories.json", "utf-8", (err, data) => {
            if (err) throw err;
            let aCategories = JSON.parse(data).categories;
            aCategories.find((el) => el.id == typeTask).tasks.push(sTask);

            fs.writeFile(
              "./data/categories.json",
              JSON.stringify({ categories: aCategories }),
              function() {}
            );
            response.statusCode = "201";
            response.end();
          });
          response.statusCode = "201";
          response.end();
        });
      });
    }
  })
  .listen(3000);
