const fs = require("fs");
const fsys = require("fs-extra");
const path = require("path");

var allDirs = {
  // GET THE LIST OF ALL DIRECTORIES AND SUBDIRECTORIES
  getAllDirectories: function (rootDir, dir, arrayOfDirectories) {
    arrayOfDirectories = arrayOfDirectories || [];
    const directory = dir ? rootDir + dir : rootDir;
    fs.readdirSync(directory, { withFileTypes: true })
      .filter((item) => item.isDirectory())
      .forEach((item) => {
        const dirInfo = {
          name: item.name,
          dir: dir ? "/" + dir : "/",
        };
        arrayOfDirectories = allDirs.getAllDirectories(
          rootDir,
          dir ? dir + "/" + item.name : item.name,
          arrayOfDirectories
        );
        arrayOfDirectories.push(dirInfo);
      });

    return arrayOfDirectories;
  },
};

var allContent = {
  getAllContentFromDir: function (dirPath, dirName, arrayOfContent) {
     arrayOfContent = fs.readdirSync(dirPath + "/" + dirName) || [];
    return arrayOfContent;
  },
};

module.exports = {
  allDirs,
  allContent,
  createDirectory: (newDirPath) => {
    if (fs.existsSync(newDirPath)) {
      const error = "This directory already exists!";
      console.log(error);
      throw error;
    } else {
      fs.mkdir(newDirPath, (err) => {
        if (err) {
          throw err;
        } else {
          console.log("New folder created in ", newDirPath);
        }
      });
    }
  },

  deleteDirectory: (folderPath) => {
    fs.rmdir(folderPath, (err) => {
      if (err) {
        throw err;
      }
      console.log("Folder removed");
    });
  },

  moveDirectory: (currentDirectoryPath, newDirectoryPath) => {
    fsys.move(currentDirectoryPath, newDirectoryPath, (err) => {
      if (err) {
        throw err;
      } else {
        console.log("Folder moved successfully!");
      }
    });
  },
};
