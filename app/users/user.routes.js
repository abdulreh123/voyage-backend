const express = require("express");
const router = express.Router();
const controller = require("./user.controller");
//@route POST /api/v2/auth
router.get("/",   controller.getAll);
router.get("/single/:id",   controller.getOne);
router.get("/update/:id",   controller.update);
router.get("/delete/:id",   controller.delete);
router.post("/create",   controller.Create);
router.post("/login",   controller.loginForm);
 router.get("/verify",   controller.verify);


module.exports = router;
