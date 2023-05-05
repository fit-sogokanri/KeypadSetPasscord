const fs = require("fs");
const {parse} = require("csv-parse/sync");
const stringifySync = require("csv-stringify/sync");
require('date-utils');
require('dotenv').config();

const switchbot_api = require("./switchbot_api_caller");

/**
 * @type {Array<{deviceId: String, name: String, type: String, password: String, startTime: Date|String, endTime: Date|String, succeed: boolean}>}
 */
const records = (parse(fs.readFileSync("passcodes.csv"), {columns: false}).filter(value => {
    const list = value.filter(v => {
        return v;
    })
    return list.length === value.length;
})).map((value, index) => {
    if (index === 0) return;
    const record = {
        deviceId: value[0],
        name: value[1],
        type: value[2],
        password: value[3],
        startTime: value[4],
        endTime: value[5],
        succeed: false
    }

    try {
        record.startTime = new Date(value[4]);
        record.endTime = new Date(value[5]);
    } catch (e) {
        console.log(e);
        record["msg"] = e;
    }
    record.succeed = true;
    return record;
}).filter(v => {
    return v;
})


const promiseRecord = records.map(v => {
    if(!v.succeed) return;
    return switchbot_api.executeCommand("createKey", v.deviceId, {
            "name": v.name,
            "type": v.type,
            "password": v.password,
            "startTime": v.startTime.getTime() / 1000,
            "endTime": v.endTime.getTime() / 1000
        }, switchbot_api.getAuthorization()
    )
        .then(r => {
            v["msg"] = `${r.status} ${r.statusText}`;
            return v;
        })
        .catch(e => {
            v["msg"] = e;
            return v;
        })
}).filter(v=>v);

Promise.all(promiseRecord).then(r=>{
    r.forEach(v=>{
        v.startTime=v.startTime.toFormat('YYYY/MM/DD HH24:MI');
        v.endTime=v.endTime.toFormat('YYYY/MM/DD HH24:MI');
    })
    const csvString = stringifySync.stringify(r, {
        header: true
    });

    fs.writeFileSync('output.csv', csvString);
})