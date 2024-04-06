const httpStatus = require("http-status");
const fs = require("fs");
const { parseCSV } = require("../services/user.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const config = require("../config/config");
const logger = require("../config/logger");

const csvtojson = asyncHandler(async (req, res) => {
  try {
    const csvFilePath = config.csvFilePath;

    if (!csvFilePath) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "CSV file path not specified in the environment variable"
      );
    }

    if (!fs.existsSync(csvFilePath)) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Specified CSV file not found"
      );
    }

    // Parse the CSV file and insert data into the database
    await parseCSV(csvFilePath);

    const successResponse = new ApiResponse(
      httpStatus.OK,
      null,
      "CSV data uploaded and inserted into database"
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    logger.error("Error in CSV processing:", error);
    const apiError = error instanceof ApiError ? error : new ApiError();
    return res.status(apiError.statusCode).json(apiError);
  }
});

module.exports = { csvtojson };
