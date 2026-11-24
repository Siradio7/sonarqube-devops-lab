
const express = require("express");

const app = express();

// Désactiver la divulgation de la technologie utilisée
app.disable("x-powered-by");

app.use(express.json());

const tasks = [];
let nextId = 1;

// Récupérer toutes les tâches
app.get("/tasks", (req, res) => {
    console.log("Fetching all tasks");

    res.json(tasks);
});

// Ajouter une tâche
app.post("/tasks", (req, res) => {
    const title = req.body.title;

    if (title == null || title == "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const task = {
        id: nextId++,
        title: title,
        completed: false
    };

    tasks.push(task);

    res.status(201).json(task);
});

// Récupérer une tâche
app.get("/tasks/:id", (req, res) => {
    const task = tasks.find(
        (t) => t.id == req.params.id
    );

    if (task) {
        return res.json(task);
    }

    return res.status(404).json({
        error: "Task not found"
    });
});

// Supprimer une tâche
app.delete("/tasks/:id", (req, res) => {
    const index = tasks.findIndex(
        (t) => t.id == req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.json({
        message: "Task deleted successfully"
    });
});

module.exports = app;
