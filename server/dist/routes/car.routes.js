"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const car_controller_1 = require("../controllers/car.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/public', car_controller_1.getPublicCars);
router.route('/')
    .get(auth_middleware_1.protect, car_controller_1.getAllCars)
    .post(auth_middleware_1.protect, car_controller_1.createCar);
router.route('/:id')
    .get(auth_middleware_1.protect, car_controller_1.getCarById)
    .put(auth_middleware_1.protect, car_controller_1.updateCar)
    .delete(auth_middleware_1.protect, car_controller_1.deleteCar);
router.route('/:id/status').patch(auth_middleware_1.protect, car_controller_1.toggleCarStatus);
exports.default = router;
