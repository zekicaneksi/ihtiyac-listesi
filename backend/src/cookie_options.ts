export default {
  domain: process.env.DOMAIN as string,
  maxAge: 3 * 24 * 60 * 60,
  path: "/",
  httpOnly: true,
  sameSite: true,
  secure: process.env.SECURE === "true",
};
