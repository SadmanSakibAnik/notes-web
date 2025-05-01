const db = require('./db');

const createNote = async (title, content, userId) => {
  await db.query(
    'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
    [title, content, userId]
  );
};

const getNotes = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM notes WHERE user_id = ? AND deleted = 0 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

const getNoteById = async (id) => {
  const [rows] = await db.query('SELECT * FROM notes WHERE id = ?', [id]);
  return rows[0];
};

const updateNote = async (id, title, content) => {
  await db.query('UPDATE notes SET title = ?, content = ? WHERE id = ?', [
    title,
    content,
    id,
  ]);
};

const softDeleteNote = async (id) => {
  await db.query('UPDATE notes SET deleted = 1 WHERE id = ?', [id]);
};

const restoreNote = async (id) => {
  await db.query('UPDATE notes SET deleted = 0 WHERE id = ?', [id]);
};

const getDeletedNotes = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM notes WHERE user_id = ? AND deleted = 1',
    [userId]
  );
  return rows;
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  softDeleteNote,
  restoreNote,
  getDeletedNotes,
};
