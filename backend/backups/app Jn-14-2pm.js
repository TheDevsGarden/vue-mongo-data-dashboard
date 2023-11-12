const express = require("express");
const app = express();
const port = 3003;

const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

//modifications
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const csvtojson = require("csvtojson");
const fs = require("fs");

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors()); // we use this to allow cross-origin requests cross-origin requests are requests made to your server from a different domain
mongoose.connect("mongodb://127.0.0.1:27017/TP2-Steve", { useNewUrlParser: true });

// app.get("/collision-data", async (req, res) => {
//   try {
//     const response = await fetch("https://data.montreal.ca/dataset/cd722e22-376b-4b89-9bc2-7c7ab317ef6b/resource/05deae93-d9fc-4acb-9779-e0942b5e962f/download/collisions_routieres.csv");
//     if (!response.ok) throw new Error(response.statusText); // check if response went through

//     const csvData = await response.text(); // get csv data as text
//     const jsonData = await csvtojson().fromString(csvData); // convert csv text to json

//     res.send(jsonData); // send json data as response
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send({ error: "There was an error fetching data from the API." });
//   }
// });

// async function getCsvData() {
//   try {
//     const response = await axios({
//       url: "https://data.montreal.ca/dataset/cd722e22-376b-4b89-9bc2-7c7ab317ef6b/resource/05deae93-d9fc-4acb-9779-e0942b5e962f/download/collisions_routieres.csv",
//       method: "GET",
//       responseType: "stream",
//     });

//     if (!response.data) throw new Error(response.statusText); // check if response went through

//     const directoryPath = path.resolve(__dirname, "data");

//     if (!fs.existsSync(directoryPath)) {
//       fs.mkdirSync(directoryPath);
//     }
//     const filePath = path.resolve(directoryPath, "collisions_routieres.csv");

//     //const filePath = path.resolve(__dirname, "/data", "collisions_routieres.csv"); // replace 'your_directory' with your desired directory

//     const writer = fs.createWriteStream(filePath);
//     response.data.pipe(writer);

//     return new Promise((resolve, reject) => {
//       writer.on("finish", resolve);
//       writer.on("error", reject);
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     throw new Error("There was an error fetching data from the API.");
//   }
// }

async function getCsvData() {
  try {
    const response = await axios({
      url: "https://data.montreal.ca/dataset/cd722e22-376b-4b89-9bc2-7c7ab317ef6b/resource/05deae93-d9fc-4acb-9779-e0942b5e962f/download/collisions_routieres.csv",

      //
      method: "GET",
      responseType: "stream",
    });

    if (!response.data) {
      throw new Error(response.statusText); // check if response went through
    }

    //const filePath = path.resolve(__dirname, "/data", "collisions_routieres.csv"); // replace 'your_directory' with your desired directory
    const filePath = path.join(__dirname, "data", "collisions_routieres.csv");

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error:", error);
    throw new Error("There was an error fetching data from the API.");
  }
}

// Usage
getCsvData()
  .then(() => {
    console.log("CSV file saved successfully.");
  })
  .catch((error) => {
    console.error("Error:", error);
  });

async function convertToJson() {
  //const csvFilePath = path.resolve(__dirname, "/data", "collisions_routieres.csv");
  const csvFilePath = path.join(__dirname, "data", "collisions_routieres.csv");
  // const jsonFilePath = path.resolve(__dirname, "/data", "output.json");
  const jsonFilePath = path.join(__dirname, "data", "output.json");

  const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
  const jsonData = await csvtojson().fromString(csvData);

  await fs.promises.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));

  console.log("CSV data has been converted to JSON.");
}

async function updateDatabase() {
  // const jsonFilePath = path.resolve(__dirname, "/data", "output.json");
  // const jsonFilePath = path.join(__dirname, "data", "output.json");

  // const jsonData = JSON.parse(await fs.promises.readFile(jsonFilePath, "utf-8"));

  Accident.collection.drop();
  // await Accident.insertMany(jsonData);

  // console.log("Database has been updated.");

  fs.readFile("data/output.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture du fichier", err);
      return;
    }

    const jsonData = JSON.parse(data);

    Accident.insertMany(jsonData)
      .then((result) => {
        console.log("Insertion réussie");
      })
      .catch((err) => {
        console.error("Erreur d'insertion", err);
      });
  });
}

