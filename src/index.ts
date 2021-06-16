import mongoose from 'mongoose';
import environment from "./environments";
import initExpress from "./api";
import chalk from "chalk";

const connectDatabase = (onDatabaseStartCallback: () => void) => {
  const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  };
  
  console.log("Trying to connect to MongoDB ("+process.env.PORT+") ("+environment.SERVER_PORT+")");
  mongoose.connect(environment.MONGO_DB_LINK, mongooseOpts).then;

  mongoose.connection.on('error', (e) => {
      console.log(e);
      if (e.message.code === 'ETIMEDOUT')
        mongoose.connect(environment.MONGO_DB_LINK, mongooseOpts);
  });

  mongoose.connection.once('open', () => {
      console.log(chalk.blue(`
            ######################
            MongoDB successfully connected to ${environment.MONGO_DB_LINK}
            ######################
      `));

      onDatabaseStartCallback();
  });
};

const startServer = () => {
    connectDatabase(() => {
        const expressApp = initExpress();
        const server = require('http').createServer(expressApp);

        server.listen(environment.SERVER_PORT, () => {
            console.log(chalk.yellow(`
            ######################
            Listening on port ${environment.SERVER_PORT}
            ######################
            `));
        });
    });
};

startServer();