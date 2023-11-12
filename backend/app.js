const express = require("express");
const app = express();
const port = 3004;

const axios = require("axios");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const csvVersJson = require("csvtojson");
const cors = require("cors");

//node-fetch asynchrone
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

mongoose.connect("mongodb://127.0.0.1:27017/TP2", {
  useNewUrlParser: true,
});

app.use(cors());

const schemaAccident = new mongoose.Schema({
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

const Accident = mongoose.model("Accident", schemaAccident);

async function recuperer() {
  try {
    console.log("Début de la récupération des données...");

    const reponse = await axios({
      url: "https://data.montreal.ca/dataset/cd722e22-376b-4b89-9bc2-7c7ab317ef6b/resource/05deae93-d9fc-4acb-9779-e0942b5e962f/download/collisions_routieres.csv",
      method: "GET",
      responseType: "stream",
    });
    if (!reponse.data) {
      throw new Error(reponse.statusText);
    }

    const cheminFichier = path.join(__dirname, "data", "collisions_routieres.csv");
    const writer = fs.createWriteStream(cheminFichier);
    reponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log("Fin de la récupération des données.");
        resolve();
      });
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
}

async function convertir() {
  console.log("Début de la conversion du CSV en JSON...");

  const cheminCsv = path.join(__dirname, "data", "collisions_routieres.csv");
  const cheminJson = path.join(__dirname, "data", "sortie.json");

  const dataCsv = await fs.promises.readFile(cheminCsv, "utf-8");
  const dataJson = await csvVersJson().fromString(dataCsv);

  await fs.promises.writeFile(cheminJson, JSON.stringify(dataJson, null, 2));

  console.log("Fin de la conversion du CSV en JSON.");
}

async function insererBD() {
  console.log("Insertion des données...");

  try {
    const cheminJson = path.join(__dirname, "data", "sortie.json");
    const dataJson = JSON.parse(await fs.promises.readFile(cheminJson, "utf-8"));

    //modification, techniquement pas nécessaire, mais pour être prudent et ne pas dupliquer les données
    await Accident.insertMany(dataJson);

    console.log("Données insérées avec succès dans MongoDB.");
  } catch (error) {
    console.error("Erreur lors de l'insertion des données dans MongoDB: ", error);
  }
}

async function supprimerDonneesBD() {
  try {
    console.log("Suppression des données existantes dans MongoDB...");

    //await Accident.deleteMany({});
    await Accident.collection.drop();

    console.log("Données existantes supprimées avec succès de MongoDB.");
  } catch (error) {
    console.error("Erreur lors de la suppression des données dans MongoDB:", error);
  }
}

async function initialiserDonnees() {
  console.log("Initialisation des données...");

  await recuperer();
  await convertir();
  await supprimerDonneesBD();
  await insererBD();

  console.log("Données initialisées avec succès.");
}

async function miseaJour() {
  console.log("Mise à jour des données...");

  await recuperer();
  await convertir();
  await supprimerDonneesBD();
  await insererBD();

  console.log("Données mises à jour.");
}

initialiserDonnees();
setInterval(miseaJour, 86400000);

app.get("/accidents", async (req, res) => {
  try {
    const maxYearResult = await Accident.aggregate([
      {
        $group: {
          _id: null,
          maxYear: { $max: "$AN" },
        },
      },
    ]);

    const maxYear = maxYearResult[0].maxYear;
    const fiveYearsAgo = maxYear - 5;
    const accidentsParAnnee = await Accident.aggregate([
      {
        $match: {
          AN: { $gte: fiveYearsAgo },
        },
      },
      {
        $group: {
          _id: "$AN",
          totalAccidents: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const accidentsParAnneeObj = {};
    accidentsParAnnee.forEach((accident) => {
      accidentsParAnneeObj[accident._id] = accident.totalAccidents;
    });

    const totalAccidents = await Accident.aggregate([
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

    const accidentsParTypeVehicule = await Accident.aggregate([
      {
        $group: {
          _id: null,
          totalAutomobileCamionLeger: { $sum: "$nb_automobile_camion_leger" },
          totalCamionLourdTractRoutier: { $sum: "$nb_camionLourd_tractRoutier" },
          totalOutilEquipement: { $sum: "$nb_outil_equipement" },
          totalTousAutobusMinibus: { $sum: "$nb_tous_autobus_minibus" },
          totalBicyclette: { $sum: "$nb_bicyclette" },
          totalCyclomoteur: { $sum: "$nb_cyclomoteur" },
          totalMotocyclette: { $sum: "$nb_motocyclette" },
          totalTaxi: { $sum: "$nb_taxi" },
          totalUrgence: { $sum: "$nb_urgence" },
          totalMotoneige: { $sum: "$nb_motoneige" },
          totalVHR: { $sum: "$nb_VHR" },
          totalAutresTypes: { $sum: "$nb_autres_types" },
          totalVehNonPrecise: { $sum: "$nb_veh_non_precise" },
        },
      },
    ]);

    const accidentsParHeure = await Accident.aggregate([
      {
        $group: {
          _id: "$HEURE_ACCDN",
          totalAccidents: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const accidentsParHeureObj = {};
    accidentsParHeure.forEach((accident) => {
      accidentsParHeureObj[accident._id] = accident.totalAccidents;
    });

    const accidentsParJourSemaine = await Accident.aggregate([
      {
        $group: {
          _id: "$JR_SEMN_ACCDN",
          // totalAccidents: { $sum: 1 },
          avgAccidents: { $avg: "$JR_SEMN_ACCDN" },
          // $project: {
          //   _id: 1,
          //   avgAccidentsPerYear: { $divide: ["$avgAccidents", 2190] },
          // },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const accidentsParJourSemaineObj = {};
    accidentsParJourSemaine.forEach((accident) => {
      accidentsParJourSemaineObj[accident._id] = accident.totalAccidents;
    });

    res.json({
      accidentsParAnnee: accidentsParAnneeObj,
      totalAccidents: totalAccidents[0],
      accidentsParTypeVehicule: accidentsParTypeVehicule,
      accidentsParHeure: accidentsParHeureObj,
      accidentsParJourSemaine: accidentsParJourSemaineObj,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.get("/accidents", async (req, res) => {
//   try {
//     const accidents = await Accident.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalMorts: { $sum: "$NB_MORTS" },
//           totalBlessesGraves: { $sum: "$NB_BLESSES_GRAVES" },
//           totalBlessesLegers: { $sum: "$NB_BLESSES_LEGERS" },
//           totalVehiculesImpliques: { $sum: "$NB_VEH_IMPLIQUES_ACCDN" },
//           totalVictimesImpliques: { $sum: "$NB_VICTIMES_TOTAL" },
//         },
//       },
//     ]);

//     const aggregateResults = await Accident.aggregate([
//       {
//         $group: {
//           _id: "$CD_MUNCP",
//           totalMorts: { $sum: "$NB_MORTS" },
//           avgLong: { $avg: "$LOC_LONG" },
//           avgLat: { $avg: "$LOC_LAT" },
//         },
//       },
//       { $sort: { totalMorts: -1 } },
//     ]);

//     const municipaliteMaxMorts = aggregateResults[0];
//     if (!municipaliteMaxMorts) {
//       return res.status(404).json({ message: "Aucune donnée trouvée." });
//     }
//     const { _id, totalMorts, avgLong, avgLat } = municipaliteMaxMorts;
//     const pointMoyen = { longitude: avgLong, latitude: avgLat };
//     const googleMapsLink = `https://www.google.com/maps/?q=${avgLat},${avgLong}`;

//     res.json({
//       accidentStats: accidents[0],
//       municipaliteMaxMorts: { idMunicipalite: _id, totalMorts, pointMoyen, googleMapsLink },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.get("/accidents", async (req, res) => {
//   try {
//     const accidents = await Accident.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalMorts: { $sum: "$NB_MORTS" },
//           totalBlessesGraves: { $sum: "$NB_BLESSES_GRAVES" },
//           totalBlessesLegers: { $sum: "$NB_BLESSES_LEGERS" },
//           totalVehiculesImpliques: { $sum: "$NB_VEH_IMPLIQUES_ACCDN" },
//           totalVictimesImpliques: { $sum: "$NB_VICTIMES_TOTAL" },
//         },
//       },
//     ]);

//     res.json(accidents[0]);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.get("/municipalite-max-morts", async (req, res) => {
//   try {
//     // Trouver la municipalite avec le plus de morts

//     const aggregateResults = await Accident.aggregate([
//       {
//         $group: {
//           _id: "$CD_MUNCP",
//           totalMorts: { $sum: "$NB_MORTS" },
//           avgLong: { $avg: "$LOC_LONG" },
//           avgLat: { $avg: "$LOC_LAT" },
//         },
//       },
//       { $sort: { totalMorts: -1 } },
//     ]);

//     const municipaliteMaxMorts = aggregateResults[0];
//     if (!municipaliteMaxMorts) {
//       return res.status(404).json({ message: "Aucune donnée trouvée." });
//     }
//     const { _id, totalMorts, avgLong, avgLat } = municipaliteMaxMorts;
//     // Moyenne de toutes les coordonnees geographiques de cette municipalite
//     const pointMoyen = { longitude: avgLong, latitude: avgLat };
//     // lien vers Google Maps avec les coordonnees moyennes pour teste
//     const googleMapsLink = `https://www.google.com/maps/?q=${avgLat},${avgLong}`;
//     console.log(`Lien vers Google Maps : ${googleMapsLink}`);
//     res.json({ idMunicipalite: _id, totalMorts, pointMoyen, googleMapsLink });
//   } catch (error) {
//     console.error("Erreur lors de la recherche de la municipalité avec le plus de morts :", error);
//     res.status(500).json({ message: "Erreur interne du serveur." });
//   }
// });

// app.get("/accidents", async (req, res) => {
//   try {
//     const accidents = await Accident.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalMorts: { $sum: "$NB_MORTS" },
//           totalBlessesGraves: { $sum: "$NB_BLESSES_GRAVES" },
//           totalBlessesLegers: { $sum: "$NB_BLESSES_LEGERS" },
//           totalVehiculesImpliques: { $sum: "$NB_VEH_IMPLIQUES_ACCDN" },
//           totalVictimesImpliques: { $sum: "$NB_VICTIMES_TOTAL" },
//         },
//       },
//     ]);

//     res.json(accidents[0]);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
app.get("/municipalite-max-morts", async (req, res) => {
  try {
    // Trouver la municipalite avec le plus de morts
    const aggregateResults = await Accident.aggregate([
      {
        $group: {
          _id: "$CD_MUNCP",

          totalMorts: { $sum: "$NB_MORTS" },

          avgLong: { $avg: "$LOC_LONG" },

          avgLat: { $avg: "$LOC_LAT" },
        },
      },

      { $sort: { totalMorts: -1 } },
    ]);
    const municipaliteMaxMorts = aggregateResults[0];
    if (!municipaliteMaxMorts) {
      return res.status(404).json({ message: "Aucune donnée trouvée." });
    }
    const { _id, totalMorts, avgLong, avgLat } = municipaliteMaxMorts;
    // Moyenne de toutes les coordonnees geographiques de cette municipalite
    const pointMoyen = { longitude: avgLong, latitude: avgLat };
    // lien vers Google Maps avec les coordonnees moyennes pour teste
    const googleMapsLink = `https://www.google.com/maps/?q=${avgLat},${avgLong}`;
    console.log(`Lien vers Google Maps : ${googleMapsLink}`);
    res.json({ idMunicipalite: _id, totalMorts, pointMoyen, googleMapsLink });
  } catch (error) {
    console.error("Erreur lors de la recherche de la municipalité avec le plus de morts :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});

//old code
// const express = require("express");
// const app = express();
// const port = 3003;

// const axios = require("axios");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger.json");

// //modifications
// const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
// const csvtojson = require("csvtojson");
// const fs = require("fs");

// // app.use(bodyParser.urlencoded({ extended: true }))
// // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use(cors()); // we use this to allow cross-origin requests cross-origin requests are requests made to your server from a different domain
// mongoose.connect("mongodb://127.0.0.1:27017/TP2-Steve", { useNewUrlParser: true });

// // app.get("/collision-data", async (req, res) => {
// //   try {
// //     const response = await fetch("https://data.montreal.ca/dataset/cd722e22-376b-4b89-9bc2-7c7ab317ef6b/resource/05deae93-d9fc-4acb-9779-e0942b5e962f/download/collisions_routieres.csv");
// //     if (!response.ok) throw new Error(response.statusText); // check if response went through

// //     const csvData = await response.text(); // get csv data as text
// //     const jsonData = await csvtojson().fromString(csvData); // convert csv text to json

// //     res.send(jsonData); // send json data as response
// //   } catch (error) {
// //     console.error("Error:", error);
// //     res.status(500).send({ error: "There was an error fetching data from the API." });
// //   }
// // });

// // async function getCsvData() {
// //   try {
// //     const response = await axios({
// //       url: "https://data.montreal.ca/dataset/cd722e22-376b-4b89-9bc2-7c7ab317ef6b/resource/05deae93-d9fc-4acb-9779-e0942b5e962f/download/collisions_routieres.csv",
// //       method: "GET",
// //       responseType: "stream",
// //     });

// //     if (!response.data) throw new Error(response.statusText); // check if response went through

// //     const directoryPath = path.resolve(__dirname, "data");

// //     if (!fs.existsSync(directoryPath)) {
// //       fs.mkdirSync(directoryPath);
// //     }
// //     const filePath = path.resolve(directoryPath, "collisions_routieres.csv");

// //     //const filePath = path.resolve(__dirname, "/data", "collisions_routieres.csv"); // replace 'your_directory' with your desired directory

// //     const writer = fs.createWriteStream(filePath);
// //     response.data.pipe(writer);

// //     return new Promise((resolve, reject) => {
// //       writer.on("finish", resolve);
// //       writer.on("error", reject);
// //     });
// //   } catch (error) {
// //     console.error("Error:", error);
// //     throw new Error("There was an error fetching data from the API.");
// //   }
// // }

// async function getCsvData() {
//   try {
//     const response = await axios({
//       url: "https://data.montreal.ca/dataset/cd722e22-376b-4b89-9bc2-7c7ab317ef6b/resource/05deae93-d9fc-4acb-9779-e0942b5e962f/download/collisions_routieres.csv",

//       //
//       method: "GET",
//       responseType: "stream",
//     });

//     if (!response.data) {
//       throw new Error(response.statusText); // check if response went through
//     }

//     //const filePath = path.resolve(__dirname, "/data", "collisions_routieres.csv"); // replace 'your_directory' with your desired directory
//     const filePath = path.join(__dirname, "data", "collisions_routieres.csv");

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

// // Usage
// getCsvData()
//   .then(() => {
//     console.log("CSV file saved successfully.");
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

// async function convertToJson() {
//   //const csvFilePath = path.resolve(__dirname, "/data", "collisions_routieres.csv");
//   const csvFilePath = path.join(__dirname, "data", "collisions_routieres.csv");
//   // const jsonFilePath = path.resolve(__dirname, "/data", "output.json");
//   const jsonFilePath = path.join(__dirname, "data", "output.json");

//   const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
//   const jsonData = await csvtojson().fromString(csvData);

//   await fs.promises.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));

//   console.log("CSV data has been converted to JSON.");
// }

// async function updateDatabase() {
//   // const jsonFilePath = path.resolve(__dirname, "/data", "output.json");
//   // const jsonFilePath = path.join(__dirname, "data", "output.json");

//   // const jsonData = JSON.parse(await fs.promises.readFile(jsonFilePath, "utf-8"));

//   Accident.collection.drop();
//   // await Accident.insertMany(jsonData);

//   // console.log("Database has been updated.");

//   fs.readFile("data/output.json", "utf8", (err, data) => {
//     if (err) {
//       console.error("Erreur de lecture du fichier", err);
//       return;
//     }

//     const jsonData = JSON.parse(data);

//     Accident.insertMany(jsonData)
//       .then((result) => {
//         console.log("Insertion réussie");
//       })
//       .catch((err) => {
//         console.error("Erreur d'insertion", err);
//       });
//   });
// }

// const accidentSchema = new mongoose.Schema({
//   NO_SEQ_COLL: String,
//   JR_SEMN_ACCDN: String,
//   DT_ACCDN: Date,
//   CD_MUNCP: Number,
//   NO_CIVIQ_ACCDN: Number,
//   SFX_NO_CIVIQ_ACCDN: String,
//   BORNE_KM_ACCDN: String,
//   RUE_ACCDN: String,
//   TP_REPRR_ACCDN: Number,
//   ACCDN_PRES_DE: String,
//   NB_METRE_DIST_ACCD: Number,
//   CD_GENRE_ACCDN: Number,
//   CD_SIT_PRTCE_ACCDN: String,
//   CD_ETAT_SURFC: Number,
//   CD_ECLRM: Number,
//   CD_ENVRN_ACCDN: Number,
//   NO_ROUTE: String,
//   CD_CATEG_ROUTE: Number,
//   CD_ETAT_CHASS: String,
//   CD_ASPCT_ROUTE: Number,
//   CD_LOCLN_ACCDN: Number,
//   CD_POSI_ACCDN: String,
//   CD_CONFG_ROUTE: Number,
//   CD_ZON_TRAVX_ROUTR: String,
//   CD_PNT_CDRNL_ROUTE: String,
//   CD_PNT_CDRNL_REPRR: String,
//   CD_COND_METEO: Number,
//   NB_VEH_IMPLIQUES_ACCDN: Number,
//   NB_MORTS: Number,
//   NB_BLESSES_GRAVES: Number,
//   NB_BLESSES_LEGERS: Number,
//   HEURE_ACCDN: String,
//   AN: Number,
//   NB_VICTIMES_TOTAL: Number,
//   GRAVITE: String,
//   REG_ADM: String,
//   MRC: String,
//   nb_automobile_camion_leger: Number,
//   nb_camionLourd_tractRoutier: Number,
//   nb_outil_equipement: Number,
//   nb_tous_autobus_minibus: Number,
//   nb_bicyclette: Number,
//   nb_cyclomoteur: Number,
//   nb_motocyclette: Number,
//   nb_taxi: Number,
//   nb_urgence: Number,
//   nb_motoneige: Number,
//   nb_VHR: Number,
//   nb_autres_types: Number,
//   nb_veh_non_precise: Number,
//   NB_DECES_PIETON: Number,
//   NB_BLESSES_PIETON: Number,
//   NB_VICTIMES_PIETON: Number,
//   NB_DECES_MOTO: Number,
//   NB_BLESSES_MOTO: Number,
//   NB_VICTIMES_MOTO: Number,
//   NB_DECES_VELO: Number,
//   NB_BLESSES_VELO: Number,
//   NB_VICTIMES_VELO: Number,
//   VITESSE_AUTOR: String,
//   LOC_X: Number,
//   LOC_Y: Number,
//   LOC_COTE_QD: String,
//   LOC_COTE_PD: Number,
//   LOC_DETACHEE: String,
//   LOC_IMPRECISION: String,
//   LOC_LONG: Number,
//   LOC_LAT: Number,
// });

// const Accident = mongoose.model("Accident", accidentSchema);

// //date initiale
// // 24 hours is 86400000 ms
// // 1 minute is 60000 ms
// var lastUpdate = new Date("2023-06-11T00:00:00.000Z");
// async function update() {
//   console.log("Revolving update function");

//   const d = new Date();
//   if (d.getTime() - lastUpdate.getTime() >= 86400000) {
//     console.log("Begin waiting 24 hours");

//     try {
//       await getCsvData();
//       console.log("Got the CSV from the server");

//       await convertToJson();
//       console.log("Converted CSV to JSON");

//       await updateDatabase();
//       console.log("Updated database");

//       lastUpdate = new Date();
//       console.log("Last update:", lastUpdate);
//     } catch (error) {
//       console.error("Error during update:", error);
//     }
//   }
// }

// setInterval(update, 300000);

// async function getAccidents() {
//   return await Accident.find({}).sort({ DT_ACCDN: -1 }).limit(300000);
//   //return await Accident.find({}).sort({ DT_ACCDN: -1 });
//   //return await Accident.find({}).sort({ DT_ACCDN: -1 }).limit(5);
//   //90k il gere pas bien, sans limite il fait erreur
// }
// //la page vue de visualisation est http://localhost:5173/accidents ou VOTRE localhost:port/accidents
// app.get("/accidents", async (req, res) => {
//   try {
//     const accidents = await Accident.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalMorts: { $sum: "$NB_MORTS" },
//           totalBlessesGraves: { $sum: "$NB_BLESSES_GRAVES" },
//           totalBlessesLegers: { $sum: "$NB_BLESSES_LEGERS" },
//           totalVehiculesImpliques: { $sum: "$NB_VEH_IMPLIQUES_ACCDN" },
//           totalVictimesImpliques: { $sum: "$NB_VICTIMES_TOTAL" },
//         },
//       },
//     ]);

//     res.json(accidents[0]);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // app.get("/accidents", (req, res) => {
// //   getAccidents().then((data) => {
// //     res.send(data);
// //   });
// // });

// // Accident.find(function(err, accidents){
// //     if(err){
// //         console.log(err);
// //     }else{
// //         console.log(accidents);
// //     }
// // })

// // app.get('/', (req, res) => {
// //     console.log(sw());
// //   res.send('<h1>Hello World!</h1>')
// // })

// // app.get('/contact', (req, res) => {
// // //   res.send('<h1>Pour nous joindre, blablabalba....</h1>')
// // //   res.sendFile('contact.html')
// //     console.log(__dirname + "/contact.html");
// //     res.sendFile(__dirname + "/contact.html");
// // })

// // app.get('/', (req, res) => {
// //     console.log(naruto.all);
// //     console.log(yoda());
// //     res.sendFile(__dirname + "/math.html");
// // })

// // app.post('/', (req, res) => {

// //     var n1 = Number(req.body.nombreUn);
// //     var n2 = Number(req.body.nombreDeux);

// //     var somme = n1 + n2;
// //     res.send("Voici la somme des deux nombres: " + somme);
// //     // res.sendFile(__dirname + "/math.html");
// // })

// // app.get('/starwars', (req, res) => {
// //     console.log(sw());
// //   })

// // app.get('/login/', (req, res) => {
// //     res.send('Welcome to the login page')
// // })

// // app.get('/register/', (req, res) => {
// //     res.send('Welcome to the register page')
// // })

// // app.get("/users", (req, res) => res.send("All users"))
// // app.post("/addUser", (req, res) => res.send("Created user"))

// // app.route("/users/:id")
// //     .get((req, res) => res.send("Get user: " + req.params.id))
// //     .post((req, res) => res.send("Post user: " + req.params.id))
// //     .put((req, res) => res.send("Put user: " + req.params.id))
// //     .patch((req, res) => res.send("Patch user: " + req.params.id))
// //     .delete((req, res) => res.send("Delete user: " + req.params.id))

// // // app.get('/users/:id', (req, res) => {
// // //     res.send('User: ' + req.params["id"])
// // //   })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// var derniereMiseAJour = new Date("2023-06-14T00:00:00.000Z");
// async function miseaJour() {
//   let d = new Date();
//   if (d.getTime() - derniereMiseAJour.getTime() >= 86400000) {
//     console.log("Mise à jour des données...");

//     await recuperer();
//     await convertir();
//     await supprimerDonneesBD();
//     await insererBD();

//     derniereMiseAJour = new Date();
//     console.log("Dernière mise à jour:", derniereMiseAJour);
//   }

//   console.log("Données mises à jour.");
// }

// //la fonction mise-a-jour initialise et met à jour les données en une seule fonction
// var derniereMiseAJour = new Date("2023-06-11T00:00:00.000Z");
// async function miseaJour() {
//   console.log("Fonction de mise à jour tournante");

//   const d = new Date();
//   if (d.getTime() - derniereMiseAJour.getTime() >= 86400000) {
//     // console.log("Begin waiting 24 hours");

//     try {
//       console.log("Mise à jour des données...");

//       await recuperer();
//       await convertir();
//       await supprimerDonneesBD();
//       await insererBD();

//       console.log("Données mises à jour.");

//       derniereMiseAJour = new Date();
//       console.log("Dernière mise à jour:", derniereMiseAJour);
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour:", error);
//     }
//   }
// }

// async function lifeCycle() {
//   await initialiserDonnees();
//   await miseaJour();
// }

// lifeCycle();
// // setInterval(miseaJour, 60000);
// setInterval(miseaJour, 60000);
