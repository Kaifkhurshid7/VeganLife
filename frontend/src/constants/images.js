// Central image registry.
// Every Unsplash ID in this file was verified to return HTTP 200 (see git history / verification pass).
// If an image ever breaks, fix it HERE — every data file imports from this module.

const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=600`;

export const IMG = {
  // ---- Recipes ---------------------------------------------------------
  rChickpeaQuinoaBowl: u('1546069901-ba9599a7e63c'),
  rTofuBhurjiWrap: u('1550989460-0adf9ea622e2'),
  rRajmaRiceBowl: u('1512058564366-18510be2db19'),
  rMasalaOats: u('1484723091739-30a097e8f929'),
  rSoyaChaapBowl: u('1512621776951-a57141f2eefd'),
  rPeanutPoha: u('1494597564530-871f2b93ac55'),
  rChanaSalad: u('1485963631004-f2f00b1d6606'),
  rDalKhichdi: u('1504674900247-0877df9cc836'),
  rTofuTikkaWrap: u('1523983302122-73e869e1f850'),
  rSproutsChaat: u('1506377247377-2a5b3b417ebb'),
  rMilletUpma: u('1498837167922-ddd27525d352'),
  rMoongDalCheela: u('1466637574441-749b8f19452f'),
  rOvernightOats: u('1511690656952-34342bb7c2f2'),
  rMasalaChanaPulao: u('1476224203421-9ac39bcb3327'),
  rPBBananaToast: u('1482049016688-2d3e1b311543'),
  rSpinachTofuCurry: u('1547592180-85f173990554'),

  // ---- Blogs -----------------------------------------------------------
  bWaterFootprint: u('1530595467537-0b5996c41f2d'),
  bEliteAthlete: u('1517838277536-f5f99be501cd'),
  bMealPrep: u('1554224155-8d04cb21cd6c'),
  bForests: u('1464822759023-fed622ff2c3b'),
  bWaterFootprint2: u('1474511320723-9a56873867b5'),
  bStrength: u('1517836357463-d25dfeac3438'),
  bStudentBlueprint: u('1455390582262-044cdead277a'),
  bPlantProtein: u('1512621776951-a57141f2eefd'),
  bVeganMyths: u('1540189549336-e6e99c3679fe'),
  bGutHealth: u('1490645935967-10de6ba17061'),
  bZeroWaste: u('1542838132-92c53300491e'),
  bPsychology: u('1529156069898-49953e39b3ac'),
  bStreetFood: u('1567337710282-00832b415979'),
  bQuickMeals: u('1505576399279-565b52d4ac71'),
  bClimateAnxiety: u('1611270629569-8b357cb88da9'),
  bOmega3: u('1573821663912-569905455b1c'),
  bDairyCarbon: u('1550583724-b2692b85b150'),
  bBodybuilding: u('1534438327276-14e5300c3a48'),
  bFermented: u('1583484963886-cfe2bff2945f'),
  bSupplyChains: u('1500651230702-0e2d8a49d4ad'),
  bSleepRecovery: u('1541480601022-2308c0f02487'),
  bSkincare: u('1556228578-0d85b1a4d571'),
  bEconomics: u('1554224155-6726b3ff858f'),
  bNewIron: u('1563379926898-05f4575a45d8'),
  bNewCampus: u('1556910103-1c02745aae4d'),

  // ---- Awareness cards (Why Vegan) ------------------------------------
  aEnvironment: u('1441974231531-c6227db76b6e'),
  aHealth: u('1495521821757-a1efb6729352'),
  aCompassion: u('1518791841217-8f162f1e1131'),
  aSustainability: u('1500382017468-9049fed747ef'),
  aClimateAction: u('1473773508845-188df298d2d1'),
  aFutureGen: u('1500651230702-0e2d8a49d4ad'),

  // ---- Nutrition categories (hero banners) ----------------------------
  nProteinHero: u('1525351484163-7529414344d8'),
  nIronHero: u('1506377247377-2a5b3b417ebb'),
  nB12Hero: u('1511690656952-34342bb7c2f2'),
  nCalciumHero: u('1522335789203-aabd1fc54bc9'),

  // ---- Nutrition items (thumbnails) -----------------------------------
  iSoyChunks: u('1574323347407-f5e1ad6d020b'),
  iTofu: u('1565557623262-b51c2513a641'),
  iPeanuts: u('1505253716362-afaea1d3d1af'),
  iChickpeas: u('1512058564366-18510be2db19'),
  iMoongDal: u('1476224203421-9ac39bcb3327'),
  iSpinach: u('1512621776951-a57141f2eefd'),
  iSattu: u('1498837167922-ddd27525d352'),
  iPumpkinSeeds: u('1587049352846-4a222e784d38'),
  iSoyMilk: u('1606923829579-0cb981a83e2e'),
  iNutritionalYeast: u('1611312449408-fcece27cdbb7'),
  iSesame: u('1540420773420-3366772f4999'),

  // ---- Student diet hero + meal plans ---------------------------------
  dDietHero: u('1607613009820-a29f7bb81c04'),
  wBudget: u('1606787366850-de6330128bfc'),
  wHighProtein: u('1543362906-acfc16c67564'),

  // ---- Quick guides heroes --------------------------------------------
  gBrainFoods: u('1490474418585-ba9bad8fd0ea'),
  gExamMeals: u('1476718406336-bb5a9690ee2a'),
  gMuscleMeals: u('1534438327276-14e5300c3a48'),
  gWeightLoss: u('1485963631004-f2f00b1d6606'),
  gCheapSnacks: u('1494597564530-871f2b93ac55'),
  gHostelMeals: u('1547592180-85f173990554'),
  gFiveMinute: u('1482049016688-2d3e1b311543'),
  gStudyFoods: u('1490645935967-10de6ba17061'),
  gHydration: u('1474511320723-9a56873867b5'),
  gImmunity: u('1563379926898-05f4575a45d8'),
  gMyths: u('1540189549336-e6e99c3679fe'),
  gProduce: u('1500382017468-9049fed747ef'),
  gPlans: u('1554224155-8d04cb21cd6c'),
  gEnvironment: u('1441974231531-c6227db76b6e'),
  gSupplements: u('1583417319070-4a69db38a482'),
  gAthletes: u('1517838277536-f5f99be501cd'),
  gMotivation: u('1541480601022-2308c0f02487'),

  // ---- Seasonal produce -------------------------------------------------
  sSummer: u('1490474418585-ba9bad8fd0ea'),
  sMonsoon: u('1500382017468-9049fed747ef'),
  sWinter: u('1441974231531-c6227db76b6e'),

  // ---- Brain foods (item cards) ----------------------------------------
  bfWalnuts: u('1571772996211-2f02c9727629'),
  bfFlaxseeds: u('1587049352846-4a222e784d38'),
  bfOats: u('1484723091739-30a097e8f929'),
  bfPumpkinSeeds: u('1606787366850-de6330128bfc'),
  bfTurmeric: u('1600891964092-4316c288032e'),
  bfDarkChocolate: u('1513442542250-854d436a73f2'),
  bfBlueberries: u('1563379926898-05f4575a45d8'),
  bfSpinach: u('1512621776951-a57141f2eefd'),
};
