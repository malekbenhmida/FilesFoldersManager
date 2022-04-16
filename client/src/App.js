import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'

function App() {

  const [getfiles, setGetFiles] = useState([])
  const [getfolders, setGetFolders] = useState([])
  const [gotoFolder, setGoToFolder] = useState('/')
  const [folderName, setFolderName] = useState('')
  const [openInput, setOpenInput] = useState('')
  const [moveInput, setMoveInput] = useState('')
  const [movefileName, setMoveFileName] = useState('')
  const [movefileDir, setMoveFileDir] = useState('')
  const [destination, setDestination] = useState('')
  const [movefolderName, setMoveFolderName] = useState('')
  const [movefolderDir, setMoveFolderDir] = useState('')

  
  
  useEffect(() => {
    axios.get(`http://localhost:8080/files`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*",
      }
    })
      .then((response) => {
        console.log(response)
        setGetFiles(response.data)
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  })

  useEffect(() => {
    axios.get(`http://localhost:8080/folders`)
      .then((response) => {
        console.log(response.data)
        setGetFolders(response.data)
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  })
  

 const unique = getfolders.filter((element) => {
    if(element.dir !== '/'){
      return element
    }
});


  const deleteFolder = (nameFolder, dirFolder) => {

    axios.delete(`http://localhost:8080/folderDelete`, { data: { name: nameFolder, dir: dirFolder } })
      .then((response) => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const deleteFile = (nameFile, dirFile) => {

    axios.delete(`http://localhost:8080/deleteFile`, { data: { name: nameFile, dir: dirFile } })
      .then((response) => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const createFolder = () => {
    const data = {
      "name": folderName,
      "dir": gotoFolder
    }
    axios.post(`http://localhost:8080/folder`, data)
      .then((response) => {
        console.log(response)
        setOpenInput('')

      })
      .catch(error => {
        console.log(error)
      })
  }

  const createFile = () => {
    const data = {
      "name": folderName,
      "dir": gotoFolder
    }
    axios.post(`http://localhost:8080/file`, data)
      .then((response) => {
        console.log(response)
        setOpenInput('')
      })
      .catch(error => {
        console.log(error)
      })
  }

  const moveFile = ()=>{ 
     const data = {
       "name":movefileName,
       "dir":movefileDir,
      "destination": destination
    }

    axios.put("http://localhost:8080/moveFile", data)
    .then((response) => {
      console.log(response)
      setMoveInput('')

    })
    .catch(error => {
      console.log(error)
    })
  }
  const moveFolder = (nameFolder,dirFolder)=>{ 
    const data = {
      "name": movefolderName,
      "dir":movefolderDir,
      "destination": destination
    }
    axios.put("http://localhost:8080/moveFolder", data)
    .then((response) => {
      console.log(response)
      setMoveInput('')
    })
    .catch(error => {
      console.log(error)
    })
  }
  return (
    <div className="container">
      <div className="row ">
        <div className="col-md-12 create">
          <i onClick={() => setOpenInput('addFolder')} class="fa-solid fa-folder-plus"></i>
          <i onClick={() => setOpenInput('addFile')} class="fa-solid fa-file-circle-plus"></i>
          <div className="input_foldername" style={{ display: openInput === 'addFolder' || openInput === 'addFile' ? "block" : "none" }}>
            <input type="text" placeholder={openInput === 'addFolder' ? "FolderName" : openInput === 'addFile' ? "FileName" : null} onChange={(e) => setFolderName(e.target.value)} />
            <button className="confirm" onClick={openInput === 'addFolder' ? () => createFolder() : openInput === 'addFile' ? () => createFile() : null} >Confirm</button>
            <button className="cancel"  onClick={() => setOpenInput('')} >Cancel</button>
          </div>
          <div  className="input_foldername" style={{ display: moveInput === 'moveFolder' || moveInput === 'moveFile' ? "block" : "none" }}>
              <input list="list_dir"  placeholder={moveInput === 'moveFolder' ? "Move Folder To " : moveInput === 'moveFile' ? "Move File To" : null}  onChange={(e)=> setDestination(e.target.value)}  />
              <datalist id="list_dir">
              <option value="/"  ></option>
              {unique.map((item)=><>
              <option value={item.dir}>{item.dir}</option>
              </>)}
              </datalist>
              <button className="confirm" onClick={moveInput === 'moveFolder' ? () => moveFolder() : moveInput === 'moveFile' ? () => moveFile() : null} >Confirm</button>
              <button className="cancel"  onClick={() => setMoveInput('')} >Cancel</button>

          </div>
              
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 path">
          <p>Dir_Path{gotoFolder}</p>
          <i onClick={() => setGoToFolder("/")} class="fa-solid fa-house-chimney-window"></i>
        </div>
      </div>

      <div className="row folder">
        {getfolders.filter(item => {
          if (item.dir === gotoFolder) {
            return item
          }
        }).map((items) =>

          <div className="col-md-2 item">
            <div>
              <i onClick={() => setGoToFolder(items.dir.split('/')[1] === '' ? items.dir.replace('/', '') + "/" + items.name : items.dir + "/" + items.name)} className="fa-solid fa-folder"></i>
              <p>{items.name}</p>
            </div>
            <i onClick={() => deleteFolder(items.name, items.dir)} class="fa-solid fa-trash-can" title="Delete"></i>
            <i onClick={() => [setMoveInput('moveFolder'),setMoveFolderName(items.name),setMoveFolderDir(items.dir)]} class="fa-solid fa-square-pen" title="Move Folder"></i>


          </div>
        )}
        {getfiles.filter(item => {
          if (item.dir === gotoFolder) {
            return item
          }
        }).map((items) =>
          <div className="col-md-2 item">
            {getfiles.length === 0 && getfolders.length === 0 && items.dir === gotoFolder ? <p>empty</p> : <><div>
              <i class="fa-solid fa-file-lines"></i>
              <p>{items.name}</p>
            </div>
              <i onClick={() => deleteFile(items.name, items.dir)} class="fa-solid fa-trash-can" title="Delete"></i>
              <i onClick={() => [setMoveInput('moveFile'),setMoveFileName(items.name),setMoveFileDir(items.dir)]} class="fa-solid fa-square-pen" title="Move File"></i>
            </>}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
