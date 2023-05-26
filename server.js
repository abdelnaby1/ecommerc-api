const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./db");
const categoryRoute = require("./routes/CategoriesRoute");
const subCategoryRoute = require("./routes/SubCategoriesRoute");
const brandRoute = require("./routes/BrandsRoute");
const productRoute = require("./routes/ProductsRoute");

const errorMiddleware = require("./middlewares/errorMiddleware");
const ApiError = require("./utils/ApiError");

dotenv.config({ path: "config.env" });
const app = express();
dbConnection();
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

app.all("*", (req, res, next) => {
  // create error and send it to error handing middleware
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

//this is global error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

// for handling any unhandledRejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  //exiting the app after closing the server
  server.close(() => {
    console.error("Shuting down...");
    process.exit();
  });
});
