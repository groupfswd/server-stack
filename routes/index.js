const router = require("express").Router();
const { authentication } = require("../middlewares/auth");
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

router.use("/api/auth", authRoute);
router.use("/api/addresses", addressRoute);
router.use("/api/carts", cartRoute);
router.use("/api/categories", categoryRoute);
router.use("/api/cities", cityRoute);
router.use("/api/orders", orderRoute);
router.use("/api/products", productRoute);
router.use("/api/reviews", reviewRoute);
router.use("/api/stores", storeRoute);
router.use("/api/users", userRoute);
router.use("/api/wishlists", wishlistRoute);

router.use(authentication);
router.use("/api/cms/categories", categoryCmsRoute);
router.use("/api/cms/orders", orderCmsRoute);
router.use("/api/cms/products", productCmsRoute);
router.use("/api/cms/stores", storeCmsRoute);
router.use("/api/cms/users", userCmsRoute);

module.exports = router;
