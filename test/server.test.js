const app = require("../app");
const request = require("supertest");
const prisma = require("../lib/prisma");
const { authorization } = require("../middlewares/auth");
const BASE_URL = "/api/v1";
let userToken;
let adminToken;

beforeAll(async () => {
  const response = await request(app)
    .post(`${BASE_URL}/auth/login`)
    .send({ email: "developer@mail.com", password: "postgres" });

  userToken = response.body.accessToken;

  const responseAdmin = await request(app)
    .post(`${BASE_URL}/auth/login`)
    .send({ email: "admin@mail.com", password: "postgres" });

  adminToken = responseAdmin.body.accessToken;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("get products api", () => {
  it("should return all product", (done) => {
    request(app)
      .get(`${BASE_URL}/products`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.result.data).toHaveLength(2);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return product by id", (done) => {
    request(app)
      .get(`${BASE_URL}/products/1`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data.id).toEqual(1);
        done();
      })
      .catch((err) => done(err));
  });
});

describe("test wishlist", () => {
  it("should return wishlist", (done) => {
    request(app)
      .get(`${BASE_URL}/wishlists`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data).toHaveLength(2);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return wishlist by id", (done) => {
    request(app)
      .get(`${BASE_URL}/wishlists/1`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data.id).toEqual(1);
        done();
      })
      .catch((err) => done(err));
  });

  it("should return error not found wishlist by id", (done) => {
    request(app)
      .get(`${BASE_URL}/wishlists/3`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
        done();
      })
      .catch((err) => done(err));
  });

  it("should create wishlist", (done) => {
    request(app)
      .post(`${BASE_URL}/wishlists`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ product_id: 2 })
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) => {
        expect(response.body.data.product_id).toEqual(2);
        done();
      })
      .catch((err) => done(err));
  });

  it("should delete wishlist by id", (done) => {
    request(app)
      .get(`${BASE_URL}/wishlists`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        const wishlistLength = response.body.data.length;
        const id = response.body.data[wishlistLength - 1].id;
        request(app)
          .delete(`${BASE_URL}/wishlists/${id}`)
          .set("Authorization", `Bearer ${userToken}`)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {
            expect(response.body.message).toBe("Wishlist Deleted Successful");
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });
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

  it("should return error if the product not found in cart item", async () => {
    const mockData = {
      product_id: 100,
    };

    const response = await request(app)
      .delete(`${BASE_URL}/carts/cart_items`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockData)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toHaveProperty("message");
  });

  it("should delete the cart item", async () => {
    const mockData = {
      product_id: 2,
    };

    const response = await request(app)
      .delete(`${BASE_URL}/carts/cart_items`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockData)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("count");
  });

  it("should reset the cart", async () => {
    const response = await request(app)
      .delete(`${BASE_URL}/carts`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

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

  it("should return error if review not found", async () => {
    const response = await request(app)
      .get(`${BASE_URL}/reviews/100`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toHaveProperty("message");
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

  it("should return error review id for update not found", async () => {
    const mockData = {
      product_id: 1,
      rating: 5,
      comments: "Update Review",
    };

    const response = await request(app)
      .put(`${BASE_URL}/reviews/100`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockData)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toHaveProperty("message");
  });

  it("should delete a review", async () => {
    const response = await request(app)
      .delete(`${BASE_URL}/reviews/2`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("comments");
  });

  it("should return error review id for delete not found", async () => {
    const response = await request(app)
      .delete(`${BASE_URL}/reviews/100`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toHaveProperty("message");
  });
});

describe('Get users', () => {
  it('should return all users', (done) => {
    request(app)
      .get(`${BASE_URL}/users`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Get All Users Successful')
        expect(response.body.data).toHaveLength(2)
        done()
      })
      .catch((err) => done(err))
  })

  it('should return user by id', (done) => {
    request(app)
      .get(`${BASE_URL}/users/2`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Get User By Id Successful')
        expect(response.body.data).toHaveProperty('id')
        done()
      })
      .catch((err) => done(err))
  })
})

describe('Put user', () => {
  it('should update user', (done) => {
    request(app)
      .put(`${BASE_URL}/users`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Update User Successful')
      })
      .catch((err) => done(err))
  })
})

describe('Get users cms', () => {
  it('should return all users', (done) => {
    request(app)
      .get(`${BASE_URL}/cms/users`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Get All Users Successful')
        expect(response.body.data).toHaveLength(2)
        done()
      })
      .catch((err) => done(err))
  })

  it('should return user by id', (done) => {
    request(app)
      .get(`${BASE_URL}/cms/users/1`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Get User By Id Successful')
        expect(response.body.data.id).toEqual(1)
        done()
      })
      .catch((err) => done(err))
  })

  it('should return error not found user by id', (done) => {
    request(app)
      .get(`${BASE_URL}/cms/users/3`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe('Not Found')
        done()
      })
      .catch((err) => done(err))
  })
})

describe('Put user cms', () => {
  it('should update user', (done) => {
    request(app)
      .put(`${BASE_URL}/cms/users`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Update User Successful')
        done()
      })
      .catch((err) => done(err))
  })
})