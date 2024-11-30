const fs = require("fs");
const YAML = require("js-yaml")
function dbLoadValue() {
    const load = fs.readFileSync("./src/db/db.yaml");
    const db = YAML.load(load)
    return db.MemesLista
}
function dbLoad() {
    const load = fs.readFileSync("./src/db/db.yaml");
    const db = YAML.load(load)
    return db
}
module.exports = { dbLoad, dbLoadValue }