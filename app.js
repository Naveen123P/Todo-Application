const express = require("express");
const app = express();
app.use(express.json());
module.exports = app;
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const initilizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost/3000/");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};
initilizeDBAndServer();

// API 1
app.("/", async (request, response) => {

  const createTodoTableQuary = `
        
    `;
  response.send("");
});

// API 2

app.get("/todos/:todoId/", async (request, response)=>{
    const {todoId} = request.params
    const getTodosQuary = `
    SELECT * FROM todo WHERE id = ${todoId};
    `
    const getTodos = await db.all(getTodosQuary)
    response.send(getTodos)
})

// API 3

app.post("/todos/", await(request, response)=>{
    const {todo, priority, status} = request.body
    const postTodoQuary =  `
    INSERT INTO 
        todo(todo, priority, status)
    VALUES
        ('${todo}','${priority}', '${status}');
    `
    const updatedTodoTable = await db.run(postTodoQuary);
    response.send("Todo Successfully Added")
})

// API 4 




// API 5 

app.delete("/todos/:todoId/", async (request, response)=>{
    const {todoId} = request.params
    const deleteTodoQuary = `
    DELETE FROM 
        todo 
    WHERE 
        id = ${todoId};
    `
    const deletedTodoTable = await db.run(deleteTodoQuary)
    response.send("Todo Deleted")
})
