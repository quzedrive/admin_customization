import { Request, Response } from 'express';
import CancellationReason from '../models/cancellation-reason.model';

// @desc    Create a new cancellation reason
// @route   POST /api/cancellation-reasons
// @access  Private/Admin
export const createReason = async (req: Request, res: Response) => {
    try {
        const { reason, status } = req.body;

        const newReason = new CancellationReason({
            reason,
            status
        });

        const savedReason = await newReason.save();
        res.status(201).json(savedReason);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all cancellation reasons
// @route   GET /api/cancellation-reasons
// @access  Private/Admin
export const getAllReasons = async (req: Request, res: Response) => {
    try {
        const { type } = req.query;
        let query: any = {};

        if (type) {
            query.type = type;
        }

        const reasons = await CancellationReason.find(query).sort({ createdAt: -1 });
        res.status(200).json(reasons);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single cancellation reason
// @route   GET /api/cancellation-reasons/:id
// @access  Private/Admin
export const getReasonById = async (req: Request, res: Response) => {
    try {
        const reason = await CancellationReason.findById(req.params.id);
        if (!reason) {
            res.status(404).json({ message: 'Cancellation reason not found' });
            return;
        }
        res.status(200).json(reason);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a cancellation reason
// @route   PUT /api/cancellation-reasons/:id
// @access  Private/Admin
export const updateReason = async (req: Request, res: Response) => {
    try {
        const { reason, status } = req.body;

        const updatedReason = await CancellationReason.findByIdAndUpdate(
            req.params.id,
            { reason, status },
            { new: true }
        );

        if (!updatedReason) {
            res.status(404).json({ message: 'Cancellation reason not found' });
            return;
        }

        res.status(200).json(updatedReason);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a cancellation reason (soft delete)
// @route   DELETE /api/cancellation-reasons/:id
// @access  Private/Admin
export const deleteReason = async (req: Request, res: Response) => {
    try {
        const deletedReason = await CancellationReason.findByIdAndUpdate(
            req.params.id,
            { status: 0 },
            { new: true }
        );

        if (!deletedReason) {
            res.status(404).json({ message: 'Cancellation reason not found' });
            return;
        }

        res.status(200).json({ message: 'Cancellation reason deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
