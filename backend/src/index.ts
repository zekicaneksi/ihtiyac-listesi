import express, { Express, NextFunction, Request, Response } from "express";
import dbCon, { setupDatabase, User, Session } from "./db_setup";
import bcrypt from "bcrypt";
import cookie from "cookie";
import cookie_options from "./cookie_options";
import { ObjectId } from "mongodb";

const app: Express = express();
const port = 3002;

const router = express.Router();

app.use(express.json());

// When provided an user_id, it will create a new session and set the sessionid cookie.
// When user_id is null and given a session_id, it will instead set the sessionid cookie with the given session_id.
async function setCookie(
  res: Response,
  user_id: ObjectId | null,
  session_id?: string,
) {
  let sessionidToSet = "";
  if (session_id) {
    sessionidToSet = session_id;
  } else {
    if (!user_id) return;
    const insertResult = await dbCon.collection<Session>("sessions").insertOne({
      user_id: user_id,
      last_touch_date: new Date(),
    });
    sessionidToSet = insertResult.insertedId.toString();
  }

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("sessionid", sessionidToSet, cookie_options),
  );
}

// Middleware that checks the session
// sets res.locals.session with session data
// sets res.locals.user with user data
// returns 401 if session does not exist
async function checkSession(req: Request, res: Response, next: NextFunction) {
  let cookies = cookie.parse(req.headers.cookie || "");

  let sessionId: string = cookies.sessionid;

  function responseUnauthorized() {
    res.statusCode = 401;
    res.send("unauthorized");
  }

  if (sessionId) {
    const last_touch_date: Date = new Date();
    let session = await dbCon
      .collection<Session>("sessions")
      .findOneAndUpdate(
        { _id: new ObjectId(sessionId) },
        { $set: { last_touch_date: last_touch_date } },
      );
    if (session) {
      await setCookie(res, null, session._id.toString());
      session.last_touch_date = last_touch_date;
      res.locals.session = session;
      let user = await dbCon
        .collection<User>("users")
        .findOne({ _id: session.user_id });
      res.locals.user = user;
      next();
    } else {
      res.clearCookie("sessionid");
      responseUnauthorized();
    }
  } else {
    responseUnauthorized();
  }
}

router.get("/hello", checkSession, (req: Request, res: Response) => {
  console.log(res.locals.session);
  console.log(res.locals.user);
  const user: User = res.locals.user;
  res.send("Helloo " + user.fullname);
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
          await setCookie(res, insertResult.insertedId);
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

    async function setResponseForSuccess() {
      if (user?._id) await setCookie(res, user._id);
      res.statusCode = 200;
      res.send("login successful");
    }

    if (user) {
      // Username is found, check the password
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // Password is correct
        // Login the user
        await setResponseForSuccess();
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
