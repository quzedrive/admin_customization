"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReason = exports.updateReason = exports.getReasonById = exports.getAllReasons = exports.createReason = void 0;
const cancellation_reason_model_1 = __importDefault(require("../models/cancellation-reason.model"));
// @desc    Create a new cancellation reason
// @route   POST /api/cancellation-reasons
// @access  Private/Admin
const createReason = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reason, status } = req.body;
        const newReason = new cancellation_reason_model_1.default({
            reason,
            status
        });
        const savedReason = yield newReason.save();
        res.status(201).json(savedReason);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createReason = createReason;
// @desc    Get all cancellation reasons
// @route   GET /api/cancellation-reasons
// @access  Private/Admin
const getAllReasons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        let query = {};
        if (type) {
            query.type = type;
        }
        const reasons = yield cancellation_reason_model_1.default.find(query).sort({ createdAt: -1 });
        res.status(200).json(reasons);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllReasons = getAllReasons;
// @desc    Get single cancellation reason
// @route   GET /api/cancellation-reasons/:id
// @access  Private/Admin
const getReasonById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reason = yield cancellation_reason_model_1.default.findById(req.params.id);
        if (!reason) {
            res.status(404).json({ message: 'Cancellation reason not found' });
            return;
        }
        res.status(200).json(reason);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getReasonById = getReasonById;
// @desc    Update a cancellation reason
// @route   PUT /api/cancellation-reasons/:id
// @access  Private/Admin
const updateReason = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reason, status } = req.body;
        const updatedReason = yield cancellation_reason_model_1.default.findByIdAndUpdate(req.params.id, { reason, status }, { new: true });
        if (!updatedReason) {
            res.status(404).json({ message: 'Cancellation reason not found' });
            return;
        }
        res.status(200).json(updatedReason);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateReason = updateReason;
// @desc    Delete a cancellation reason (soft delete)
// @route   DELETE /api/cancellation-reasons/:id
// @access  Private/Admin
const deleteReason = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedReason = yield cancellation_reason_model_1.default.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });
        if (!deletedReason) {
            res.status(404).json({ message: 'Cancellation reason not found' });
            return;
        }
        res.status(200).json({ message: 'Cancellation reason deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteReason = deleteReason;
