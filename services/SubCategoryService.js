const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/ApiError");
const SubCategory = require("../models/SubCategoryModel");
const Category = require("../models/CategoryModel");
const ApiFeatures = require("../utils/ApiFeatures");

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};
// @desc    Get all subcategories
// @route GET /api/v1/subcategories
// @access public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const documentsCount = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const subCategories = await mongooseQuery;
  res
    .status(200)
    .json({
      results: subCategories.length,
      paginationResult,
      data: subCategories,
    });
});

// @desc Get subcategory
// @route GET /api/v1/subcategories/:id
// access public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!subCategory) {
    return next(new ApiError(`No subcategory found for this id ${id}`, 404));
  }
  //   const category = await Category.findById(subCategory.category);
  //   subCategory.category = category;
  res.status(200).json({ data: subCategory });
});
// middleware to set categoryId before the going to
// the validation layer
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};
// @desc    Create subcategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    category,
    slug: slugify(req.body.name, { lower: true }),
  });

  res.status(201).json({
    success: true,
    data: subCategory,
  });
});

// @desc Update subcategory
// @route PUT /api/v1/subcategories/:id
// access Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const { category } = req.body;
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true } //for returning the object after the update not before
  ).populate({
    path: "category",
    select: "name",
  });
  if (!subCategory) {
    return next(new ApiError(`No subcategory found for this id ${id}`, 404));
  }
  //   const categoryData = await Category.findById(subCategory.category);
  //   subCategory.category = categoryData;
  res.status(201).json({ data: subCategory });
});

// @desc Delete subcategory
// @route DELETE /api/v1/subcategories/:id
// access Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`No subcategory found for this id ${id}`, 404));
  }
  res.status(200).json({ msg: "Subcategory has been deleted successfully" });
});
