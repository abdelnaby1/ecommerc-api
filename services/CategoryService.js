const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Category = require("../models/CategoryModel");
const ApiFeatures = require("../utils/ApiFeatures");
const ApiError = require("../utils/ApiError");

exports.getCategories = asyncHandler(async (req, res) => {
  const documentsCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;
  res
    .status(200)
    .json({ results: categories.length, paginationResult, data: categories });
});
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`No category found for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } //for returning the object after the update not before
  );
  if (!category) {
    return next(new ApiError(`No category found for this id ${id}`, 404));
  }
  res.status(201).json({ data: category });
});
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`No category found for this id ${id}`, 404));
  }
  res.status(200).json({ msg: "category has been deleted successfully" });
});
