const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  csvFilePath: process.env.CSV_FILE_PATH,
  noOfColumn: parseInt(process.env.NO_OF_COLUMN_IN_CSV),
  sqlDB: {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
    password: process.env.POSTGRES_PASSWORD,
    dialect: "postgres",
    pool: {
      max: parseInt(process.env.POSTGRES_MAX_POOL),
      min: parseInt(process.env.POSTGRES_MIN_POOL),
      idle: parseInt(process.env.POSTGRES_IDLE),
    },
    define: {
      timestamps: true,
      freezeTableName: true,
    },
  },
};
