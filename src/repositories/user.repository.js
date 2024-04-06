const { postgres } = require("../config/postgres");
const db = require("../db/models");
const logger = require("../config/logger");

/**
 * Inserts users into the database in bulk.
 * @param {Array} users - Array of user objects to insert.
 */
const bulkCreateUsers = async (users) => {
  try {
    await db.users.bulkCreate(users);
  } catch (err) {
    logger.error("Error inserting data into database:", err);
    throw new Error("Error inserting data into database");
  }
};

/**
 * Calculates and logs the age distribution of users in the database.
 */
const calculateAgeDistribution = async () => {
  try {
    const query = `
      SELECT
        CASE
          WHEN age < 20 THEN '< 20'
          WHEN age BETWEEN 20 AND 40 THEN '20 to 40'
          WHEN age BETWEEN 41 AND 60 THEN '41 to 60'
          ELSE '> 60'
        END AS age_group,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
      FROM users
      GROUP BY age_group
      ORDER BY age_group;
    `;
    const result = await postgres.query(query);
    logger.info("Age-Group % Distribution:");
    result.rows.forEach((row) => {
      logger.info(`${row.age_group} | ${row.percentage}`);
    });
  } catch (err) {
    logger.error("Error calculating age distribution:", err);
    throw new Error("Error calculating age distribution");
  }
};

module.exports = { bulkCreateUsers, calculateAgeDistribution };
