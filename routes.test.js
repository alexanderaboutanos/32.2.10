/** @format */

process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let pickles = { name: "pickles", price: 3.99 };

beforeEach(function () {
  items.push(pickles);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [pickles] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${pickles.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: pickles });
  });
  test("Responds with 500 for invalid item", async () => {
    const res = await request(app).get(`/items/sushi`);
    expect(res.statusCode).toBe(500);
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "cheese", price: 8 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ item: { name: "cheese", price: 8 } });
  });
  test("Responds with 500 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(500);
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating an item's name", async () => {
    const res = await request(app)
      .patch(`/items/${pickles.name}`)
      .send({ name: "cucumber", price: 8 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "cucumber", price: 8 } });
  });
  test("Responds with 500 for invalid name", async () => {
    const res = await request(app)
      .patch(`/items/hamburgers`)
      .send({ name: "cucumber" });
    expect(res.statusCode).toBe(500);
  });
});

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${pickles.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 500 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/turkey`);
    expect(res.statusCode).toBe(500);
  });
});
