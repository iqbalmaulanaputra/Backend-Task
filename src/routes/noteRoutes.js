const express = require("express");
const router = express.Router();

const createNote = require("../controllers/note/create");
const getNote = require("../controllers/note/read");
const updateNote = require("../controllers/note/update");
const deleteNote = require("../controllers/note/delete");

router.post("/note", createNote);
router.get("/note", getNote);  
router.get("/note/:id", getNote)
router.put("/note/:id", updateNote);
router.delete("/note/:id", deleteNote);

module.exports = router;