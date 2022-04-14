const fs = require("fs");
const path = require("path");

var allFiles = {
  // GET THE LIST OF ALL FILES WITHIN DIRECTORIES AND SUBDIRECTORIES

  getAllFiles: function (rootDir, fileDir, arrayOfFiles) {
    const dir = fileDir ? rootDir + fileDir : rootDir;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
      if (fs.statSync(dir + "/" + file.name).isDirectory()) {
        arrayOfFiles = allFiles.getAllFiles(
          rootDir,
          fileDir ? fileDir + "/" + file.name : file.name,
          arrayOfFiles
        );
      } else {
        fileObject = {
          name: file.name,
          dir: fileDir ? "/" + fileDir : "/",
        };
        arrayOfFiles.push(fileObject);
      }
    });
    return arrayOfFiles;
  },
};

module.exports = {
  allFiles,

  createFile: (newFilePath) => {
    if (fs.existsSync(newFilePath)) {
      const error = "This file already exists!";
      throw error;
    } else {
      fs.open(newFilePath, "w", function (err, file) {
        if (err) throw err;
        console.log("Fichier créé!");
      });
    }
  },

  deleteFile: (filePath) => {
    fs.unlinkSync(filePath, function (err) {
      if (err) throw err;
      console.log("File Deleted");
    });
  },

  moveFile: (currentFilePath, newFilePath) => {
    fs.rename(currentFilePath, newFilePath, (err) => {
      if (err) {
        throw err;
      } else {
        console.log("File moved successfully!");
      }
    });
  },
};
