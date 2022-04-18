const config = require("./webpack.config");
const env = {};
// env["report"] = true;
module.exports = config(env, { mode: "production" });
