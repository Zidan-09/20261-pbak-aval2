import Fastify from "fastify";

export function buildApp() {
    const app = Fastify({
        logger: true
    });

    app.get("/health", async () => {
        return {
            success: true,
            data: {
                status: "ok"
            }
        }
    });

    return app;
}