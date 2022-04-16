const initFileApi = (app, router) => {
  var { createFile, allFiles, deleteFile, moveFile } = require("../files");
  const dir_path ="DIR_PATH";

  let arrayOfFiles = allFiles.getAllFiles(dir_path + "/");

  app.get("/files", (req, res) => {
    res.send(arrayOfFiles);
  });

  var fileCreation = {
    createNewFile: (res, newFileName, dir) => {
      try {
        const filePath =
          dir && dir !== "/"
            ? dir_path + dir + "/" + newFileName
            : dir_path + "/" + newFileName;

        console.log(filePath);
        createFile(filePath);
        arrayOfFiles.push({
          name: newFileName,
          dir: dir || "/",
        });
        res.json(arrayOfFiles);
      } catch (err) {
        res.status(409).send(err);
      }
    },
  };

  var fileDeletion = {
    deleteAFile: (res, fileName, dir) => {
      try {
        for (var i = 0; i < arrayOfFiles.length; i++) {
          if (
            arrayOfFiles[i].dir === dir &&
            arrayOfFiles[i].name === fileName
          ) {
            arrayOfFiles.splice(i, 1);
            break;
          }
        }
        const filePath =
          dir && dir !== "/"
            ? dir_path + dir + "/" + fileName
            : dir_path + "/" + fileName;
        deleteFile(filePath);
        res.json(arrayOfFiles);
      } catch (err) {
        res.status(204).send(err);
      }
    },
  };

  var fileMovement = {
    moveAfile: (res, fileName, destinationPath, oldPath) => {
      if (destinationPath) {
        const oldFilePath = oldPath
          ? dir_path + oldPath + "/" + fileName
          : dir_path + "/" + fileName;
        const newFilePath = dir_path + destinationPath + "/" + fileName;
        try {
          moveFile(oldFilePath, newFilePath);
          arrayOfFiles.some((file) => {
            if (file.name === fileName) {
              file.dir = destinationPath;
              return true;
            }
            return false;
          });
          res.json(arrayOfFiles);
        } catch (err) {
          res.status(409).send(err);
        }
      } else {
        res.status(409).send("you need to specify a destination path !");
      }
    },
  };

  module.exports = {
    fileCreation,
    createFile: router.post("/file", (req, res) => {
      const { name, dir } = req.body;
      if (!dir) {
        fileCreation.createNewFile(res, name);
      } else {
        fileCreation.createNewFile(res, name, dir);
      }
    }),

    deleteFile: router.delete("/deleteFile", (req, res) => {
      const { name, dir } = req.body;
      if (!dir) {
        fileDeletion.deleteAFile(res.status(400).json({message: 'error'}), name);
      } else {
        fileDeletion.deleteAFile(res.status(200).json({message: 'File removed'}), name, dir);
      }
    }),

    moveFile: router.put("/moveFile", (req, res) => {
      const { name, dir, destination } = req.body;
      if (!dir) {
        fileMovement.moveAfile(res, name, destination);
      } else {
        fileMovement.moveAfile(res, name, destination, dir);
      }
    }),
  };
};

module.exports = {
  initFileApi,
};
