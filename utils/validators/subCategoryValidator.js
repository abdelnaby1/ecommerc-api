const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id"),
  validatorMiddleware,
];
exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 3 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name"),
  check("category")
    .notEmpty()
    .withMessage("Subcategory must belong to category")
    .isMongoId()
    .withMessage("Invalid category id"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id"),
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 3 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name"),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id"),
  validatorMiddleware,
];
