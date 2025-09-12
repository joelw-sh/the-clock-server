import { Router } from 'express';
import pool from '../database';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Obtener todos los items del usuario
router.get('/', async (req: AuthRequest, res) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM items WHERE user_id = ? AND deleted = 0 ORDER BY updated_at DESC',
      [req.userId]
    );
    res.json({ items: rows });
  } catch (error) {
    console.error('Error obteniendo items:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo item
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { kind, data } = req.body;

    if (!kind || !['note', 'task', 'todo'].includes(kind)) {
      return res.status(400).json({ error: 'Tipo de item inválido' });
    }

    const [result]: any = await pool.query(
      'INSERT INTO items (user_id, kind, data, updated_at, deleted) VALUES (?, ?, ?, NOW(), 0)',
      [req.userId, kind, JSON.stringify(data || {})]
    );

    const [newItem]: any = await pool.query(
      'SELECT * FROM items WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ item: newItem[0] });
  } catch (error) {
    console.error('Error creando item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar item
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { data } = req.body;

    const [result]: any = await pool.query(
      'UPDATE items SET data = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
      [JSON.stringify(data || {}), itemId, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    const [updatedItem]: any = await pool.query(
      'SELECT * FROM items WHERE id = ?',
      [itemId]
    );

    res.json({ item: updatedItem[0] });
  } catch (error) {
    console.error('Error actualizando item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar item (soft delete)
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const itemId = parseInt(req.params.id);

    const [result]: any = await pool.query(
      'UPDATE items SET deleted = 1, updated_at = NOW() WHERE id = ? AND user_id = ?',
      [itemId, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    res.json({ message: 'Item eliminado' });
  } catch (error) {
    console.error('Error eliminando item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Sincronización
router.get('/sync', async (req: AuthRequest, res) => {
  try {
    const { since } = req.query;
    let query = 'SELECT * FROM items WHERE user_id = ?';
    let params: any[] = [req.userId];

    if (since) {
      query += ' AND updated_at > ?';
      params.push(new Date(since as string));
    }

    query += ' ORDER BY updated_at DESC';

    const [rows]: any = await pool.query(query, params);
    res.json({ items: rows });
  } catch (error) {
    console.error('Error en sincronización:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;