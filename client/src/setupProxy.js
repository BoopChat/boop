const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware(["/api", "/socket.io"], {
            target: "http://localhost:5000",
            changeOrigin: true,
            ws: true,
        })
    );
};
