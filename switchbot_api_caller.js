const crypto = require("crypto");

let Authorization = null;

/**
 * Executes a specific command for the specified Device
 * @param {String}command
 * @param {String}deviceId
 * @param parameter
 * @param authorization
 * @return {Promise<Response>}
 */
exports.executeCommand = (command, deviceId, parameter, authorization) => {
    const body = {
        "commandType": "command",
        "command": command,
        "parameter": parameter
    }

    const header = JSON.parse(JSON.stringify(authorization));
    header['Content-Type'] = "application/json";
    const init = {
        method: "POST",
        headers: header,
        body: JSON.stringify(body)
    }
    return fetch(`https://api.switch-bot.com/v1.1/devices/${deviceId}/commands`, init)
        .then(r => {
            return r;
        })
        .catch(e =>{
            return e;
        })
}

/**
 * Get authentication information for SwitchBotAPI
 * @return {null|{Authorization: String, t: string, sign: string, nonce: string}}
 */
exports.getAuthorization = ()=>{
    if(Authorization) return Authorization;
    const token = process.env.TOKEN;
    const secret = process.env.SECRET;
    const t = Date.now();
    const nonce = crypto.randomUUID();

    const data = token + t + nonce;
    const signTerm = crypto.createHmac('sha256', secret)
        .update(Buffer.from(data, 'utf-8'))
        .digest();
    const sign = signTerm.toString("base64");

    Authorization = {
        "Authorization": token,
        "sign": sign,
        "t": t.toString(),
        "nonce": nonce
    }

    return Authorization;
}