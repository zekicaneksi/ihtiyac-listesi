import express, { Express, Request, Response } from "express";
import dbCon, { setupDatabase, User } from "./db_setup";
import bcrypt from "bcrypt";

const app: Express = express();
const port = 3002;

const router = express.Router();

app.use(express.json());

router.get("/hello", (req: Request, res: Response) => {
  res.send("Helloo");
});

router.get("/test", async (req: Request, res: Response) => {
  const results = await dbCon.collection<User>("users").find().toArray();
  console.log(results);
  res.send("test");
});

interface RegisterBody {
  username: string;
  fullname: string;
  password: string;
}

router.post(
  "/register",
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const bodyUser: RegisterBody = req.body;

    let checkRegexps = {
      containsSpecialCharacters: /[^a-zA-Z0-9]/,
      charactersAndSpacesOnly: /[^a-zA-Z ]/,
      containsWhiteSpace: /[ ]/,
    };

    // Validating fields
    res.statusCode = 409;
    if (checkRegexps.containsSpecialCharacters.test(bodyUser.username)) {
      res.send("Username cannot contain special characters");
    } else if (bodyUser.username.length < 6 || bodyUser.username.length > 15) {
      res.send("Username must be 6-15 characters long");
    } else if (checkRegexps.charactersAndSpacesOnly.test(bodyUser.fullname)) {
      res.send("Full name must consist of characters and spaces only");
    } else if (bodyUser.fullname.length < 4 || bodyUser.fullname.length > 25) {
      res.send("Fullname must be 4-25 characters long");
    } else if (checkRegexps.containsWhiteSpace.test(bodyUser.password)) {
      res.send("Password cannot contain whitespaces");
    } else if (bodyUser.password.length < 8 || bodyUser.password.length > 20) {
      res.send("Password must be 8-20 characters long");
    } else {
      // Validation successful
      // Checking if username exists
      const checkUsernameResult = await dbCon
        .collection<User>("users")
        .findOne({ username: bodyUser.username });
      if (checkUsernameResult) {
        res.statusCode = 406;
        res.send("Username exists");
      } else {
        // Username doesn't exist, creating user

        // Hashing the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(bodyUser.password, salt);

        const insertResult = await dbCon.collection<User>("users").insertOne({
          username: bodyUser.username,
          password: hashedPassword,
          fullname: bodyUser.fullname,
          memberOfRooms: [],
          profilePictureId: null,
        });
        if (insertResult.insertedId) {
          res.statusCode = 201;
          res.send("creation successful");
        } else {
          res.statusCode = 500;
          res.send("something went wrong");
        }
      }
    }
  },
);

app.use("/api", router);

async function main() {
  await setupDatabase();

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

main();
