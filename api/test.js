import { replaceInFile } from "replace-in-file";
const options = {
  files: "dist/**/*.js",
  from: /\.ts/g,
  to: ".js",
};

replaceInFile(options)
  .then((results) => {
    console.log("Replacement results:", results);
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });
