import { Router } from "express";
import { ZodError } from "zod";
import { formatError, imageValidator, removeFile, uploadFile, } from "../helper.js";
import { rumourSchema } from "../validation/rumorValidation.js";
import prisma from "../config/database.js";
// Import the AuthUser type if needed for type checking
// import { AuthUser } from "../types/custom-types";
const router = Router();
// Get all rumours for a user
router.get("/", async (req, res) => {
    try {
        const rumour = await prisma.rumour.findMany({
            where: {
                user_id: req.user?.id,
            },
        });
        res.json({ message: "Rumours fetch successfully!", data: rumour });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
});
// Get a specific rumour by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const rumour = await prisma.rumour.findUnique({
            where: {
                id: Number(id),
            },
        });
        res.json({ message: "Rumour fetch successfully!", data: rumour });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
});
// Create a new rumour
router.post("/", async (req, res) => {
    try {
        // Check if request body exists
        if (!req.body) {
            res.status(400).json({
                message: "Request body is missing",
            });
            return;
        }
        // Parse and validate the request body
        const payload = rumourSchema.parse(req.body);
        let imageUrl;
        // Check if file exists
        if (!req.files || !req.files.image) {
            res.status(422).json({
                errors: {
                    image: "Image field is required.",
                },
            });
            return;
        }
        const image = req.files.image;
        const validMsg = imageValidator(image.size, image.mimetype);
        if (validMsg) {
            res.status(422).json({
                errors: {
                    image: validMsg,
                },
            });
            return;
        }
        // Save the upload result to our string variable
        imageUrl = await uploadFile(image);
        // Check if user exists before using the ID
        if (!req.user || !req.user.id) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }
        // Create data object with all required fields
        const data = {
            title: payload.title,
            image: imageUrl,
            expire_at: new Date(payload.expire_at),
            user_id: req.user.id,
        };
        // Add description only if it exists in payload
        if (payload.description) {
            data.description = payload.description;
        }
        const rumour = await prisma.rumour.create({ data });
        // Send a success response
        res.status(201).json({
            message: "Rumour created successfully",
            data: rumour,
        });
    }
    catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            const errors = formatError(error);
            res.status(422).json({ message: "Invalid data", errors });
            return;
        }
        res.status(500).json({
            message: "Something went wrong. Please try again!",
        });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const rumourId = Number(id);
        // Verify rumour exists and belongs to the user
        const existingRumour = await prisma.rumour.findUnique({
            where: {
                id: rumourId,
            },
        });
        if (!existingRumour) {
            res.status(404).json({
                message: "Rumour not found",
            });
            return;
        }
        // Check if the rumour belongs to the authenticated user
        if (existingRumour.user_id !== req.user?.id) {
            res.status(403).json({
                message: "You do not have permission to update this rumour",
            });
            return;
        }
        if (!req.body) {
            res.status(400).json({
                message: "Request body is missing",
            });
            return;
        }
        // Parse and validate the request body
        const payload = rumourSchema.parse(req.body);
        // Create data object with fields to update
        const data = {
            title: payload.title,
            expire_at: new Date(payload.expire_at),
        };
        // Add description only if it exists in payload
        if (payload.description !== undefined) {
            data.description = payload.description;
        }
        // Handle image update if a new image is provided
        if (req.files && req.files.image) {
            const image = req.files.image;
            const validMsg = imageValidator(image.size, image.mimetype);
            if (validMsg) {
                res.status(422).json({
                    errors: {
                        image: validMsg,
                    },
                });
                return;
            }
            // Remove the old image file
            if (existingRumour.image) {
                await removeFile(existingRumour.image);
            }
            // Upload new image and add the URL to the data object
            data.image = await uploadFile(image);
        }
        // Update the rumour in the database
        const updatedRumour = await prisma.rumour.update({
            where: {
                id: rumourId,
            },
            data,
        });
        // Send a success response
        res.json({
            message: "Rumour updated successfully",
            data: updatedRumour,
        });
    }
    catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            const errors = formatError(error);
            res.status(422).json({ message: "Invalid data", errors });
            return;
        }
        res.status(500).json({
            message: "Something went wrong. Please try again!",
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const rumour = await prisma.rumour.findUnique({
            where: {
                id: Number(id),
            },
        });
        res.json({ message: "Rumour fetch successfully!", data: rumour });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
});
// Delete an existing rumour
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const rumourId = Number(id);
        // Verify rumour exists
        const existingRumour = await prisma.rumour.findUnique({
            where: {
                id: rumourId,
            },
        });
        if (!existingRumour) {
            res.status(404).json({
                message: "Rumour not found",
            });
            return;
        }
        // Check if the rumour belongs to the authenticated user
        if (existingRumour.user_id !== req.user?.id) {
            res.status(403).json({
                message: "You do not have permission to delete this rumour",
            });
            return;
        }
        // Delete the associated image file first
        if (existingRumour.image) {
            await removeFile(existingRumour.image);
        }
        // Delete the rumour from database
        await prisma.rumour.delete({
            where: {
                id: rumourId,
            },
        });
        // Send a success response
        res.json({
            message: "Rumour deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong. Please try again!",
        });
    }
});
export default router;
