mongoose.connect("mongodb://localhost:270717/TP steve", {
  useNewUrlParser: true,
});

const Schema = new mongoose.Schema({
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

const SPVM = mongoose.model("SPVM", Schema);

const spvm = new SPVM({
  NO_SEQ_COLL: "SPVM _ 2012 _ 1",
  JR_SEMN_ACCDN: "ME",
  DT_ACCDN: "2012/02/01",
  CD_MUNCP: 66102,
  NO_CIVIQ_ACCDN: 3501,
  SFX_NO_CIVIQ_ACCDN: "",
  BORNE_KM_ACCDN: "",
  RUE_ACCDN: "ST CHARLES",
  TP_REPRR_ACCDN: 2,
  ACCDN_PRES_DE: "STAT",
  NB_METRE_DIST_ACCD: null,
  CD_GENRE_ACCDN: 31,
  CD_SIT_PRTCE_ACCDN: null,
  CD_ETAT_SURFC: 16,
  CD_ECLRM: 1,
  CD_ENVRN_ACCDN: 1,
  NO_ROUTE: null,
  CD_CATEG_ROUTE: 21,
  CD_ETAT_CHASS: null,
  CD_ASPCT_ROUTE: 11,
  CD_LOCLN_ACCDN: 33,
  CD_POSI_ACCDN: null,
  CD_CONFG_ROUTE: 4,
  CD_ZON_TRAVX_ROUTR: null,
  CD_PNT_CDRNL_ROUTE: "",
  CD_PNT_CDRNL_REPRR: "",
  CD_COND_METEO: 11,
  NB_VEH_IMPLIQUES_ACCDN: 2,
  NB_MORTS: 0,
  NB_BLESSES_GRAVES: 0,
  NB_BLESSES_LEGERS: 0,
  HEURE_ACCDN: "Non précisé",
  AN: 2012,
  NB_VICTIMES_TOTAL: 0,
  GRAVITE: "Dommages matériels inférieurs au seuil de rapportage",
  REG_ADM: "Montréal(06)",
  MRC: "Montréal (66 )",
  nb_automobile_camion_leger: 1,
  nb_camionLourd_tractRoutier: 0,
  nb_outil_equipement: 0,
  nb_tous_autobus_minibus: 0,
  nb_bicyclette: 0,
  nb_cyclomoteur: 0,
  nb_motocyclette: 0,
  nb_taxi: 0,
  nb_urgence: 0,
  nb_motoneige: 0,
  nb_VHR: 0,
  nb_autres_types: 0,
  nb_veh_non_precise: 1,
  NB_DECES_PIETON: 0,
  NB_BLESSES_PIETON: 0,
  NB_VICTIMES_PIETON: 0,
  NB_DECES_MOTO: 0,
  NB_BLESSES_MOTO: 0,
  NB_VICTIMES_MOTO: 0,
  NB_DECES_VELO: 0,
  NB_BLESSES_VELO: 0,
  NB_VICTIMES_VELO: 0,
  VITESSE_AUTOR: null,
  LOC_X: 276517.3795,
  LOC_Y: 5035127.484,
  LOC_COTE_QD: "A",
  LOC_COTE_PD: 3,
  LOC_DETACHEE: "O",
  LOC_IMPRECISION: "N",
  LOC_LONG: -73.861616,
  LOC_LAT: 45.455505,
});