describe("fetchFromApi", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetModules();
    delete process.env.REACT_APP_API_BASE_URL;
    delete process.env.REACT_APP_API_URLS;
    delete process.env.REACT_APP_API_URL;
  });

  test("falls back when a frontend server returns an HTML 405", async () => {
    process.env.REACT_APP_API_BASE_URL = "http://localhost:3000";
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 405,
        headers: { get: () => "text/html; charset=utf-8" },
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: { get: () => "application/json; charset=utf-8" },
      });

    const { fetchFromApi } = await import("./api");
    const response = await fetchFromApi("/api/upload", { method: "POST" });

    expect(response.status).toBe(400);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3000/api/upload",
      { method: "POST" }
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost:5000/api/upload",
      { method: "POST" }
    );
  });
});
