// A tananyag épsége: azonosítók, hivatkozások és a tartalom szerkezete.
import test from "node:test";
import assert from "node:assert/strict";
import { DATA } from "../dist/data.js";
import { CONTENT } from "../dist/content/index.js";
import { GLOSSARY } from "../dist/content/fogalomtar.js";

const lessons = DATA.modules.flatMap((module) => module.lessons);
const ids = lessons.map((lesson) => lesson.id);
const DIAGRAMS = ["order-book", "structure", "profile", "footprint", "drawdown-types"];

test("tartalom: minden leckeazonosító egyedi", () => {
  assert.equal(new Set(ids).size, ids.length);
});

test("tartalom: minden leckének van váza és törzsanyaga", () => {
  lessons.forEach((lesson) => {
    ["id", "title", "summary", "exercise", "sourceTag"].forEach((field) => assert.ok(lesson[field], `${lesson.id}: hiányzik a ${field}`));
    assert.ok(Number.isInteger(lesson.week) && lesson.week >= 1 && lesson.week <= 24, `${lesson.id}: hét`);
    assert.ok(lesson.keyPoints.length >= 2, `${lesson.id}: kulcsgondolatok`);
    const content = CONTENT[lesson.id];
    assert.ok(content?.sections?.length >= 2, `${lesson.id}: törzsanyag`);
    assert.ok(content.mistakes?.length >= 2, `${lesson.id}: tipikus hibák`);
    assert.ok(content.check?.length >= 2 && content.check.every((item) => item.q && item.a), `${lesson.id}: önellenőrzés`);
  });
});

test("tartalom: nincs árva törzsanyag, és a hetek nem csökkennek", () => {
  Object.keys(CONTENT).forEach((id) => assert.ok(ids.includes(id), `árva tartalom: ${id}`));
  lessons.reduce((previous, lesson) => { assert.ok(lesson.week >= previous, `${lesson.id}: a hét visszalép`); return lesson.week; }, 0);
});

test("tartalom: a blokkok szerkezete érvényes", () => {
  Object.entries(CONTENT).forEach(([id, content]) => {
    [...content.sections, ...(content.example ? [content.example] : [])].forEach((block) => {
      assert.ok(block.title, `${id}: cím nélküli blokk`);
      assert.ok(block.intro || block.body || block.list || block.table, `${id}: üres blokk (${block.title})`);
      if (block.table) block.table.rows.forEach((row) => assert.equal(row.length, block.table.head.length, `${id}: táblázatsor hossza (${block.title})`));
      if (block.diagram) assert.ok(DIAGRAMS.includes(block.diagram), `${id}: ismeretlen ábra ${block.diagram}`);
    });
  });
});

test("tartalom: a szövegben nincs hosszú gondolatjel", () => {
  assert.equal(JSON.stringify([DATA, CONTENT, GLOSSARY]).includes("—"), false);
});

test("kvíz: a helyes válasz létezik, a kapcsolódó lecke is", () => {
  DATA.quiz.forEach((question) => {
    assert.ok(question.options.length >= 3, question.question);
    assert.ok(question.correct >= 0 && question.correct < question.options.length, question.question);
    assert.ok(ids.includes(question.lesson), `ismeretlen lecke: ${question.lesson}`);
    assert.ok(question.explanation, question.question);
  });
  assert.equal(new Set(DATA.quiz.map((question) => question.question)).size, DATA.quiz.length);
});

test("fogalomtár: minden sor teljes, egyedi, és létező leckére mutat", () => {
  GLOSSARY.forEach(([term, definition, lessonId]) => {
    assert.ok(term && definition, `hiányos sor: ${term}`);
    assert.ok(ids.includes(lessonId), `${term}: ismeretlen lecke ${lessonId}`);
  });
  assert.equal(new Set(GLOSSARY.map(([term]) => term)).size, GLOSSARY.length);
});

test("források: minden hivatkozás https", () => {
  DATA.sources.forEach((source) => assert.match(source.url, /^https:\/\//, source.title));
});
