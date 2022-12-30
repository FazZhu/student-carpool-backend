import dbClient from "../../server/database/index.js";


const tokenTableRepository= new dbClient("token");

export default class User{
    userLogout(){
        return async (ctx,next)=>{
            const token = ctx.cookies.get('SESSIONID');
            await tokenTableRepository.dropOne({
                jwt:token
            })
            ctx.cookies.set('HAS_LOGIN', "false", { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7 });
            ctx.cookies.set("SESSIONID", "", { httpOnly: true, sameSite: 'strict', maxAge: 0 });            
        }
    }
}