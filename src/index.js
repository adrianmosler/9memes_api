// importamos dependencias
import * as config from "../config";
import express from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";

// import routes
import { publicationRoutes } from "./routes/publication.route";
import { userRoutes } from "./routes/user.route";

const app = express();

//middlewares de body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROUTES
app.use("/publication", publicationRoutes);
app.use("/user", userRoutes);

app.get("/", function (req, res) {
  res.json({ mensaje: "Bienvenidos al servidor de 9 MEMES" });
});

// connected to DB
connect(
  config.mongoDB,
  { useNewUrlParser: true, useCreateIndex: true },
  (err, res) => {
    if (err) throw err;
    else {
      console.log("Bases de datos conectada con éxito");
    }
  }
);
// listening server
app.listen(process.env.PORT, () => {
  console.log(`9MEMEs api listening at http://localhost:${process.env.PORT}`);
});
