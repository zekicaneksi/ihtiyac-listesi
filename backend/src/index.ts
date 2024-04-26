import "dotenv/config";
import express, { Express } from "express";
import { setupDatabase } from "./setup/database/db_setup";
import router from "./routers/router";

const app: Express = express();

app.use(express.json());

app.use("/api", router);

async function main() {
  await setupDatabase();

  app.listen(process.env.PORT, () => {
    console.log(
      `[server]: Server is running at http://localhost:${process.env.PORT}`,
    );
  });
}

main();
