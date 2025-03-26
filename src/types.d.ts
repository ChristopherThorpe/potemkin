declare module 'drizzle-kit' {
  interface Config {
    schema?: string;
    out?: string;
    driver?: 'better-sqlite' | 'better-sqlite3' | 'd1' | 'd1-http' | 'mysql2' | 'pg' | 'libsql' | 'turso';
    dbCredentials?: {
      url?: string;
      filename?: string;
      accountId?: string;
      databaseId?: string;
      token?: string;
      [key: string]: string | number | boolean | undefined;
    };
    [key: string]: string | number | boolean | object | undefined;
  }
}
