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
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};
initilizeDBAndServer();

// API 1
const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasPriorityAndStatusProperty = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  );
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodoQuery = "";
  const { search_q = "", priority, status } = request.query;

  switch (true) {
    case hasStatusProperty(request.query):
      getTodoQuery = `
            SELECT 
                *
            FROM
                todo
            WHERE
                todo LIKE '%${search_q}%' 
                AND status = '${status}';
            `;
      break;
    case hasPriorityProperty(request.query):
      getTodoQuery = `
            SELECT 
                *
            FROM
                todo
            WHERE
                todo LIKE '%${search_q}%' 
                AND priority = '${priority}';
            `;
      break;
    case hasPriorityAndStatusProperty(request.query):
      getTodoQuery = `
            SELECT 
                *
            FROM
                todo
            WHERE
                todo LIKE '%${search_q}%'
                AND status = '${status}' 
                AND priority = '${priority}';
            `;
      break;
    default:
      getTodoQuery = `
            SELECT 
                *
            FROM
                todo
            WHERE
                todo LIKE '%${search_q}%';
            `;
      break;
  }
  data = await db.all(getTodoQuery);
  response.send(data);
});

// API 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodosQuary = `
    SELECT * FROM todo WHERE id = ${todoId};
    `;
  const getTodos = await db.get(getTodosQuary);
  response.send(getTodos);
});

// API 3

app.post("/todos/", async (request, response) => {
  const { todo, priority, status } = request.body;
  const postTodoQuary = `
    INSERT INTO 
        todo(todo, priority, status)
    VALUES
        ('${todo}','${priority}', '${status}');
    `;
  const updatedTodoTable = await db.run(postTodoQuary);
  response.send("Todo Successfully Added");
});

// API 4
app.put("/todos/:todoId/", async (request, response) => {
  let data = null;
  const { todoId } = request.params;
  let getTodoQuery = "";
  const { todo } = request.body;
  const { priority } = request.body;
  const { status } = request.body;
  switch (true) {
    case status !== undefined:
      getTodoQuery = `
            UPDATE 
                todo
            SET 
                status = '${status}'
            WHERE 
                id = ${todoId};
            `;
      data = await db.run(getTodoQuery);
      response.send("Status Updated");
      break;
    case priority !== undefined:
      getTodoQuery = `
            UPDATE 
                todo
            SET 
                priority = '${priority}'
            WHERE 
                id = ${todoId};
            `;
      data = await db.run(getTodoQuery);
      response.send("Priority Updated");
      break;
    case todo !== undefined:
      getTodoQuery = `
            UPDATE 
                todo
            SET 
                todo = '${todo}'
            WHERE 
                id = ${todoId};
            `;
      data = await db.run(getTodoQuery);
      response.send("Todo Updated");
      break;
    default:
      response.status(400);
      break;
  }
});

// API 5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuary = `
    DELETE FROM 
        todo 
    WHERE 
        id = ${todoId};
    `;
  const deletedTodoTable = await db.run(deleteTodoQuary);
  response.send("Todo Deleted");
});
