const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log(`Database Connected on: ${conn.connection.host}`);
  });
  // .catch((err) => {
  //   // console.error(`Database Error: ${err}`);
  //   // process.exit();
  // });
};

module.exports = dbConnection;
