const { Transform } = require("stream");
const fs = require("fs");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const {
  bulkCreateUsers,
  calculateAgeDistribution,
} = require("../repositories/user.repository");

/**
 * Process a batch of CSV records and insert them into the database.
 * @param {Array} batch - The batch of CSV records to be processed.
 */
const processBatch = async (batch) => {
  try {
    const values = batch.map((record) => {
      // Extract relevant data from each record
      const { name, age, address, gender, ...additionalInfo } = record;
      const firstName = name.firstName || "";
      const lastName = name.lastName || "";
      const addressJSON = address;
      const additionalInfoJSON = additionalInfo;
      return {
        name: `${firstName} ${lastName}`,
        age: !isNaN(age) && age !== "" ? parseInt(age, 10) : null,
        address: addressJSON,
        additional_info: additionalInfoJSON,
      };
    });

    // Insert the processed records into the database
    await bulkCreateUsers(values);
    logger.debug(`Inserted ${values.length} records into the database`);
  } catch (err) {
    logger.error("Error inserting data into database:", err);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error inserting data into database"
    );
  }
};

/**
 * Parse a CSV file and process its data.
 * @param {string} csvFilePath - The path to the CSV file.
 * @returns {Promise<void>} A promise that resolves once parsing and processing are complete.
 */
const parseCSV = async (csvFilePath) => {
  return new Promise((resolve, reject) => {
    let partialLine = ""; // Store the partial line if it ends in the middle
    const headers = []; // Store CSV headers
    let csvRows = []; // Accumulate CSV rows for batch processing

    /**
     * Process a single CSV line.
     * @param {string} line - The CSV line to process.
     */
    const processLine = (line) => {
      const values = line.trim().split(",");
      if (headers.length === 0) {
        headers.push(...values); // Set headers for the first line
      } else {
        const row = {};
        headers.forEach((header, i) => {
          const keys = header.split(".").map((key) => key.trim());
          let nestedObject = row;
          keys.forEach((key, j) => {
            if (j === keys.length - 1) {
              nestedObject[key] = values[i]; // Map values to keys
            } else {
              nestedObject[key] = nestedObject[key] || {};
              nestedObject = nestedObject[key];
            }
          });
        });
        csvRows.push(row);
      }
    };

    const csvParser = new Transform({
      readableObjectMode: true,
      async transform(chunk, encoding, callback) {
        let data = chunk.toString("utf8");
        const lines = data.split(/\r?\n/);

        if (partialLine) {
          lines[0] = partialLine + lines[0]; // Combine with the partial line
          partialLine = ""; // Reset partial line
        }

        // Remove the last line as it might be partial
        partialLine = lines.pop();

        lines.forEach((line) => {
          processLine(line); // Process each line
        });

        await processBatch(csvRows); // Process and insert the batch into the database
        csvRows = []; // Reset batch
        callback();
      },
    });

    fs.createReadStream(csvFilePath, { encoding: "utf8" })
      .pipe(csvParser)
      .on("error", (err) => {
        logger.error("Error parsing CSV:", err);
        reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Error parsing the CSV file"
          )
        );
      })
      .on("finish", async () => {
        if (partialLine) {
          processLine(partialLine); // Process the remaining partial line
          await processBatch(csvRows); // Process and insert the remaining batch
          csvRows = []; // Reset batch
        }
        logger.debug("CSV parsing and database insertion complete");
        await calculateAgeDistribution(); // Calculate age distribution
        resolve(); // Resolve the promise
      });
  });
};

module.exports = { parseCSV };
