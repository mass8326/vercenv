const { stat } = require("node:fs/promises");
const spawn = require("cross-spawn");
const dotenv = require("dotenv");
const { expand } = require("dotenv-expand");
const minimist = require("minimist");

main();

async function main() {
  const args = minimist(process.argv.slice(2));
  const [command, ...rest] = args._;
  if (!command) throw new Error("No command was provided!");

  if (!process.env.CI) {
    const [project, vercel] = await Promise.all([
      stat("package.json").catch(() => null),
      stat(".vercel/project.json").catch(() => null),
    ]);
    if (!project?.isFile()) throw new Error("Could not find package.json!");
    if (!vercel?.isFile()) throw new Error("Could not find vercel config!");
    config({ path: ".vercel/.env.development.local" });

    // Vercel may set these as empty strings, causing Turbo to error
    process.env.TURBO_REMOTE_ONLY ||= "false";
    process.env.TURBO_RUN_SUMMARY ||= "false";
  }

  if (typeof args.v === "string") parse(args.v);
  else if (Array.isArray(args.v)) parse(args.v.join("\n"));

  spawn(command, rest, { stdio: "inherit" }).on("exit", (code, signal) =>
    typeof code === "number"
      ? process.exit(code)
      : process.kill(process.pid, signal)
  );
}

function config(options) {
  const env = dotenv.config(options);
  return expand(env);
}

function parse(options) {
  const env = { parsed: dotenv.parse(options) };
  return expand(env);
}
