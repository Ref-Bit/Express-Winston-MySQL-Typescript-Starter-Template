import mysql, { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { MySQLQueryError } from "../types/db.type";
import { logger } from "../utils/logger.utils";

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "myPassword",
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function executeQuery<T>(
  query: string,
  params: unknown[]
): Promise<T extends ResultSetHeader ? ResultSetHeader : RowDataPacket[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query, params);
    logger.info("Executed Query Successful...✔✔✔");
    return rows as T extends ResultSetHeader
      ? ResultSetHeader
      : RowDataPacket[];
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

export async function executeTransaction(
  queries: string[],
  params: unknown[][]
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const queryParams = params[i];

      await connection.query(query, queryParams);
    }

    await connection.commit();
    logger.info("Transaction Successful...✔✔✔");
  } catch (err) {
    await connection.rollback();
    logger.error("Error executing transaction:", err);
  } finally {
    connection.release();
  }
}

export function isMysqlQueryError(error: unknown): error is MySQLQueryError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "errno" in error &&
    "sqlMessage" in error &&
    "sqlState" in error &&
    "message" in error
  );
}
