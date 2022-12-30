import jwt from "jsonwebtoken"
import dbClient from "../database/index.js"

const userTableRepository = new dbClient("users");
const tokenTableRepository= new dbClient("token");

class Token {
    constructor(data) {
        this.data = data   
    }
    async createToken(userInfo) {
        console.log('createToken')
        const token = jwt.sign({
            data: userInfo.userid
        }, 'testSecret', {
            expiresIn: '12h'
        })

        await tokenTableRepository.insertOne({
            jwt: token,
            user_id: userInfo.userid
        })

        return token
    }
    authUser() {   
        return async (ctx, next) => {
            //console.log('using authUser()')
            
            //console.log(typeof(await paresPostData(ctx)));
            // console.log(await paresPostData(ctx));
            //console.log(data.userID);
            const {userID,password}=ctx.request.body  
            const userInfo = {
                userid: userID,
                password: password
            }
            console.log("userInfo:"+userInfo);
            const accept = async () => {
                console.log(userID+","+password);
                if (userID && password) {
                    console.log('鉴别账号密码'+userInfo);
                    const userDetail = await userTableRepository
                        .findOne(userInfo);
                    if (!userDetail) {
                        return {
                            userId: -1,
                            accepted: false,
                            msg: "loginPage.noUser"
                        }
                    }
                    return {
                        userId: Number(userDetail.userid),
                        accepted: true,
                        token: await this.createToken(userDetail)
                    }
                }
                else {
                    return {
                        userId: -1,
                        accepted: false,
                        msg: "loginPage.empty",
                    }
                }
            }
            ctx.auth = await accept();
            await next();
        }
    }
    async authToken(token,userid){
        //console.log('using authToken()')
        const tokenInfo = {token:token,userid:userid}
        if(!token) return{ code:403,msg:"token.empty"}
        const jwtAuth = jwt.verify(token, 'testSecret')
        const expireCheck = Number(jwtAuth.exp ?? 0) > Number(Math.floor(new Date().getTime() / 1000))
        if (!expireCheck) return { code: 403, msg: "token.expired" }
        const validToken = await tokenTableRepository.findOne(tokenInfo);
        if(validToken !== null){
            return true        
        }else{
            return {code:403,msg:"token.id_not_match"}
        }

    }
}

export default Token