import "dotenv/config";
import { setupDatabase } from "@/setup/database/db_setup";
import server from "./server";

async function main() {
  await setupDatabase();

  server.listen(process.env.PORT, () => {
    console.log(
      `[server]: Server is running at http://localhost:${process.env.PORT}`,
    );
  });
}

main();
