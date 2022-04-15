var { initFolderApi } = require("./APIs/folders_api");
var { initFileApi } = require("./APIs/files_api");

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
router.use(express.json());
const app = express();
const PORT = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function supportCrossOriginScript(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
}
app.use(supportCrossOriginScript);

app.listen(PORT, () => {
  console.log(`Serveur à l'écoute sur ${PORT}`);
});
app.use("/", router);

initFolderApi(app, router);
initFileApi(app, router);
