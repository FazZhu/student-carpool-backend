/**
 * test routers
 *
 */

import Router from "koa-router";

const router = new Router();

const routers = router.post("/post", async (ctx) => {

    let postData = await paresPostData(ctx);
    ctx.body = postData;
})
router.get('/get', async (ctx) => {
    console.log('using test routers/get')
    console.log(ctx.request.body)
    let htmlText = `
        <form method="POST"  action="/api/user/login">
            <p>userID</p>
            <input name="userID" /> <br/>
            <p>password</p>
            <input name="password" /> <br/>
            <button type="submit">submit</button>
        </form>
    `
    // ctx.body={loginState:"ok"};
    ctx.body = htmlText;
});
const test = routers
export default test

function paresPostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postData = '';
            ctx.req.addListener('data', (data) => {
                postData += data;
            })
            ctx.req.on('end', () => {
                postData = parseData(postData);
                resolve(postData);
            })
        } catch (err) {
            reject(err);
        }
    })
}
function parseData(queryStr) {
    let queryData = {}
    let queryList = queryStr.split('&')
    for (let [index, queryItem] of queryList.entries()) {
        let itemList = queryItem.split('=')
        queryData[itemList[0]] = decodeURIComponent(itemList[1])
    }
    return queryData
}