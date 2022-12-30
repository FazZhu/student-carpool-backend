/**
 * users routers
 *
 */

import Router from "koa-router";
import Token from "../server/authentication/token.js";
import { koaBody } from "koa-body";
import User from "../middlewares/users/index.js";

const router = new Router();

const routers = router.post('/login', koaBody(), new Token().authUser(), async (ctx) => {
    if (ctx.auth.accepted) {
        // console.log(ctx.auth)
        ctx.cookies.set('HAS_LOGIN', "true", { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7, domain: 'localhost' });
        ctx.cookies.set("SESSIONID", ctx.auth.token, { httpOnly: true, sameSite: 'strict', domain: 'localhost' });
        ctx.cookies.set("USERID", String(ctx.auth.userId), { httpOnly: false, sameSite: 'strict', domain: 'localhost' });
        ctx.body = {
            code: 0,
            data: {
                userId: ctx.auth.userId,
                id: ctx.auth.id,
                token: ctx.auth.token,
            }
        }
    } else {
        ctx.body = {
            code: 403,
            data: {},
            msg: ctx.auth.msg,
        }
    }
});

router.post('/logout', koaBody(), new User().userLogout, async (ctx) => {
    console.log('using logout')
    // ctx.cookies.remove('HAS_LOGIN')
    ctx.body = {
        code: 0,
        data: {},
        msg: "logout success"
    }
});

const users = routers

export default users;