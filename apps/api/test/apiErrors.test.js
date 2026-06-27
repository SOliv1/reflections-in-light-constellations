import assert from "node:assert/strict";
import test from "node:test";
import { getRouteError } from "../utils/apiErrors.js";

test("reports MongoDB authentication failures as service unavailable", () => {
  const response = getRouteError(
    Object.assign(new Error("bad auth : authentication failed"), {
      name: "MongoServerError",
    }),
    "Failed to add photo to day"
  );

  assert.equal(response.status, 503);
  assert.equal(response.body.code, "DATABASE_UNAVAILABLE");
});

test("does not expose unexpected internal error details", () => {
  const response = getRouteError(
    new Error("sensitive implementation detail"),
    "Failed to add photo to day"
  );

  assert.deepEqual(response, {
    status: 500,
    body: {
      error: "Failed to add photo to day",
      code: "INTERNAL_ERROR",
    },
  });
});
