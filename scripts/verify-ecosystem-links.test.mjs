import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const files = [
  "index.html",
  "README.md",
  "INDICE-EDUCATIVO.md",
  "campus/cursos/ciberseguridad-5-anios/README.md",
];
const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

const correct = [
  ["Lingua Aberta", "https://lingua-aberta.vercel.app/"],
  ["Cruzando el Charco", "https://cruzando-el-charco-web-20260812.vercel.app/"],
  ["Secure-T", "https://secure-t.vercel.app/"],
  ["Manos Abiertas", "https://myopenhands.vercel.app/"],
];
const obsolete = [
  "https://belentani7.github.io/lingua-aberta-empresa/",
  "https://belentani7.github.io/Cruzando-el-charco/",
  "https://belentani7.github.io/secure-t/",
  "https://manos-abiertas.vercel.app/",
  "https://belentani7.github.io/ManosAbiertas/",
];

test("live education footer opens assigned Vercel applications", () => {
  const html = read("index.html");
  for (const [label, url] of correct) {
    assert.ok(html.includes('href="' + url + '">' + label + "</a>"), label + " must open " + url);
  }
});

test("index, course and education directory do not ship dead destinations", () => {
  for (const file of files) {
    const source = read(file);
    for (const old of obsolete) {
      assert.ok(!source.includes(old), file + " contains obsolete URL " + old);
    }
  }
});