const accidentSchema = new mongoose.Schema({
  NO_SEQ_COLL: String,
  JR_SEMN_ACCDN: String,
  DT_ACCDN: Date,
  CD_MUNCP: Number,
  NO_CIVIQ_ACCDN: Number,
  SFX_NO_CIVIQ_ACCDN: String,
  BORNE_KM_ACCDN: String,
  RUE_ACCDN: String,
  TP_REPRR_ACCDN: Number,
  ACCDN_PRES_DE: String,
  NB_METRE_DIST_ACCD: Number,
  CD_GENRE_ACCDN: Number,
  CD_SIT_PRTCE_ACCDN: String,
  CD_ETAT_SURFC: Number,
  CD_ECLRM: Number,
  CD_ENVRN_ACCDN: Number,
  NO_ROUTE: String,
  CD_CATEG_ROUTE: Number,
  CD_ETAT_CHASS: String,
  CD_ASPCT_ROUTE: Number,
  CD_LOCLN_ACCDN: Number,
  CD_POSI_ACCDN: String,
  CD_CONFG_ROUTE: Number,
  CD_ZON_TRAVX_ROUTR: String,
  CD_PNT_CDRNL_ROUTE: String,
  CD_PNT_CDRNL_REPRR: String,
  CD_COND_METEO: Number,
  NB_VEH_IMPLIQUES_ACCDN: Number,
  NB_MORTS: Number,
  NB_BLESSES_GRAVES: Number,
  NB_BLESSES_LEGERS: Number,
  HEURE_ACCDN: String,
  AN: Number,
  NB_VICTIMES_TOTAL: Number,
  GRAVITE: String,
  REG_ADM: String,
  MRC: String,
  nb_automobile_camion_leger: Number,
  nb_camionLourd_tractRoutier: Number,
  nb_outil_equipement: Number,
  nb_tous_autobus_minibus: Number,
  nb_bicyclette: Number,
  nb_cyclomoteur: Number,
  nb_motocyclette: Number,
  nb_taxi: Number,
  nb_urgence: Number,
  nb_motoneige: Number,
  nb_VHR: Number,
  nb_autres_types: Number,
  nb_veh_non_precise: Number,
  NB_DECES_PIETON: Number,
  NB_BLESSES_PIETON: Number,
  NB_VICTIMES_PIETON: Number,
  NB_DECES_MOTO: Number,
  NB_BLESSES_MOTO: Number,
  NB_VICTIMES_MOTO: Number,
  NB_DECES_VELO: Number,
  NB_BLESSES_VELO: Number,
  NB_VICTIMES_VELO: Number,
  VITESSE_AUTOR: String,
  LOC_X: Number,
  LOC_Y: Number,
  LOC_COTE_QD: String,
  LOC_COTE_PD: Number,
  LOC_DETACHEE: String,
  LOC_IMPRECISION: String,
  LOC_LONG: Number,
  LOC_LAT: Number,
});

const Accident = mongoose.model("Accident", accidentSchema);

//date initiale
// 24 hours is 86400000 ms
// 1 minute is 60000 ms
var lastUpdate = new Date("2023-06-11T00:00:00.000Z");
async function update() {
  console.log("Revolving update function");

  const d = new Date();
  if (d.getTime() - lastUpdate.getTime() >= 86400000) {
    console.log("Begin waiting 24 hours");

    try {
      await getCsvData();
      console.log("Got the CSV from the server");

      await convertToJson();
      console.log("Converted CSV to JSON");

      await updateDatabase();
      console.log("Updated database");

      lastUpdate = new Date();
      console.log("Last update:", lastUpdate);
    } catch (error) {
      console.error("Error during update:", error);
    }
  }
}

setInterval(update, 300000);

async function getAccidents() {
  return await Accident.find({}).sort({ DT_ACCDN: -1 }).limit(300000);
  //return await Accident.find({}).sort({ DT_ACCDN: -1 });
  //return await Accident.find({}).sort({ DT_ACCDN: -1 }).limit(5);
  //90k il gere pas bien, sans limite il fait erreur
}
//la page vue de visualisation est http://localhost:5173/accidents ou VOTRE localhost:port/accidents
app.get("/accidents", async (req, res) => {
  try {
    const accidents = await Accident.aggregate([
      {
        $group: {
          _id: null,
          totalMorts: { $sum: "$NB_MORTS" },
          totalBlessesGraves: { $sum: "$NB_BLESSES_GRAVES" },
          totalBlessesLegers: { $sum: "$NB_BLESSES_LEGERS" },
          totalVehiculesImpliques: { $sum: "$NB_VEH_IMPLIQUES_ACCDN" },
          totalVictimesImpliques: { $sum: "$NB_VICTIMES_TOTAL" },
        },
      },
    ]);

    res.json(accidents[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.get("/accidents", (req, res) => {
//   getAccidents().then((data) => {
//     res.send(data);
//   });
// });

// Accident.find(function(err, accidents){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(accidents);
//     }
// })

// app.get('/', (req, res) => {
//     console.log(sw());
//   res.send('<h1>Hello World!</h1>')
// })

// app.get('/contact', (req, res) => {
// //   res.send('<h1>Pour nous joindre, blablabalba....</h1>')
// //   res.sendFile('contact.html')
//     console.log(__dirname + "/contact.html");
//     res.sendFile(__dirname + "/contact.html");
// })

// app.get('/', (req, res) => {
//     console.log(naruto.all);
//     console.log(yoda());
//     res.sendFile(__dirname + "/math.html");
// })

// app.post('/', (req, res) => {

//     var n1 = Number(req.body.nombreUn);
//     var n2 = Number(req.body.nombreDeux);

//     var somme = n1 + n2;
//     res.send("Voici la somme des deux nombres: " + somme);
//     // res.sendFile(__dirname + "/math.html");
// })

// app.get('/starwars', (req, res) => {
//     console.log(sw());
//   })

// app.get('/login/', (req, res) => {
//     res.send('Welcome to the login page')
// })

// app.get('/register/', (req, res) => {
//     res.send('Welcome to the register page')
// })

// app.get("/users", (req, res) => res.send("All users"))
// app.post("/addUser", (req, res) => res.send("Created user"))

// app.route("/users/:id")
//     .get((req, res) => res.send("Get user: " + req.params.id))
//     .post((req, res) => res.send("Post user: " + req.params.id))
//     .put((req, res) => res.send("Put user: " + req.params.id))
//     .patch((req, res) => res.send("Patch user: " + req.params.id))
//     .delete((req, res) => res.send("Delete user: " + req.params.id))

// // app.get('/users/:id', (req, res) => {
// //     res.send('User: ' + req.params["id"])
// //   })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
