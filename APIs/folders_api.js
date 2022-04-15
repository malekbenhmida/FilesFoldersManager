const initFolderApi = (app, router) => {
  var {
    createDirectory,
    deleteDirectory,
    allDirs,
    allContent,
    moveDirectory,
  } = require("../folders");
  const dir_path = "C:/Users/Malek Ben Hmida/Desktop/testprojet";

  let arrayOfDirectories = allDirs.getAllDirectories(dir_path + "/");

  app.get("/folders", (req, res) => {
    res.send(arrayOfDirectories);
  });

  var contentListing = {
    listContent: (res, folderName, dir) => {
      const dirPath =
          dir && dir !== "/"
            ? dir_path + dir
            : dir_path 
      let arrayOfContent = allContent.getAllContentFromDir(
        dirPath,
        folderName
      );
      res.json(arrayOfContent);
    },
  };

  var folderCreation = {
    createNewFolder: (res, newFolderName, dir) => {
      try {
        const dirPath =
          dir && dir !== "/"
            ? dir_path + dir + "/" + newFolderName
            : dir_path + "/" + newFolderName;
        createDirectory(dirPath);
        arrayOfDirectories.push({
          name: newFolderName,
          dir,
        });
        res.json(arrayOfDirectories);
      } catch (err) {
        res.status(409).send(err);
      }
    },
  };
  var folderDeletion = {
    deleteAFolder: (res, folderName, dir) => {
      try {
        for (var i = 0; i < arrayOfDirectories.length; i++) {
          if (
            arrayOfDirectories[i].name === folderName &&
            arrayOfDirectories[i].dir === dir
          ) {
            arrayOfDirectories.splice(i, 1);
          }
        }
        const dirPath =
          dir && dir !== "/"
            ? dir_path + dir + "/" + folderName
            : dir_path + "/" + folderName;
        deleteDirectory(dirPath);
        res.json(arrayOfDirectories);
      } catch (err) {
        res.status(204).send(err);
      }
    },
  };

  var folderMovement = {
    moveAfolder: (res, folderName, destinationPath, oldPath) => {
      if (destinationPath) {
        const oldFolderPath = oldPath
          ? dir_path + oldPath + "/" + folderName
          : dir_path + "/" + folderName;
        const newFolderPath = dir_path + destinationPath + "/" + folderName;
        try {
          moveDirectory(oldFolderPath, newFolderPath);
          arrayOfDirectories.some((d) => {
            if (d.name === folderName) {
              d.dir = destinationPath;
              return true;
            }
            return false;
          });
          res.json(arrayOfDirectories);
        } catch (err) {
          res.status(409).send(err);
        }
      } else {
        res.status(409).send("you need to specify a destination path !");
      }
    },
  };

  module.exports = {
    folderCreation,

    listFolderContent: router.get("/folderContent", (req, res) => {
      const { name, dir } = req.body;
      console.log(req.body);
      if (!dir) {
        contentListing.listContent(res, name);
      } else {
        contentListing.listContent(res, name, dir);
      }
    }),

    createFolder: router.post("/folder", (req, res) => {
      const { name, dir } = req.body;
      if (!dir) {
        folderCreation.createNewFolder(res, name);
      } else {
        folderCreation.createNewFolder(res, name, dir);
      }
    }),

    deleteFolder: router.delete("/folderDelete", (req, res) => {
      const { name, dir } = req.body;
      if (!dir) {
        folderDeletion.deleteAFolder(res, name);
      } else {
        folderDeletion.deleteAFolder(res, name, dir);
      }
    }),

    moveFolder: router.put("/moveFolder", (req, res) => {
      const { name, dir, destination } = req.body;
      if (!dir) {
        folderMovement.moveAfolder(res, name, destination);
      } else {
        folderMovement.moveAfolder(res, name, destination, dir);
      }
    }),
  };
};

module.exports = {
  initFolderApi,
};
