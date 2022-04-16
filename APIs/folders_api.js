const initFolderApi = (app, router) => {
  var {
    createDirectory,
    deleteDirectory,
    allDirs,
    moveDirectory,
  } = require("../folders");
  const dir_path = "DIR_PATH";

  let arrayOfDirectories = allDirs.getAllDirectories(dir_path + "/");

  app.get("/folders", (req, res) => {
    res.send(arrayOfDirectories);
  });

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
        res.status(200).json(arrayOfDirectories);
      } catch (err) {
        res.status(409).json({message: "error"})
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
        res.status(204).json(arrayOfDirectories);
      } catch (err) {
        res.status(404).json({message:'error'});
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
          res.status(200).json(arrayOfDirectories);
        } catch (err) {
          res.status(409).json({ message: 'error'});
        }
      } else {
        res.status(409).json({message: "you need to specify a destination path !"});
      }
    },
  };

  module.exports = {
    folderCreation,
    createFolder: router.post("/folder", (req, res) => {
      const { name, dir } = req.body;
      if (!dir) {
        folderCreation.createNewFolder(res.status(400).json({message: 'error'}), name);
      } else {
        folderCreation.createNewFolder(res.status(200).json({message: 'Folder created'}), name, dir);
      }
    }),

    deleteFolder: router.delete("/folderDelete", (req, res) => {
      const { name, dir } = req.body;
      if (!dir) {
        folderDeletion.deleteAFolder( res.status(400).json({message: 'error'})
        , name);

      } else {
        folderDeletion.deleteAFolder(res.status(200).json({message: 'Folder removed'})
        , name, dir);

      }
    }),

    moveFolder: router.put("/moveFolder", (req, res) => {
      const { name, dir, destination } = req.body;
      if (!dir) {
        folderMovement.moveAfolder(res.status(400).json({message: 'error'}), name, destination);
      } else {
        folderMovement.moveAfolder(res.status(200).json({message: 'Foldet Moved'}), name, destination, dir);
      }
    }),
  };
};

module.exports = {
  initFolderApi,
};
