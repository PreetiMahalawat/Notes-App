const express = require("express");
const router = express.Router();

const Note = require("../models/Note");


// =====================================
// CREATE NOTE
// POST /api/notes
// =====================================

router.post("/", async (req, res) => {
    try {
        const { title, description } = req.body;

        const newNote = new Note({
            title,
            description
        });

        const savedNote = await newNote.save();

        res.status(201).json(savedNote);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// GET ALL NOTES
// GET /api/notes
// =====================================

router.get("/", async (req, res) => {
    try {
        const notes = await Note.find();

        res.status(200).json(notes);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// UPDATE NOTE
// PUT /api/notes/:id
// =====================================

router.put("/:id", async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json(updatedNote);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// DELETE NOTE
// DELETE /api/notes/:id
// =====================================

router.delete("/:id", async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "Note deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;