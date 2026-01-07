"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cancellation_reason_controller_1 = require("../controllers/cancellation-reason.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .post(auth_middleware_1.protect, cancellation_reason_controller_1.createReason)
    .get(auth_middleware_1.protect, cancellation_reason_controller_1.getAllReasons);
router.route('/:id')
    .get(auth_middleware_1.protect, cancellation_reason_controller_1.getReasonById)
    .put(auth_middleware_1.protect, cancellation_reason_controller_1.updateReason)
    .delete(auth_middleware_1.protect, cancellation_reason_controller_1.deleteReason);
exports.default = router;
