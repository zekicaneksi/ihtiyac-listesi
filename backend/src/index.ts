import express, { Express, Request, Response } from "express";
import dbCon, { setupDatabase, User } from "./db_setup";

const app: Express = express();
const port = 3002;

const router = express.Router();

router.get("/hello", (req: Request, res: Response) => {
  res.send("Helloo");
});

router.get("/test", async (req: Request, res: Response) => {
  const results = await dbCon.collection<User>("users").find().toArray();
  console.log(results);
  res.send("test");
});

app.use("/api", router);

async function main() {
  await setupDatabase();

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

main();
