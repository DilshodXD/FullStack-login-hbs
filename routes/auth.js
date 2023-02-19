const { Router } = require("express");
const authController = require("../controller/auth")
const router = new Router();


router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router;