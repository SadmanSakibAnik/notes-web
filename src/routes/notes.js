const express = require('express');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  softDeleteNote,
  restoreNote,
  getDeletedNotes
} = require('../models/noteModel');

const router = express.Router();

// Middleware: logged in check
const isLoggedIn = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

router.get('/', isLoggedIn, async (req, res) => {
  const notes = await getNotes(req.session.user.id);
  res.render('notes/index', { notes, user: req.session.user });
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('notes/new');
});

router.post('/new', isLoggedIn, async (req, res) => {
  const { title, content } = req.body;
  await createNote(title, content, req.session.user.id);
  res.redirect('/notes');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const note = await getNoteById(req.params.id);
  res.render('notes/edit', { note });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { title, content } = req.body;
  await updateNote(req.params.id, title, content);
  res.redirect('/notes');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
  await softDeleteNote(req.params.id);
  res.redirect('/notes');
});

router.get('/restore/:id', isLoggedIn, async (req, res) => {
  await restoreNote(req.params.id);
  res.redirect('/notes/deleted');
});

router.get('/deleted', isLoggedIn, async (req, res) => {
  const deletedNotes = await getDeletedNotes(req.session.user.id);
  res.render('notes/deleted', { notes: deletedNotes });
});

module.exports = router;
