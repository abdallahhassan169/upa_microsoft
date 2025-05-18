import createPostgresSubscriber from "pg-listen";
import { Pool } from "pg";

export const listener = createPostgresSubscriber({
  connectionString: "postgres://postgres:11620000@localhost:5432/first_upa_db",
});
export const sourceDb = new Pool({
  connectionString: "postgres://postgres:11620000@localhost:5432/first_upa_db",
});
export const externalDb = new Pool({
  connectionString:
    "postgres://postgres:11620000@localhost:5432/f_second_upa_db",
});
