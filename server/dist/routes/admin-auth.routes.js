"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_auth_controller_1 = require("../controllers/admin-auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/register', admin_auth_controller_1.registerAdmin);
router.post('/login', admin_auth_controller_1.loginAdmin);
router.post('/refresh', admin_auth_controller_1.refreshAccessToken);
router.post('/forgotpassword', admin_auth_controller_1.forgotPassword);
router.put('/resetpassword/:resettoken', admin_auth_controller_1.resetPassword);
router.post('/logout', auth_middleware_1.protect, admin_auth_controller_1.logoutAdmin);
router.get('/me', auth_middleware_1.protect, admin_auth_controller_1.getMe);
exports.default = router;
