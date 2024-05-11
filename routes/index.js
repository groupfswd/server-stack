const express = require('express');
const router = require("express").Router();
const {
    authentication,
    authorization
} = require("../middlewares/auth");
const path = require('path');

// list web routers
const addressRoute = require("./AddressRoute");
const authRoute = require("./AuthRoute");
const cartRoute = require("./CartRoute");
const categoryRoute = require("./CategoryRoute");
const cityRoute = require("./CityRoute");
const orderRoute = require("./OrderRoute");
const productRoute = require("./ProductRoute");
const reviewRoute = require("./ReviewRoute");
const storeRoute = require("./StoreRoute");
const userRoute = require("./UserRoute");
const wishlistRoute = require("./WishlistRoute");

// route list cms
const categoryCmsRoute = require("./cms/CategoryRoute");
const orderCmsRoute = require("./cms/OrderRoute");
const productCmsRoute = require("./cms/ProductRoute");
const storeCmsRoute = require("./cms/StoreRoute");
const userCmsRoute = require("./cms/UserRoute");

router.use("/api/v1/auth", authRoute);
router.use("/api/v1/products", productRoute);
router.use("/api/v1/images", express.static(path.join(__dirname, "../public/uploads")))
router.use(authentication);
router.use("/api/v1/addresses", addressRoute);
router.use("/api/v1/carts", cartRoute);
router.use("/api/v1/categories", categoryRoute);
router.use("/api/v1/cities", cityRoute);
router.use("/api/v1/orders", orderRoute);
router.use("/api/v1/reviews", reviewRoute);
router.use("/api/v1/stores", storeRoute);
router.use("/api/v1/users", userRoute);
router.use("/api/v1/wishlists", wishlistRoute);

router.use(authorization);
router.use("/api/v1/cms/categories", categoryCmsRoute);
router.use("/api/v1/cms/orders", orderCmsRoute);
router.use("/api/v1/cms/products", productCmsRoute);
router.use("/api/v1/cms/stores", storeCmsRoute);
router.use("/api/v1/cms/users", userCmsRoute);

module.exports = router;
