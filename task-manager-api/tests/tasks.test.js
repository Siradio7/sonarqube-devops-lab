
const request = require("supertest");
const app = require("../src/app");

describe("Task Manager API", () => {

    test("GET /tasks should return an empty array", async () => {
        const response = await request(app).get("/tasks");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("POST /tasks should create a task", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "Learn SonarQube" });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe("Learn SonarQube");
        expect(response.body.completed).toBe(false);
    });

    test("GET /tasks/:id should return a task", async () => {
        const response = await request(app)
            .get("/tasks/1");

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
    });

    test("DELETE /tasks/:id should delete a task", async () => {
        const response = await request(app)
            .delete("/tasks/1");

        expect(response.status).toBe(200);
        expect(response.body.message)
            .toBe("Task deleted successfully");
    });


    test("POST /tasks should reject an empty title", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Title is required");
    });

    test("POST /tasks should reject a missing title", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Title is required");
    });

    test("GET /tasks/:id should return 404 for an unknown task", async () => {
        const response = await request(app)
            .get("/tasks/999");

        expect(response.status).toBe(404);
    });

    test("DELETE /tasks/:id should return 404 for an unknown task", async () => {
        const response = await request(app)
            .delete("/tasks/999");

        expect(response.status).toBe(404);
    });

    test("API should not disclose Express technology", async () => {
        const response = await request(app).get("/tasks");

        expect(response.headers["x-powered-by"]).toBeUndefined();
    });

});
