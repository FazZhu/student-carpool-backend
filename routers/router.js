import Router from "koa-router";
import test from "./test.js";
import users from "./users.js";

const apiRouter = new Router();
//console.log("加载路由");
apiRouter.use("/api/test", test.routes(), test.allowedMethods());
apiRouter.use("/api/user", users.routes(), users.allowedMethods());

export default apiRouter;