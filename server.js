var { initFolderApi } = require("./APIs/folders_api");
var { initFileApi } = require("./APIs/files_api");

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);

app.listen(8080, () => {
  console.log("Serveur à l'écoute!");
});
router.use(express.json());
initFolderApi(app, router);
initFileApi(app, router);
