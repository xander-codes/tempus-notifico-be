const {MongoClient} = require('mongodb')

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

let dbConnection
let uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.bcnih.mongodb.net/?retryWrites=true&w=majority`

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
            .then(client => {
                dbConnection = client.db()
                return cb()
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection
}