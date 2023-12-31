const express = require("express");
const app = express();
const PORT = 5050;

app.use(express.json());
// app.use(express.urlencoded());

let todos = [];

app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "Welcome to todoss" });
});

app.get("/todos", (req, res) => {
  if (todos.length) res.status(200).json(todos);
  else res.status(404).json({ status: 404, message: "No Todos Found!" });
});

app.get("/todo/:id", (req, res) => {
  const singleTodo = todos.filter(
    (existingTodo) => parseInt(req.params.id) === existingTodo.id
  );
  console.log(singleTodo, req.params.id, todos);
  if (req.params.id && singleTodo.length) {
    res.status(200).json(singleTodo);
  } else
    res.status(400).json({ status: 400, message: "requested data not found" });
});

app.post("/todo", (req, res) => {
  console.log("post call", req.body);
  if (req.body) {
    if (
      req.body.id &&
      req.body.todoTitle &&
      !todos.find((existingTodo) => req.body.id === existingTodo.id)
    ) {
      todos.push(req.body);
      res.status(201).send(true);
    } else {
      res.status(400).json({ status: 400, message: "please verify the data" });
    }
  } else {
    res.status(400).json({ status: 400, message: "invalid data!" });
  }
});

app.put("/todo", (req, res) => {
  if (req.body && req.body.id && req.body.todoTitle) {
    let todoIndex = todos.findIndex(
      (existingTodo) => req.body.id === existingTodo.id
    );
    if (todoIndex > -1 && req) {
      todos[todoIndex] = req.body;
      res.status(201).send(true);
    } else
      res.status(400).json({
        status: 400,
        message: "invalid data or todo may already exist",
      });
  } else {
    res.status(400).json({ status: 400, message: "invalid data" });
  }
});

app.delete("/todo/:id", (req, res) => {
  if (req.params.id) {
    todos = todos.filter(
      (existingTodo) => parseInt(req.params.id) !== existingTodo.id
    );
    res.status(200).send(true);
  } else res.status(400).json({ status: 400, message: "invalid data" });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
