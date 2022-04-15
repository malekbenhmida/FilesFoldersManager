var { initFolderApi } = require("./APIs/folders_api");
var { initFileApi } = require("./APIs/files_api");

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Credentials','true')
    next();
  });

app.listen(PORT, () => {
  console.log(`Serveur à l'écoute sur ${PORT}`);
});
router.use(express.json());
initFolderApi(app, router);
initFileApi(app, router);
