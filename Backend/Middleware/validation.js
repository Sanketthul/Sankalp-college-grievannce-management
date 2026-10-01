const { body, param, query, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

//registration validation

const registerValidation = [
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required.")
    .isIn(["Student", "Admin"])
    .withMessage("Invalid role."),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage("Name must be between 2 and 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("uid")
    .trim()
    .notEmpty()
    .withMessage("UID is required.")
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage("UID must be between 2 and 50 characters."),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({
      min: 3,
      max: 30,
    })
    .withMessage("Username must be between 3 and 30 characters.")
    .matches(/^[A-Za-z0-9_.-]+$/)
    .withMessage(
      "Username can contain only letters, numbers, dots, underscores and hyphens.",
    ),

  body("pass")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Password must be between 6 and 128 characters."),

  body("adminSecretKey").custom((value, { req }) => {
    if (req.body.role === "Admin" && (!value || !value.trim())) {
      throw new Error("Admin secret key is required.");
    }

    return true;
  }),
];

//login validation

const loginValidation = [
  body("uname")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({
      min: 3,
      max: 30,
    })
    .withMessage("Invalid username."),

  body("pass")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Invalid password."),
];

//student complaint validation

const complaintValidation = [
  body("p_incharge")
    .trim()
    .notEmpty()
    .withMessage("Person incharge is required.")
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage("Person incharge must be between 2 and 100 characters."),

  body("branch")
    .trim()
    .notEmpty()
    .withMessage("Complaint branch is required.")
    .isIn(["Academic", "Library", "Canteen", "Other"])
    .withMessage("Invalid complaint branch."),

  body("complaint")
    .trim()
    .notEmpty()
    .withMessage("Complaint description is required.")
    .isLength({
      min: 5,
      max: 2000,
    })
    .withMessage("Complaint must be between 5 and 2000 characters."),

  body("date")
    .optional()
    .trim()
    .isLength({
      max: 50,
    })
    .withMessage("Invalid date."),

  body("time")
    .optional()
    .trim()
    .isLength({
      max: 50,
    })
    .withMessage("Invalid time."),
];

//admin complaint list validation

const adminComplaintQueryValidation = [
  query("status")
    .optional()
    .trim()
    .isIn(["All", "Pending", "In Progress", "Resolved", "Rejected"])
    .withMessage("Invalid complaint status filter."),

  query("search")
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage("Search text cannot exceed 100 characters."),
];

//admin update validation

const adminComplaintUpdateValidation = [
  param("id").isMongoId().withMessage("Invalid complaint ID."),

  body("status")
    .optional()
    .trim()
    .isIn(["Pending", "In Progress", "Resolved", "Rejected"])
    .withMessage("Invalid complaint status."),

  body("assignedResolver")
    .optional()
    .custom((value) => {
      if (value === null || value === undefined) {
        return true;
      }

      if (typeof value !== "string") {
        throw new Error("Invalid resolver.");
      }

      if (value.trim().length > 30) {
        throw new Error("Resolver username is too long.");
      }

      return true;
    }),

  body("assignedResolverUid")
    .optional()
    .isLength({
      max: 50,
    })
    .withMessage("Resolver UID is too long."),
];

//resolver update validation

const resolverComplaintUpdateValidation = [
  body("complaintID").isMongoId().withMessage("Invalid complaint ID."),

  body("status")
    .optional()
    .trim()
    .isIn(["Pending", "In Progress", "Resolved", "Rejected"])
    .withMessage("Invalid complaint status."),

  body("comments")
    .optional()
    .isString()
    .trim()
    .isLength({
      max: 2000,
    })
    .withMessage("Comments cannot exceed 2000 characters."),
];

module.exports = {
  validate,

  registerValidation,

  loginValidation,

  complaintValidation,

  adminComplaintQueryValidation,

  adminComplaintUpdateValidation,

  resolverComplaintUpdateValidation,
};
