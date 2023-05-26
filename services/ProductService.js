const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Product = require("../models/ProductModel");
const ApiError = require("../utils/ApiError");

exports.getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const queryObj = { ...req.query };
  const excludedFields = ["page", "limit", "sort", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryObjString = JSON.stringify(queryObj);
  queryObjString = queryObjString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  // build query
  const mongooseQuery = Product.find(JSON.parse(queryObjString))
    // .where("price")
    // .equals(req.query.price)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "category",
      select: "name",
    });
  const products = await mongooseQuery;

  res
    .status(200)
    .json({ page, limit, results: products.length, data: products });
});
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!product) {
    return next(new ApiError(`No product found for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true } //for returning the object after the update not before
  );
  if (!product) {
    return next(new ApiError(`No product found for this id ${id}`, 404));
  }
  res.status(201).json({ data: product });
});
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No product found for this id ${id}`, 404));
  }
  res.status(200).json({ msg: "product has been deleted successfully" });
});
