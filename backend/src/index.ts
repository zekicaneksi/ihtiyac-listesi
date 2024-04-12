import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 3002;

const router = express.Router()

router.get("/hello", (req: Request, res: Response) => {
  res.send("Helloo");
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
