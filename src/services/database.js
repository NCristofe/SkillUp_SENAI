import * as SQLite from 'expo-sqlite';
import { seedCourses } from '../data/seedCourses';

let _db = null;

// ── Conexão singleton ────────────────────────────────────────────────────────

async function getDb() {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('senai_suico.db');
  return _db;
}

// ── Inicialização do banco ───────────────────────────────────────────────────

export async function initDatabase() {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS courses (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo      TEXT    NOT NULL,
      subtitulo   TEXT,
      nivel       TEXT,
      duracao     TEXT,
      area        TEXT,
      professor   TEXT,
      classificacao REAL  DEFAULT 0,
      descricao   TEXT,
      vagas       INTEGER DEFAULT 0,
      preco       TEXT    DEFAULT 'Gratuito',
      modalidade  TEXT,
      certificado INTEGER DEFAULT 1,
      created_at  TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT NOT NULL,
      email      TEXT NOT NULL,
      telefone   TEXT,
      mensagem   TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await seedIfEmpty(db);
}

// ── Seed automático ──────────────────────────────────────────────────────────

async function seedIfEmpty(db) {
  const rows = await db.getAllAsync('SELECT COUNT(*) AS total FROM courses;');
  const total = rows[0]?.total ?? 0;
  if (total > 0) return;

  const stmt = await db.prepareAsync(`
    INSERT INTO courses
      (titulo, subtitulo, nivel, duracao, area, professor, classificacao,
       descricao, vagas, preco, modalidade, certificado)
    VALUES
      ($titulo, $subtitulo, $nivel, $duracao, $area, $professor, $classificacao,
       $descricao, $vagas, $preco, $modalidade, $certificado);
  `);

  try {
    for (const course of seedCourses) {
      await stmt.executeAsync({
        $titulo: course.titulo,
        $subtitulo: course.subtitulo ?? '',
        $nivel: course.nivel ?? 'Iniciante',
        $duracao: course.duracao ?? '',
        $area: course.area ?? '',
        $professor: course.professor ?? '',
        $classificacao: course.classificacao ?? 0,
        $descricao: course.descricao ?? '',
        $vagas: course.vagas ?? 0,
        $preco: course.preco ?? 'Gratuito',
        $modalidade: course.modalidade ?? 'Presencial',
        $certificado: course.certificado ? 1 : 0,
      });
    }
  } finally {
    await stmt.finalizeAsync();
  }
}

// ── Consultas ────────────────────────────────────────────────────────────────

export async function getAllCourses() {
  const db = await getDb();
  return db.getAllAsync('SELECT * FROM courses ORDER BY area, titulo;');
}

export async function getCourseById(id) {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM courses WHERE id = ?;',
    [id],
  );
  return rows[0] ?? null;
}

export async function getCoursesByArea(area) {
  const db = await getDb();
  return db.getAllAsync(
    'SELECT * FROM courses WHERE area = ? ORDER BY classificacao DESC;',
    [area],
  );
}

export async function searchCourses(query) {
  const db = await getDb();
  const like = `%${query}%`;
  return db.getAllAsync(
    `SELECT * FROM courses
     WHERE titulo LIKE ? OR subtitulo LIKE ? OR area LIKE ? OR professor LIKE ?
     ORDER BY classificacao DESC;`,
    [like, like, like, like],
  );
}

export async function getAreas() {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT DISTINCT area FROM courses ORDER BY area;',
  );
  return rows.map((r) => r.area);
}

// ── Contatos ─────────────────────────────────────────────────────────────────

export async function saveContact({ nome, email, telefone, mensagem }) {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO contacts (nome, email, telefone, mensagem)
     VALUES (?, ?, ?, ?);`,
    [nome, email, telefone ?? '', mensagem],
  );
  return result.lastInsertRowId;
}
