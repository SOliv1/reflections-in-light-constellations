import assert from "node:assert/strict";
import test from "node:test";
import app from "../app.js";

test("POST /api/upload is mounted and returns JSON when no image is supplied", async (t) => {
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });

  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      })
  );

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/upload`,
    { method: "POST" }
  );

  assert.equal(response.status, 400);
  assert.match(response.headers.get("content-type") || "", /application\/json/i);
  assert.deepEqual(await response.json(), { error: "No file uploaded" });
});
