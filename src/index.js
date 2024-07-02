import { } from "dotenv/config";
import app from "./app.js";
import connecDB from "./db/index.js";

import handleCluster from "./server.js";

connecDB()
    .then(() => {
        handleCluster(app);
    })
    .catch((err) => {
        console.log(`An error Occurred!!\n${err}`);
        throw err;
    })
