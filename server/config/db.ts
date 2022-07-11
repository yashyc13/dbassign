import pg from "pg"

const config = {
    user: "postgres",
    database: "assignment7",
    password: "admin",
    host: "localhost",
    port: 5432
}

const pool = new pg.Pool(config)

export { pool };