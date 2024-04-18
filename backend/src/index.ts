import express, { Express, Request, Response } from "express";
import dbCon, { setupDatabase, User } from "./db_setup";
import bcrypt from "bcrypt";
import cookie from "cookie";

const app: Express = express();
const port = 3002;

const router = express.Router();

app.use(express.json());

router.get("/hello", (req: Request, res: Response) => {
  let cookies = cookie.parse(req.headers.cookie || "");
  console.log(cookies);
  res.send("Helloo");
});

router.get("/test", async (req: Request, res: Response) => {
  const results = await dbCon.collection<User>("users").find().toArray();
  console.log(results);
  res.send("test");
});

function setCookie(res: Response) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("foo", "bar", {
      domain: "localhost",
      maxAge: 3 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: true,
      secure: false,
    }),
  );
}

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
          setCookie(res);
          res.send("creation successful");
        } else {
          res.statusCode = 500;
          res.send("something went wrong");
        }
      }
    }
  },
);

interface LoginBody {
  username: string;
  password: string;
}

router.post(
  "/login",
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const user: User | null = await dbCon
      .collection<User>("users")
      .findOne({ username: req.body.username });

    function setResponseForFailure() {
      res.statusCode = 401;
      res.send("invalid credentials");
    }

    function setResponseForSuccess() {
      setCookie(res);
      res.statusCode = 200;
      res.send("login successful");
    }

    if (user) {
      // Username is found, check the password
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // Password is correct
        // Login the user
        setResponseForSuccess();
      } else {
        // Password is incorrect
        setResponseForFailure();
      }
    } else {
      // Username is not found
      setResponseForFailure();
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
