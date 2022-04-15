import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [getfiles, setGetFiles] = useState([]);
  const [getfolders, setGetFolders] = useState([]);
  const [gotoFolder, setGoToFolder] = useState("/");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/files`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        setGetFiles(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/folders`)
      .then((response) => {
        console.log(response);
        setGetFolders(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const deleteFolder = (nameFolder, dirFolder) => {
    axios
      .delete(`http://localhost:8080/folderDelete`, {
        data: { name: nameFolder, dir: dirFolder },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteFile = (nameFile, dirFile) => {
    const delFile = {
      name: nameFile,
      dir: dirFile,
    };
    console.log(delFile);
    axios
      .delete(
        `http://localhost:8080/deleteFile`,
        { data: delFile },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createFolder = () => {
    const data = {
      name: "hamza2",
      dir: "/",
    };
    axios
      .post(`http://localhost:8080/folder`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 path">
          <p>{gotoFolder}</p>
        </div>
      </div>
      <div className="row create">
        <div className="col-md-12 path">
          <i onClick={() => createFolder()} class="fa-solid fa-folder-plus"></i>
          <i class="fa-solid fa-file-circle-plus"></i>
        </div>
      </div>
      <div className="row folder">
        {getfolders
          .filter((item) => {
            if (item.dir === gotoFolder) {
              return item;
            }
          })
          .map((items) => (
            <div className="col-md-2 item">
              <div>
                <i
                  onClick={() =>
                    setGoToFolder(
                      items.dir.split("/")[1] === ""
                        ? items.dir.replace("/", "") + "/" + items.name
                        : items.dir + "/" + items.name
                    )
                  }
                  className="fa-solid fa-folder"
                ></i>
                <p>{items.name}</p>

                <i
                  onClick={() => deleteFolder(items.name, items.dir)}
                  class="fa-solid fa-trash-can"
                ></i>
                <i class="fa-solid fa-square-pen"></i>
              </div>
            </div>
          ))}
        {getfiles
          .filter((item) => {
            if (item.dir === gotoFolder) {
              return item;
            }
          })
          .map((items) => (
            <div className="col-md-2 item">
              <div>
                <i class="fa-solid fa-file-lines"></i>
                <p>{items.name}</p>

                <i
                  onClick={() => deleteFile(items.name, items.dir)}
                  class="fa-solid fa-trash-can"
                ></i>
                <i class="fa-solid fa-square-pen"></i>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
