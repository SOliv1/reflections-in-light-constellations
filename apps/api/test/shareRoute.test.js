import assert from "node:assert/strict";
import test from "node:test";
import app from "../app.js";

async function withServer(run) {
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });

  try {
    const address = server.address();
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("POST /api/share/create keeps recipient emails private in response", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/share/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: "owner-1",
        albumId: "day-2026-07-28",
        isPublic: false,
        recipientEmails: ["one@example.com", "two@example.com", "one@example.com"],
      }),
    });

    assert.equal(response.status, 201);
    const body = await response.json();
    assert.equal(body.success, true);
    assert.equal(body.shareLink.recipientEmails, undefined);
    assert.equal(body.privacyStatus.recipientEmailsSharedWithViewers, false);
    assert.equal(body.privacyStatus.recipientEmailsSharedInApiResponse, false);
    assert.equal(body.privacyStatus.recipientCount, 2);
    assert.equal(body.privacyStatus.mode, "friends");
    assert.equal(body.limits.maxRecipientEmails, 25);
  });
});

test("POST /api/share/create rejects too many recipients", async () => {
  await withServer(async (baseUrl) => {
    const recipientEmails = Array.from({ length: 26 }, (_, index) => `u${index}@example.com`);

    const response = await fetch(`${baseUrl}/api/share/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: "owner-2",
        albumId: "day-2026-07-29",
        recipientEmails,
      }),
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.match(body.error, /maximum of 25/i);
  });
});

test("POST /api/share/:urlSlug/invite returns provider status", async () => {
  await withServer(async (baseUrl) => {
    const createResponse = await fetch(`${baseUrl}/api/share/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: "owner-3",
        albumId: "day-2026-07-30",
      }),
    });

    assert.equal(createResponse.status, 201);
    const created = await createResponse.json();
    const slug = created.shareLink.urlSlug;

    const inviteResponse = await fetch(`${baseUrl}/api/share/${slug}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientEmails: ["friend@example.com"],
        message: "hello",
      }),
    });

    assert.equal(inviteResponse.status, 200);
    const inviteBody = await inviteResponse.json();
    assert.equal(inviteBody.success, true);
    assert.equal(inviteBody.sentTo.length, 1);
    assert.equal(inviteBody.invitation.summary.sent + inviteBody.invitation.summary.failed + inviteBody.invitation.summary.skipped, 1);
    assert.equal(inviteBody.privacyStatus.recipientEmailsSharedWithViewers, false);
    assert.equal(inviteBody.privacyStatus.recipientEmailsSharedInApiResponse, false);
  });
});
