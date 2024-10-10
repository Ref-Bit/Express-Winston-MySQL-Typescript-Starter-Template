export type MySQLQueryError = {
  code: number;
  errno: number;
  sqlMessage: string;
  sqlState: string;
  message: string;
};
