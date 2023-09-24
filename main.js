const fs = require("fs/promises");
const inquirer = require("inquirer");
const nanospinner = require("nanospinner");
const figlet = require("figlet");
const gradient = require("gradient-string");
const shell = require("shelljs");
const packageData = require("./package.json");
const log = console.log;

(async () => {
  showTitle();
  const answers = await askQuestions();
  cracking(answers);
})();

function showTitle() {
  const title = "NoSQL BOOSTER CRACK";
  const version = `version ${packageData.version} by sour.dev`;
  const fonts = ["Calvin S", "Elite", "Pagga"];
  log(
    gradient.vice.multiline(
      [
        figlet.textSync(title, {
          font: fonts[Math.floor(Math.random() * fonts.length)],
          verticalLayout: "fitted",
          width: 200,
        }),
        version,
      ].join("\n")
    )
  );
}

async function askQuestions() {
  const spinner = nanospinner.createSpinner();
  const question1 = {
    type: "list",
    name: "os",
    message: "Platforms:",
    choices: ["Mac", "Window"],
    default: "Mac",
  };

  let question2 = {
    type: "input",
    name: "path",
    message: "Path:",
    validate: (input) => {
      if (input === "") {
        spinner.error({ text: "path is required." });
        return;
      }
      return true;
    },
  };

  const question3 = {
    type: "number",
    name: "days",
    message: "Duration:",
    default: 360,
  };
  const prompt = inquirer.createPromptModule();
  let answers = {};
  const answer1 = await prompt(question1);
  if (answer1.os === "Mac") {
    answer1.platform = "darwin";
    question2.default =
      "/Applications/NoSQLBooster for MongoDB.app/Contents/Resources/";
  } else if (answer1.os === "Window") {
    answer1.platform = "win32";
  } else {
    answer1.platform = "linux";
    question2.default = "/linux";
  }
  log(
    `✨ Tip: go to your "NoSQL BOOSTER" resources directory > copy path & paste`
  );
  const answer2 = await prompt(question2);
  answers = answer2;
  const answer3 = await prompt(question3);
  answers = { ...answer1, ...answer2, ...answer3 };
  return answers;
}

async function cracking(answers) {
  const spinner = nanospinner.createSpinner();
  //checking platform
  spinner.start({ text: "checking platform" });
  if (answers.platform != process.platform) {
    spinner.error({ text: `wrong platform, try again.` });
    shell.exit(1);
  }
  spinner.success({ text: "platform" });

  try {
    //check directory exist
    spinner.start({ text: "checking directory" });
    await fs.access(answers.path);
    spinner.success({ text: "directory founded" });

    // cd to directory path
    shell.cd(answers.path);

    //run extract cmd
    spinner.start({ text: "extracting" });
    const extractCmd = `npx asar extract app.asar app`;
    shell.exec(extractCmd, async (error, stdout, stderr) => {
      if (error) {
        spinner.error({ text: error.message });
        shell.exit(1);
      }
      spinner.success({ text: "extracted" });

      // back to previous working directory
      shell.cd("-");

      //read and rewrite file
      spinner.start({ text: "replacing" });
      let filePath = "";
      let crackPath = "";
      if (answers.os === "Mac") {
        filePath = "app/shared/lmCore.js";
        crackPath = `${__dirname}/crack/lmCore.js`;
      }
      if (answers.os === "Window") {
        filePath = "\\app\\shared\\lmCore.js";
        crackPath = `${__dirname}\\crack\\lmCore.js`;
      }
      let data = await fs.readFile(crackPath, "utf-8");
      let newData = data.replace(
        "MAX_TRIAL_DAYS=150,TRIAL_DAYS=30",
        `MAX_TRIAL_DAYS=${answers.days},TRIAL_DAYS=${answers.days}`
      );
      await fs.writeFile(`${answers.path}${filePath}`, newData);
      spinner.success({ text: "replaced" });

      // cd to directory path
      spinner.start({ text: "packing" });
      shell.cd(answers.path);

      //run pack cmd
      const packCmd = "npx asar pack app.asar app";
      shell.exec(packCmd, (error, stdout, stderr) => {
        if (error) {
          spinner.error({ text: error });
          shell.exit(1);
        }
        spinner.success({ text: "packed" });

        // back to previous working directory
        shell.cd("-");

        // creaked successful
        spinner.success({ text: "cracked" });
      });
    });
  } catch (error) {
    spinner.error({ text: "path directory not found." });
  }
}
