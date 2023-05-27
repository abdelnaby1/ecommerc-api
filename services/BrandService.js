const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Brand = require("../models/BrandModel");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/ApiFeatures");

exports.getBrands = asyncHandler(async (req, res) => {
  const documentsCount = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const brands = await mongooseQuery;
  res
    .status(200)
    .json({ results: brands.length, paginationResult, data: brands });
});
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError(`No brand found for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } //for returning the object after the update not before
  );
  if (!brand) {
    return next(new ApiError(`No brand found for this id ${id}`, 404));
  }
  res.status(201).json({ data: brand });
});
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`No brand found for this id ${id}`, 404));
  }
  res.status(200).json({ msg: "brand has been deleted successfully" });
});
