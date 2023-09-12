const Bun = require('bun');

const server = Bun.serve({
    fetch(req, server) {
        const url = new URL(req.url);

        if (url.pathname === "/chat") {
            const success = server.upgrade(req);
            return success ? undefined : new Response("WebSocket upgrade error", {
                status: 400
            });
        }

        return new Response("Not Found", {
            status: 404
        });
    },
    websocket: {
        open(ws) {
            ws.subscribe("live-chat");
        },
        message(ws, message) {
            ws.publish("live-chat", message);
        },
        close(ws) {
            ws.unsubscribe("live-chat");
        },
    },
});

console.log(`WebSocket server listening on ${server.hostname}:${server.port}`);