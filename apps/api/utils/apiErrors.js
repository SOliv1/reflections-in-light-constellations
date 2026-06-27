export function getRouteError(error, fallbackMessage) {
  const message = error?.message || "";
  const isDatabaseError =
    error?.name?.startsWith("Mongo") ||
    /authentication failed|bad auth|database not connected|mongodb/i.test(message);

  if (isDatabaseError) {
    return {
      status: 503,
      body: {
        error: "Database unavailable. Check the API MongoDB configuration.",
        code: "DATABASE_UNAVAILABLE",
      },
    };
  }

  return {
    status: 500,
    body: { error: fallbackMessage, code: "INTERNAL_ERROR" },
  };
}

export function sendRouteError(res, error, fallbackMessage) {
  const response = getRouteError(error, fallbackMessage);
  return res.status(response.status).json(response.body);
}
