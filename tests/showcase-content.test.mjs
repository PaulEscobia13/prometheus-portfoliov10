import assert from "node:assert/strict";
import test from "node:test";
import { blankShowcaseSheets, showcaseSheetsFromFiles } from "../content/showcase.ts";

test("missing or partial artwork keeps all twelve placeholder identities and tones", () => {
  for (const count of [0, 1, 7, 8, 12]) {
    const files = blankShowcaseSheets.slice(0, count).map(sheet => `${sheet.id}.webp`);
    const result = showcaseSheetsFromFiles(files.reverse());
    assert.equal(result.length, 12);
    assert.deepEqual(result.map(({ id, title, tone }) => ({ id, title, tone })), blankShowcaseSheets);
    assert.equal(result.filter(sheet => sheet.image).length, count);
    for (const sheet of result.slice(0, count)) assert.equal(sheet.image, `/showcase/${sheet.id}.webp`);
  }
});

test("artwork matching is case insensitive, deterministic, and limited to twelve safe filenames", () => {
  const files = ["sheet-13.png", "SHEET-02.WEBP", "sheet-01.webp", "sheet-01.avif", "../sheet-03.png", "sheet-00.png", "sheet-03.svg", "sheet-04.jpg"];
  const forward = showcaseSheetsFromFiles(files);
  assert.deepEqual(forward, showcaseSheetsFromFiles([...files].reverse()));
  assert.equal(forward[0].image, "/showcase/sheet-01.avif");
  assert.equal(forward[1].image, "/showcase/SHEET-02.WEBP");
  assert.equal(forward[2].image, undefined);
  assert.equal(forward[3].image, "/showcase/sheet-04.jpg");
  assert.equal(forward.filter(sheet => sheet.image).length, 3);
  assert.ok(blankShowcaseSheets.every(sheet => sheet.image === undefined));
});
