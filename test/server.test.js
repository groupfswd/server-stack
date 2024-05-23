const app = require("../app");
const request = require("supertest");
const prisma = require("../lib/prisma");
const BASE_URL = "/api/v1";
let userToken;

beforeAll(async () => {
  const response = await request(app)
    .post(`${BASE_URL}/auth/login`)
    .send({ email: "developer@mail.com", password: "postgres" });

  userToken = response.body.accessToken;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Cart Feature", () => {
  it("should return the cart", async () => {
    const response = await request(app)
      .get(`${BASE_URL}/carts`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("cart_items");
  });

  it("should update the cart", async () => {
    const mockData = {
      shipping_cost: 20000,
      courier: "JNE",
      shipping_method: "YES",
      store_id: 1,
      cart_items_attributes: [
        {
          product_id: 1,
          quantity: 5,
          price: 200000,
        },
      ],
    };

    const response = await request(app)
      .put(`${BASE_URL}/carts`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockData)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("total_price");
    expect(response.body.total_price).toBe(1000000);
  });

  it("should return error if product not found", async () => {
    const mockData = {
      shipping_cost: 20000,
      courier: "JNE",
      shipping_method: "YES",
      store_id: 1,
      cart_items_attributes: [
        {
          product_id: 100,
          quantity: 5,
          price: 200000,
        },
      ],
    };

    const response = await request(app)
      .put(`${BASE_URL}/carts`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockData)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toHaveProperty("message");
  });

  it("should return error if stock is insufficient", async () => {
    const mockData = {
      shipping_cost: 20000,
      courier: "JNE",
      shipping_method: "YES",
      store_id: 1,
      cart_items_attributes: [
        {
          product_id: 1,
          quantity: 10000,
          price: 200000,
        },
      ],
    };

    const response = await request(app)
      .put(`${BASE_URL}/carts`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockData)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toHaveProperty("message");
  });

  it("should return error if price is invalid", async () => {
    const mockData = {
      shipping_cost: 20000,
      courier: "JNE",
      shipping_method: "YES",
      store_id: 1,
      cart_items_attributes: [
        {
          product_id: 1,
          quantity: 5,
          price: 20000,
        },
      ],
    };

    const response = await request(app)
      .put(`${BASE_URL}/carts`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockData)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toHaveProperty("message");
  });

  it("should return the shipping cost", async () => {
    const mockData = {
      weight: 1000,
      destination_id: 1,
      origin_id: 2,
      courier: "jne",
    };

    const response = await request(app)
      .get(`${BASE_URL}/carts/shipping_costs`)
      .set("Authorization", `Bearer ${userToken}`)
      .query(mockData)
      .expect("Content-Type", /json/)
      .expect(200);

    response.body.forEach((item) => {
      expect(item).toHaveProperty("cost");
    });
  });

  it("should return error if courier not found", async () => {
    const mockData = {
      weight: 1000,
      destination_id: 1,
      origin_id: 2,
      courier: "jnt",
    };

    const response = await request(app)
      .get(`${BASE_URL}/carts/shipping_costs`)
      .set("Authorization", `Bearer ${userToken}`)
      .query(mockData)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toHaveProperty("message");
  });
});

describe("Review Feature", () => {
  it("should return all reviews", async () => {
    const response = await request(app)
      .get(`${BASE_URL}/reviews`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveLength(1);
  });

  it("should return a review by id", async () => {
    const response = await request(app)
      .get(`${BASE_URL}/reviews/1`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("id");
  });

  it("should create a review", async () => {
    const mockData = {
      product_id: 1,
      rating: 4,
      comments: "Create Review",
    };

    const response = await request(app)
      .post(`${BASE_URL}/reviews`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockData)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toHaveProperty("id");
  });

  it("should return error if product not found", async () => {
    const mockData = {
      product_id: 100,
      rating: 4,
      comments: "Create Review",
    };

    const response = await request(app)
      .post(`${BASE_URL}/reviews`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockData)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toHaveProperty("message");
  });

  it("should update a review", async () => {
    const mockData = {
      product_id: 1,
      rating: 5,
      comments: "Update Review",
    };

    const response = await request(app)
      .put(`${BASE_URL}/reviews/2`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockData)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("rating");
  });

  it("should delete a review", async () => {
    const response = await request(app)
      .delete(`${BASE_URL}/reviews/2`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("comments");
  });
});
