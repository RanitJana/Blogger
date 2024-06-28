require("dotenv").config();
const app = require("./app.js");
const connecDB = require("./db/index.js");

const port = process.env.PORT || 8000;

connecDB()
    .then(() => {
        app
            .listen(port, () => {
                console.log(`⚙ Server started at port : ${port}`);
            })
            .on('error', (err) => {
                console.log(`Express connection Error : ${err}`);
                throw err;
            })
    })
    .catch((err) => {
        console.log(`An error Occurred!!\n${err}`);
        throw err;
    })
