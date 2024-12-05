const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Tu nota debe tener título y contenido' });
        }
        
        const newNote = new Note({ title, content });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear la nota' });
    }
});

//obtener todas las notas
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las notas' });
    }
});

//obtener nota concreta
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({ error: "No se encuentra la nota" })
        }

        res.json(note); 
    } catch {
        return res.status(500).json({ error: "Error obteniendo la nota"} )
    }
});

//modificar nota
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Tu nota debe tener título y contenido' });
        }
        
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content, updatedAt: new Date() },
            { new:true } //esto devuelve la nota actualizada
        );

        if(!updatedNote) {
            return res.status(404).json({ error: "No se encuentra la nota" })
        }
        
        res.json(updatedNote);
    } catch {
        return res.status(500).json({ error: "Error actualizando la nota"} )
    }
});

//eliminar nota
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ error: 'No se encuentra la nota' });
        }
        res.status(204).send(); // Respuesta sin contenido
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando la nota' });
    }
});

module.exports = router;