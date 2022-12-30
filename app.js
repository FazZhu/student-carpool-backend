import Koa from 'koa'
import apiRouter from './routers/router.js';
import cors from 'koa-cors'
import Token from './server/authentication/token.js';
import {koaBody} from 'koa-body';

const app = new Koa();
const alwaysAllowedUrl = ['/api/user/login','/api/test/get','/api/user/logout'];

//app.use(koaBody())
app.use(cors(
    {
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: false,
        allowedMethods:['GET','POST','DELETE']
    }
))

app.use(async (ctx, next) => {
    const token = ctx.cookies.get('SESSIONID') ?? ''
    const id = String(ctx.cookies.get('USERID') ?? '0')
    // console.log(token,id);
    const auth = alwaysAllowedUrl.includes(ctx.path) ? true : (await new Token(1).authToken(token, id))
    if (auth === true) {
        try {
            await next()
            if (!ctx.body) {
                ctx.body = "not found"
                ctx.status = 404
            }
        } catch (e) {
            ctx.body = "server error"
            ctx.status = 500
        }
    } else {
        ctx.body = {
            code: auth.code,
            msg: auth.msg,
            data: {}
        }
        ctx.status = 401
        ctx.cookies.set('HAS_LOGIN', "false", { httpOnly: false, domain:'localhost',maxAge: 1000 * 60 * 60 * 24 * 7 });
        ctx.cookies.set("USERID", "0", { httpOnly: false, domain:'localhost',sameSite: 'strict', maxAge: 0 });
        ctx.cookies.set("SESSIONID", "", { httpOnly: true, domain:'localhost',sameSite: 'strict', maxAge: 0 });
    }
})
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

const port = 3000
app.listen(port)
console.log("listening port "+port);
/*
函数区 
*/
