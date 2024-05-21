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
