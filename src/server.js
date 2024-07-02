import os from "os";
import cluster from "cluster";

const totalCPUs = os.cpus().length;
const port = process.env.PORT || 8000;

const handleCluster = function (app) {

    if (cluster.isPrimary) {

        console.log(`Primary ${process.pid} id running!!`);

        for (let i = 0; i < totalCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });

    }
    else {

        app
            .listen(port, () => {
                console.log(`⚙ Server started at port : ${port}`);
            })
            .on('error', (err) => {
                console.log(`Express connection Error : ${err}`);
                throw err;
            })
    }
}

export default handleCluster;