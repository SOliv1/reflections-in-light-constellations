import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDayDate } from "../utils/dayDate.js";

test("normalizes the public ISO date to the existing database format", () => {
  assert.equal(normalizeDayDate("2026-06-27"), "27-06-2026");
});

test("keeps a valid legacy date for existing records", () => {
  assert.equal(normalizeDayDate("27-06-2026"), "27-06-2026");
});

test("rejects ambiguous two-digit years", () => {
  assert.equal(normalizeDayDate("26-03-26"), null);
});

test("rejects impossible calendar dates", () => {
  assert.equal(normalizeDayDate("2026-02-30"), null);
  assert.equal(normalizeDayDate("31-04-2026"), null);
});
