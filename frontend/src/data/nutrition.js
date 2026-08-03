import { IMG } from '../constants/images';

export const nutritionCategories = [
  {
    id: "protein",
    name: "Protein-Rich Foods",
    desc: "Practical, affordable Indian sources of concentrated plant protein — ideal for students on a budget.",
    image: IMG.nProteinHero,
    whyItMatters:
      "Protein is essential for muscle repair, neurotransmitter production, satiety and steady cognitive performance — low protein intake can reduce focus and slow recovery after activity.",
    scienceNotes: [
      "Amino acids from plant proteins support neurotransmitter synthesis (e.g., tryptophan → serotonin).",
      "Combining complementary proteins across meals helps achieve a complete amino acid profile over the day."
    ],
    references: [
      { org: "Harvard Nutrition Source", title: "Plant-Based Proteins", link: "https://nutritionsource.hsph.harvard.edu/" },
      { org: "NCBI", title: "Protein Requirements and Recommendations", link: "https://www.ncbi.nlm.nih.gov/" },
      { org: "ICMR India", title: "Dietary Guidelines for Indians", link: "https://www.icmr.gov.in/" }
    ],
    items: [
      {
        food: "Soy Chunks (Per 100g dry)",
        quantity: "~52g protein",
        image: IMG.iSoyChunks,
        cost: "₹35",
        pct: 100,
        icon: "soy",
        glycemicIndex: 15,
        satietyScore: 9,
        digestibility: "Moderate (needs rehydration)",
        energyRelease: "Steady",
        workoutSuitability: "High (post-workout/meal)",
        shortDesc: "Concentrated isolated soy protein — rehydrates quickly, very high protein per rupee.",
        availability: "Staple in most Indian markets, widely available in frozen/dry form",
        budgetLevel: "Very Affordable",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "6-12 months (dry)",
        bestPairings: ["Rice", "Rotis", "Vegetable stir-fry"],
        studentNotes: "Rehydrate and pan-fry with spices for quick sabzi or add to pulao.",
        sustainabilityImpact: { waterUsage: "Low vs. animal protein", carbonImpact: "Low", landUse: "Efficient" },
        commonMistakes: ["Over-relying on fried versions", "Not rinsing rehydrated chunks"]
      },
      {
        food: "Tofu (100g)",
        quantity: "~15g protein",
        image: IMG.iTofu,
        cost: "₹60",
        pct: 29,
        icon: "tofu",
        glycemicIndex: 15,
        satietyScore: 7,
        digestibility: "High (soft protein)",
        energyRelease: "Moderate",
        workoutSuitability: "Moderate (good for recovery)",
        shortDesc: "Soft soy curd, versatile in Indian cooking; choose calcium-set for bone support.",
        availability: "Increasingly available in metros and many town grocery stores",
        budgetLevel: "Affordable (higher in some towns)",
        hostelFriendly: false,
        mealPrepFriendly: true,
        shelfLife: "7-10 days refrigerated (longer if vacuum-packed)",
        bestPairings: ["Stir-fried vegetables", "Chapati/roti", "Tofu bhurji"],
        studentNotes: "Calcium-set tofu is an efficient calcium source; press to remove water for better texture.",
        sustainabilityImpact: { waterUsage: "Lower than dairy", carbonImpact: "Lower than most animal proteins" },
        commonMistakes: ["Using plain tofu without seasoning", "Overcooking and turning it mushy"]
      },
      {
        food: "Peanuts (100g)",
        quantity: "~26g protein",
        image: IMG.iPeanuts,
        cost: "₹25",
        pct: 50,
        icon: "peanut",
        glycemicIndex: 14,
        satietyScore: 8,
        digestibility: "High (roasted easier to digest)",
        energyRelease: "Slow",
        workoutSuitability: "Moderate (snack)",
        shortDesc: "Calorie-dense, affordable source of protein and healthy fats — perfect for quick snacks and sandwiches.",
        availability: "Very common, sold loose and packaged",
        budgetLevel: "Very Affordable",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "3-6 months (stored dry)",
        bestPairings: ["Whole wheat bread", "Poha", "Chutneys"],
        studentNotes: "Roast and store in small packets for quick snacks; peanut butter works well in hostels.",
        sustainabilityImpact: { waterUsage: "Low", carbonImpact: "Low" },
        commonMistakes: ["Eating only salted varieties", "Assuming peanuts alone cover all amino acids"]
      },
      {
        food: "Chickpeas (1 cup cooked)",
        quantity: "~19g protein",
        image: IMG.iChickpeas,
        cost: "₹40",
        pct: 36,
        icon: "chana",
        glycemicIndex: 28,
        satietyScore: 8,
        digestibility: "Moderate (soaking helps)",
        energyRelease: "Steady",
        workoutSuitability: "High (meal)",
        shortDesc: "Versatile legume — chana is filling, high in protein and fiber; excellent for salads and curries.",
        availability: "Common in all Indian markets",
        budgetLevel: "Affordable",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "3-5 days refrigerated after cooking",
        bestPairings: ["Onion+lemon salad", "Rice", "Quinoa"],
        studentNotes: "Batch cook and freeze in portions; chana masala is a filling, budget-friendly option.",
        sustainabilityImpact: { waterUsage: "Moderate (legume)", carbonImpact: "Low" },
        commonMistakes: ["Not pairing with vitamin C for iron uptake", "Cooking without tempering for flavor"]
      },
      {
        food: "Moong Dal (100g)",
        quantity: "~24g protein",
        image: IMG.iMoongDal,
        references: [
          { org: "ICMR India", title: "Dietary Guidelines for Indians", link: "https://www.icmr.gov.in/" },
          { org: "Harvard Nutrition Source", title: "Legumes and Pulses", link: "https://nutritionsource.hsph.harvard.edu/" }
        ],
        cost: "₹50",
        pct: 46,
        icon: "moong",
        glycemicIndex: 31,
        satietyScore: 8,
        digestibility: "High (split dal cooks quickly)",
        energyRelease: "Moderate",
        workoutSuitability: "High (meal)",
        shortDesc: "Fast-cooking dal used for cheelas and khichdi — excellent for busy students needing quick protein.",
        availability: "Widely available",
        budgetLevel: "Affordable",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "6-12 months dry",
        bestPairings: ["Rice (khichdi)", "Roti", "Cheela (pancake)"],
        studentNotes: "Quick-cooking dal; makes for high-protein cheelas — great for busy mornings.",
        sustainabilityImpact: { waterUsage: "Lower than many animal proteins", carbonImpact: "Low" },
        commonMistakes: ["Under-seasoning", "Overcooking to a thin soup when you want cheela batter"]
      }
    ],
    mealIdeas: ["Rajma rice bowl","Tofu bhurji wrap","Sprouts chaat","Soya pulao","Dal khichdi"],
    commonMistakes: ["Relying only on cereals for protein","Skipping protein at breakfast","Over-reliance on packaged protein powders"]
  },
  {
    id: "iron",
    name: "Plant Iron Sources",
    desc: "Combine these with Vitamin C (lemon, tomatoes, amla) to significantly improve absorption.",
    image: IMG.nIronHero,
    whyItMatters:
      "Iron is essential for oxygen transport and energy. Low iron in students often causes fatigue, poor concentration and impaired learning.",
    scienceNotes: ["Non-heme iron (plant) is less bioavailable than heme iron; vitamin C improves absorption by reducing iron to a more absorbable form."],
    references: [
      { org: "WHO", title: "Iron Deficiency Anaemia", link: "https://www.who.int/" },
      { org: "NCBI", title: "Enhancers and inhibitors of iron absorption", link: "https://www.ncbi.nlm.nih.gov/" },
      { org: "ICMR India", title: "Micronutrient Guidelines", link: "https://www.icmr.gov.in/" }
    ],
    items: [
      {
        food: "Spinach (Cooked, 1 cup)",
        quantity: "~6.4mg iron",
        image: IMG.iSpinach,
        references: [
          { org: "NIH Office of Dietary Supplements", title: "Iron", link: "https://ods.od.nih.gov/factsheets/" },
          { org: "WHO", title: "Iron Deficiency Anaemia", link: "https://www.who.int/" }
        ],
        tip: "Add lemon",
        pct: 100,
        icon: "spinach",
        glycemicIndex: 15,
        satietyScore: 6,
        digestibility: "High when cooked",
        energyRelease: "Moderate",
        workoutSuitability: "Low (good for long-term iron)",
        shortDesc: "Cooked spinach is a concentrated plant source of iron; pair with vitamin C for absorption.",
        availability: "Seasonal but widely available; can use frozen spinach",
        budgetLevel: "Very Affordable",
        hostelFriendly: false,
        mealPrepFriendly: true,
        shelfLife: "2-3 days refrigerated (cooked)",
        bestPairings: ["Lemon or tomato", "Besan cheela", "Sauteed with garlic"],
        studentNotes: "Use lemon or amla to boost iron absorption; avoid tea/coffee around meals.",
        sustainabilityImpact: { waterUsage: "Low", carbonImpact: "Low" },
        commonMistakes: ["Eating raw spinach as the only source", "Drinking tea with iron-rich meals"]
      },
      {
        food: "Sattu (2 tbsp)",
        quantity: "~5mg iron",
        image: IMG.iSattu,
        cost: "₹25",
        pct: 78,
        icon: "sattu",
        glycemicIndex: 35,
        satietyScore: 7,
        digestibility: "High (roasted gram flour)",
        energyRelease: "Steady",
        workoutSuitability: "Moderate",
        shortDesc: "Roasted gram flour powder — quick to mix as drink or stuffing, high in iron and protein.",
        availability: "Common in North Indian markets and online",
        budgetLevel: "Very Affordable",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "6-12 months dry",
        bestPairings: ["Buttermilk (chaas)", "Lemon and onion"],
        studentNotes: "Sattu is a high-protein, high-iron flour — mix with lemon for a quick drink or make parathas.",
        sustainabilityImpact: { waterUsage: "Low", carbonImpact: "Low" },
        commonMistakes: ["Adding milk that reduces its cooling benefit", "Not pairing with vitamin C"]
      },
      {
        food: "Chickpeas (1 cup)",
        quantity: "~4.7mg iron",
        image: IMG.iChickpeas,
        cost: "₹40",
        pct: 58,
        icon: "chana",
        glycemicIndex: 28,
        satietyScore: 8,
        digestibility: "Moderate (soak for best results)",
        energyRelease: "Steady",
        workoutSuitability: "High",
        shortDesc: "Cooked chickpeas provide iron, protein and fiber — ideal for salads and chaat.",
        availability: "Very common",
        budgetLevel: "Affordable",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "3-5 days refrigerated after cooking",
        bestPairings: ["Onion + lemon salad", "Cumin rice"],
        studentNotes: "Chana chaat with raw onion and lemon increases iron uptake and keeps costs low.",
        sustainabilityImpact: { waterUsage: "Moderate", carbonImpact: "Low" },
        commonMistakes: ["Skipping vitamin C pairing", "Eating with high calcium foods at same time"]
      },
      {
        food: "Pumpkin Seeds (30g)",
        quantity: "~2.6mg iron",
        image: IMG.iPumpkinSeeds,
        cost: "₹15",
        pct: 41,
        icon: "pumpkin-seed",
        glycemicIndex: 15,
        satietyScore: 6,
        digestibility: "High (easy snack)",
        energyRelease: "Slow",
        workoutSuitability: "Moderate",
        shortDesc: "Small seed snack high in iron and magnesium; great for topping and quick bites.",
        availability: "Available in grocery stores and online",
        budgetLevel: "Affordable",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "3-6 months",
        bestPairings: ["Sprinkled on salads", "Added to porridge"],
        studentNotes: "Carry small sachets for quick iron boost between classes.",
        sustainabilityImpact: { waterUsage: "Low", carbonImpact: "Low" },
        commonMistakes: ["Relying only on seeds without variety"]
      }
    ],
    bestPairings: ["Spinach + lemon","Chana + onion + lemon","Sattu + lemon"],
    mealIdeas: ["Chana salad with lemon","Sattu drink","Palak dal with lemon"],
    commonMistakes: ["Drinking tea with iron meals","Assuming raw greens are always best"]
  },
  {
    id: "b12",
    name: "Vitamin B12 Guidance",
    desc: "B12 is rare in unfortified plant foods — students should consider fortified soy milk, cereals or a low-dose supplement (monthly or weekly).",
    image: IMG.nB12Hero,
    whyItMatters:
      "Vitamin B12 is crucial for nerve function, red blood cell formation and cognitive health. Deficiency can cause fatigue, poor concentration and neuropathy.",
    scienceNotes: ["B12 is produced by microbes and is scarce in unfortified plant foods; vegans should rely on fortified foods or supplements."],
    references: [
      { org: "NIH", title: "Vitamin B12 Fact Sheet", link: "https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/" },
      { org: "WHO", title: "Micronutrients and Health", link: "https://www.who.int/" }
    ],
    items: [
      {
        food: "Fortified Soy Milk (1 cup)",
        quantity: "~1.2µg B12",
        image: IMG.iSoyMilk,
        references: [
          { org: "NIH Office of Dietary Supplements", title: "Vitamin B12", link: "https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/" }
        ],
        cost: "₹25",
        pct: 100,
        icon: "soy-milk",
        glycemicIndex: 30,
        satietyScore: 6,
        digestibility: "High",
        energyRelease: "Moderate",
        workoutSuitability: "Low",
        shortDesc: "Fortified plant milk with B12 — reliable source when labelled, convenient for students.",
        availability: "Common in supermarkets and some corner shops",
        budgetLevel: "Affordable",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "7-10 days refrigerated (opened)",
        bestPairings: ["Cereal","Smoothies"],
        studentNotes: "Check the label for B12 content; rotate brands to ensure consistent intake.",
        sustainabilityImpact: { waterUsage: "Low compared to dairy", carbonImpact: "Lower than dairy" },
        commonMistakes: ["Assuming unfortified plant milks contain B12"]
      },
      {
        food: "Fortified Nutritional Yeast (2 tbsp)",
        quantity: "Varies; check label",
        image: IMG.iNutritionalYeast,
        tip: "Great on cheelas and upma",
        pct: 80,
        icon: "yeast",
        glycemicIndex: 5,
        satietyScore: 5,
        digestibility: "High",
        energyRelease: "Low",
        workoutSuitability: "Low (micronutrient boost)",
        shortDesc: "Deactivated yeast fortified with B12 — adds umami and micronutrients to meals.",
        availability: "Available in supermarkets and online in metros",
        budgetLevel: "Moderate",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "6-12 months",
        bestPairings: ["Sprinkled on toast","Added to masalas"],
        studentNotes: "A flavorful way to add B12 and umami to meals; verify fortification on the pack.",
        sustainabilityImpact: { waterUsage: "Low", carbonImpact: "Low" },
        commonMistakes: ["Not checking if the yeast is fortified"]
      }
    ],
    mealIdeas: ["Fortified soy milk smoothie","Nutritional yeast masala on cheela"],
    commonMistakes: ["Ignoring B12 entirely","Relying on unreliable plant sources"]
  },
  {
    id: "calcium",
    name: "Calcium & Bone Support",
    desc: "Affordable sources and simple pairing strategies to hit calcium targets on a vegan diet.",
    image: IMG.nCalciumHero,
    whyItMatters:
      "Calcium is important for bone health, muscle function and nerve transmission. Young adults build peak bone mass — dietary calcium matters for lifelong bone strength.",
    scienceNotes: ["Calcium absorption is affected by vitamin D status and presence of oxalates/phytates in food."],
    references: [
      { org: "Harvard Health", title: "Calcium and Bone Health", link: "https://www.health.harvard.edu/" },
      { org: "ICMR India", title: "Recommended Dietary Allowances", link: "https://www.icmr.gov.in/" }
    ],
    items: [
      {
        food: "Tofu (Calcium-set, 100g)",
        quantity: "~350mg Ca",
        image: IMG.iTofu,
        references: [
          { org: "NIH Office of Dietary Supplements", title: "Calcium", link: "https://ods.od.nih.gov/factsheets/" },
          { org: "Harvard Health", title: "Calcium and Bone Health", link: "https://www.health.harvard.edu/" }
        ],
        cost: "₹60",
        pct: 100,
        icon: "tofu",
        glycemicIndex: 15,
        satietyScore: 7,
        digestibility: "High",
        energyRelease: "Moderate",
        workoutSuitability: "High (recovery and calcium)",
        shortDesc: "Calcium-set tofu supplies both protein and calcium — choose it where available to boost bone intake.",
        availability: "Available in supermarkets and some local stores",
        budgetLevel: "Affordable",
        hostelFriendly: false,
        mealPrepFriendly: true,
        shelfLife: "7-10 days refrigerated",
        bestPairings: ["Leafy greens","Chapati"],
        studentNotes: "Choose calcium-set tofu if aiming to meet calcium targets; press and use in curries.",
        sustainabilityImpact: { waterUsage: "Lower than dairy", carbonImpact: "Lower than dairy" },
        commonMistakes: ["Assuming tofu always has high calcium (check label)"]
      },
      {
        food: "Black Sesame (2 tbsp)",
        quantity: "~200mg Ca",
        image: IMG.iSesame,
        pct: 57,
        icon: "sesame",
        glycemicIndex: 15,
        satietyScore: 5,
        digestibility: "High when ground",
        energyRelease: "Slow",
        workoutSuitability: "Low",
        tip: "Use in chutneys or laddoos",
        availability: "Available in grocery stores",
        budgetLevel: "Affordable",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "6-12 months",
        bestPairings: ["Chutney","Sesame laddoos"],
        studentNotes: "Grind and sprinkle over rotis or mix into chutneys for calcium boost.",
        sustainabilityImpact: { waterUsage: "Low", carbonImpact: "Low" },
        commonMistakes: ["Using in tiny amounts only — add more to see benefit"]
      },
      {
        food: "Fortified Soy Milk (1 cup)",
        quantity: "~300mg Ca",
        image: IMG.iSoyMilk,
        pct: 86,
        icon: "soy-milk",
        glycemicIndex: 30,
        satietyScore: 6,
        digestibility: "High",
        energyRelease: "Moderate",
        workoutSuitability: "Low",
        cost: "₹25",
        availability: "Common in supermarkets",
        budgetLevel: "Affordable",
        hostelFriendly: true,
        mealPrepFriendly: true,
        shelfLife: "7-10 days opened",
        bestPairings: ["Cereal","Smoothies"],
        studentNotes: "Check fortification levels and vitamin D content for better absorption.",
        sustainabilityImpact: { waterUsage: "Lower than dairy", carbonImpact: "Lower than dairy" },
        commonMistakes: ["Assuming all plant milks are fortified"]
      }
    ],
    mealIdeas: ["Tofu bhurji with rotis","Sesame chutney with millet roti","Calcium-fortified smoothie"],
    commonMistakes: ["Relying solely on spinach for calcium","Ignoring vitamin D status"]
  }
];

export const studentVeganDiet = {
  title: "Daily Student Vegan Diet Plan",
  image: IMG.dDietHero,
  references: [
    { org: "ICMR India", title: "Dietary Guidelines for Indians", link: "https://www.icmr.gov.in/" },
    { org: "FAO", title: "Sustainable healthy diets", link: "https://www.fao.org/" }
  ],
  macros: {
    calories: "2200 kcal (adjust by activity)",
    protein: "92 g (target for active students)",
    carbs: "280 g",
    fats: "68 g",
    fiber: "42 g",
    iron: "22 mg",
    calcium: "1100 mg",
    vitaminB12: "Supplement advised (see B12 guidance)",
    omega3: "1.2 g ALA (from flax/walnuts)",
    notes: "Macronutrient targets are examples — personalise by weight, activity and goals."
  },
  costEstimates: {
    perDay: "₹140 - ₹250 (depending on protein choices)",
    weeklyGrocery: "₹900 - ₹1,500",
    monthlyBudget: "₹3,200 - ₹5,500",
    tips: [
      "Buy pulses and grains in bulk from local mandis",
      "Rotate lower-cost proteins like peanuts and chana",
      "Use seasonal vegetables and frozen options to save money"
    ]
  },
  timeline: [
    {
      section: "Early Morning",
      meal: "Warm lemon water + soaked almonds",
      description:
        "200ml warm water with lemon and 4 soaked almonds to awaken digestion and provide a small protein+fat boost. Soaked almonds are easier to digest and give a steady release of fats and vitamin E.",
      benefits: ["Hydration", "Vitamin C aids iron absorption", "Gentle energy boost"],
      calories: "40 kcal",
      protein: "2 g",
      price: "₹8",
      prep: "2 mins",
      studentScenario: "Good for early morning classes and exam days when stomachs are sensitive."
    },
    {
      section: "Breakfast",
      meal: "Masala Oats or Moong Dal Cheela",
      description:
        "Choose savory masala oats or protein-rich moong dal cheela with a side of chutney. Oats give slow-release energy, while moong dal cheela gives concentrated protein — both are hostel-friendly and quick.",
      benefits: ["Sustained energy", "Good protein-to-calorie ratio", "Supports morning concentration"],
      calories: "320 - 360 kcal",
      protein: "12 - 20 g",
      price: "₹35 - ₹60",
      prep: "8 - 20 mins",
      examTip: "Prefer moong cheela for higher protein on exam mornings to improve satiety and focus."
    },
    {
      section: "Mid-Morning Snack",
      meal: "Chana Salad or Sprouts Chaat",
      description:
        "High-fiber, high-protein snacks to prevent mid-day crashes and keep concentration steady. Sprouts add live enzymes and are cheap to make in hostels.",
      benefits: ["Iron & protein boost", "Portable", "Keeps blood sugar stable"],
      calories: "180 - 220 kcal",
      protein: "12 - 14 g",
      price: "₹30 - ₹60",
      prep: "5 - 10 mins",
      hostelHack: "Pre-sprout moong overnight in a jar; season in the morning."
    },
    {
      section: "Lunch",
      meal: "Rajma Rice / Chickpea Quinoa Bowl / Tofu Tikka Wrap",
      description:
        "Balanced plates with legumes or tofu as primary proteins, whole grains and seasonal veggies. Batch-cook rajma or chana twice weekly and combine with rice or millet for fast, nutrient-dense lunches.",
      benefits: ["Sustained energy for afternoon classes", "Muscle maintenance", "Easily batch-cooked"],
      calories: "500 - 620 kcal",
      protein: "22 - 36 g",
      price: "₹90 - ₹160",
      prep: "15 - 35 mins (batch cookable)",
      studentScenario: "Good for athletes on campus — add soya chunks or tofu for extra protein." 
    },
    {
      section: "Evening Snack",
      meal: "Peanut Butter Toast / Sprouts Chaat",
      description:
        "Small nutrient-dense snacks to bridge to dinner — peanut-based options give low-cost protein and healthy fats. Great before evening study sessions.",
      benefits: ["Quick refill of energy", "Protein + fats"],
      calories: "200 - 300 kcal",
      protein: "8 - 14 g",
      price: "₹30 - ₹60",
      prep: "3 - 8 mins",
      focusTip: "Peanut butter with whole wheat toast and banana supports sustained focus and mood." 
    },
    {
      section: "Dinner",
      meal: "Dal Khichdi / Soya Chaap Bowl",
      description:
        "Easily digestible, complete meals that support recovery and sleep quality—include a vegetable side and a salad where possible. Khichdi is great for light digestion after late-night study sessions.",
      benefits: ["Recovery", "Balanced macros for overnight repair", "Promotes sleep quality"],
      calories: "430 - 560 kcal",
      protein: "18 - 36 g",
      price: "₹90 - ₹190",
      prep: "20 - 35 mins",
      hostelTip: "Make khichdi in a single pot and portion for 2-3 nights."
    },
    {
      section: "Post-Workout",
      meal: "Tofu Bhurji Wrap or Protein Shake (soya/pea)",
      description: "Quickly digestible protein with some carbs to support muscle recovery after training.",
      benefits: ["Maximizes recovery", "Convenient for evening gym-goers"],
      calories: "200 - 350 kcal",
      protein: "20 - 30 g",
      price: "₹60 - ₹140",
      prep: "5 - 15 mins",
      workoutTip: "Consume within 45 minutes after training for optimal recovery — combine carbs and protein in ~3:1 ratio for endurance sessions." 
    },
    {
      section: "Hydration",
      meal: "Water, coconut water (occasionally)",
      description: "Aim for 2.5–3L water per day depending on activity. Replace electrolytes with coconut water after intense sessions.",
      benefits: ["Cognitive performance", "Digestion"],
      calories: "0 - 60 kcal",
      protein: "0 g",
      price: "₹0 - ₹40",
      prep: "—",
      hydrationTips: ["Sip water through the day","Carry a 1L bottle to class","Use lemon and salt lightly after long activity"]
    }
  ],
  focusFoods: {
    brain: ["Flaxseeds","Walnuts","Oats","Leafy greens"],
    energy: ["Rajma","Chana","Millets"],
    recovery: ["Tofu","Soya chunks","Moong dal"]
  },
  examSeason: {
    advice:
      "Prioritise regular protein, hydrate, and avoid large greasy meals before long exam sessions. Use small frequent meals and focus foods (oats, peanuts, bananas).",
    sampleDay: [
      "Early: soaked almonds + lemon",
      "Breakfast: moong cheela with chutney",
      "Snack: peanut chikki or sprouts chaat",
      "Lunch: rajma rice with salad",
      "Snack: banana + peanut butter",
      "Dinner: dal khichdi"
    ]
  },
  gymAlternatives: {
    bulking: ["Add extra soya chunks, peanut butter and oats", "Increase portion sizes of dal and rice"],
    cutting: ["Include millets, salads, and reduce oil; keep protein high with tofu/soy"]
  },
  additional: {
    whyProteinMatters: "Protein supports neurotransmitter balance, repair and satiety — students need protein for cognition and muscle maintenance when active.",
    plantIronSources: "Chickpeas, moong, sattu, spinach and sesame are practical options; pair with citrus for absorption.",
    affordableProteinSources: [
      { food: "Soy Chunks", protein: "52g/100g", cost: "₹35" },
      { food: "Tofu", protein: "15g/100g", cost: "₹60" },
      { food: "Peanuts", protein: "26g/100g", cost: "₹25" },
      { food: "Chickpeas", protein: "19g/cup cooked", cost: "₹40" },
      { food: "Moong Dal", protein: "24g/100g", cost: "₹50" }
    ],
    mealPrepTips: [
      "Batch-cook dals and beans twice weekly — portion into containers.",
      "Use a single spice tempering to change flavours (ginger-turmeric, tomato-onion, or coconut-curry).",
      "Freeze cooked legumes in portion packs to extend shelf life and save time."
    ],
    budgetTips: [
      "Buy pulses and grains in bulk from local mandis.",
      "Rotate cheaper proteins (peanuts, chickpeas, moong) through the week.",
      "Use seasonal vegetables and frozen peas/carrots for lower cost."
    ],
    hostelHacks: [
      "Invest in a small electric cooker or induction hotplate.",
      "Pre-soak dals in the evening to cut cooking time in the morning.",
      "Keep spices and ready-to-cook soya chunks for fast protein boosts."
    ]
  },
  highProteinStudentFoods: [
    { food: "Soy Chunks", protein: "52g/100g", cost: "₹35" },
    { food: "Tofu", protein: "15g/100g", cost: "₹60" },
    { food: "Peanuts", protein: "26g/100g", cost: "₹25" },
    { food: "Chickpeas", protein: "19g/cup cooked", cost: "₹40" },
    { food: "Moong Dal", protein: "24g/100g", cost: "₹50" },
    { food: "Oats", protein: "13g/100g", cost: "₹30" },
    { food: "Sattu", protein: "20g/100g", cost: "₹25" }
  ],
  uiHints: {
    progressBars: true,
    circularIndicators: true,
    floatingIngredientCards: true,
    glassmorphismWidgets: true,
    animatedCounters: true,
    expandableSections: true,
    filters: ["High Protein","Budget Friendly","Quick Meals","Indian Meals","Gym Meals","Hostel Friendly","Weight Gain","Weight Loss"]
  }
};

// New datasets to support enhanced educational features
export const brainFoods = [
  { food: "Walnuts", benefits: ["Omega-3 ALA","Cognitive support"], availability: "Common", budgetLevel: "Moderate", hostelFriendly: true, image: IMG.bfWalnuts },
  { food: "Flaxseeds", benefits: ["ALA omega-3","Fiber"], availability: "Common", budgetLevel: "Very Affordable", hostelFriendly: true, image: IMG.bfFlaxseeds },
  { food: "Oats", benefits: ["Slow-release carbs","B vitamins"], availability: "Very common", budgetLevel: "Affordable", hostelFriendly: true, image: IMG.bfOats },
  { food: "Pumpkin Seeds", benefits: ["Zinc","Magnesium","Iron"], availability: "Common", budgetLevel: "Moderate", hostelFriendly: true, image: IMG.bfPumpkinSeeds },
  { food: "Turmeric", benefits: ["Anti-inflammatory","Neuroprotective curcumin"], availability: "Ubiquitous in India", budgetLevel: "Very Affordable", hostelFriendly: true, image: IMG.bfTurmeric },
  { food: "Dark Chocolate (70%+)", benefits: ["Flavonoids","Improved blood flow to brain"], availability: "Common", budgetLevel: "Moderate", hostelFriendly: true, image: IMG.bfDarkChocolate },
  { food: "Blueberries", benefits: ["Antioxidants","Memory support"], availability: "Seasonal/frozen", budgetLevel: "Moderate", hostelFriendly: false, image: IMG.bfBlueberries },
  { food: "Spinach", benefits: ["Folate","Iron","Nitrates for brain circulation"], availability: "Very common", budgetLevel: "Affordable", hostelFriendly: false, image: IMG.bfSpinach }
];

export const examSeasonMeals = [
  { name: "Moong Cheela + Chutney", reason: "High protein + easy digestion", prep: "10-15 mins", hostelFriendly: true },
  { name: "Peanut Butter Banana Toast", reason: "Fast energy + healthy fats", prep: "3-5 mins", hostelFriendly: true },
  { name: "Oats with Walnuts & Seeds", reason: "Slow energy + brain-boosting omega-3", prep: "5 mins", hostelFriendly: true },
  { name: "Sprouted Moong Salad with Lemon", reason: "Iron + protein + vitamin C combo", prep: "5 mins", hostelFriendly: true },
  { name: "Sattu Drink with Jaggery", reason: "Quick iron and protein without cooking", prep: "2 mins", hostelFriendly: true },
  { name: "Makhana (Fox Nuts) Trail Mix", reason: "Light, crunchy, brain-friendly snack", prep: "3 mins", hostelFriendly: true },
  { name: "Rice + Dal + Spinach Plate", reason: "Complete amino acids + iron", prep: "20 mins", hostelFriendly: false },
  { name: "Dark Chocolate + Almonds", reason: "Flavonoids + healthy fats for focus", prep: "0 mins", hostelFriendly: true }
];

export const muscleGainMeals = [
  { name: "Soya Chunk Pulao + Raita", protein: "High (35g+)", notes: "Batch-cook for convenience", calories: "550 kcal" },
  { name: "Tofu Bhurji + Whole Wheat Wrap", protein: "High (28g)", notes: "Good post-workout", calories: "420 kcal" },
  { name: "Peanut Butter Oatmeal Bowl", protein: "Moderate (20g)", notes: "Calorie-dense for bulking", calories: "480 kcal" },
  { name: "Chickpea Curry + Brown Rice", protein: "High (25g)", notes: "Complete amino acids", calories: "520 kcal" },
  { name: "Tempeh Stir-fry + Quinoa", protein: "High (32g)", notes: "Fermented + high absorption", calories: "460 kcal" },
  { name: "Rajma + Rice + Peanut Salad", protein: "High (30g)", notes: "Classic Indian mass gainer", calories: "580 kcal" },
  { name: "Smoothie: Soy Milk + PB + Banana + Oats", protein: "High (28g)", notes: "Liquid calories for easy intake", calories: "500 kcal" },
  { name: "Dal Makhani + Naan + Tofu Side", protein: "High (26g)", notes: "Comfort food with protein", calories: "620 kcal" }
];

export const weightLossMeals = [
  { name: "Millet Khichdi + Salad", notes: "High fiber, lower calorie density", calories: "280 kcal" },
  { name: "Sprouts Salad with Lemon", notes: "Protein-rich, low calorie", calories: "180 kcal" },
  { name: "Vegetable Soup + Whole Wheat Toast", notes: "Filling, hydrating, low calorie", calories: "200 kcal" },
  { name: "Cucumber + Chickpea Bowl with Lime", notes: "High volume, moderate protein", calories: "220 kcal" },
  { name: "Cauliflower Rice + Stir-fry Vegetables", notes: "Very low carb, high fiber", calories: "160 kcal" },
  { name: "Moong Dal Cheela (no oil)", notes: "High protein, minimal fat", calories: "200 kcal" },
  { name: "Watermelon + Mint Smoothie", notes: "Hydrating, low calorie, refreshing", calories: "120 kcal" },
  { name: "Roasted Chana + Green Chutney", notes: "Crunchy, satisfying, portion-controlled", calories: "180 kcal" }
];

export const cheapProteinSnacks = [
  { name: "Roasted Peanuts Sachet", cost: "₹5-10", protein: "7g", hostelFriendly: true },
  { name: "Roasted Chana", cost: "₹10-20", protein: "10g", hostelFriendly: true },
  { name: "Soya Puff/Sticks", cost: "₹10-15", protein: "8g", hostelFriendly: true },
  { name: "Makhana (Roasted with Spices)", cost: "₹15-25", protein: "5g", hostelFriendly: true },
  { name: "Sprouts in a Cup", cost: "₹15-20", protein: "12g", hostelFriendly: true },
  { name: "Peanut Chikki", cost: "₹10", protein: "6g", hostelFriendly: true },
  { name: "Murmura (Puffed Rice) Bhel", cost: "₹10-15", protein: "3g", hostelFriendly: true },
  { name: "Til (Sesame) Laddoo", cost: "₹10-15", protein: "4g", hostelFriendly: true }
];

export const hostelEmergencyMeals = [
  { name: "Instant Sattu Drink", time: "2 mins", notes: "High in iron, easy to store", ingredients: ["Sattu powder", "Water", "Lemon", "Salt"] },
  { name: "Instant Oats with Peanut Butter", time: "3 mins", notes: "Warm and filling", ingredients: ["Oats", "Hot water", "Peanut butter", "Banana"] },
  { name: "Bread + Hummus + Cucumber", time: "2 mins", notes: "No cooking required", ingredients: ["Whole wheat bread", "Store-bought hummus", "Cucumber"] },
  { name: "Banana + Peanut Butter Roll", time: "2 mins", notes: "Energy-dense, portable", ingredients: ["Roti/wrap", "Peanut butter", "Banana"] },
  { name: "Murmura Bhel with Onion", time: "3 mins", notes: "Crunchy, filling, zero cooking", ingredients: ["Puffed rice", "Onion", "Lemon", "Chaat masala"] },
  { name: "Cup Noodles + Soy Chunks (rehydrated)", time: "5 mins", notes: "Add protein to instant noodles", ingredients: ["Instant noodles", "Soy chunks", "Hot water"] },
  { name: "Makhana + Dark Chocolate", time: "1 min", notes: "Brain food combo", ingredients: ["Roasted makhana", "Dark chocolate pieces"] },
  { name: "Overnight Oats (prepared night before)", time: "0 mins (ready)", notes: "Grab and eat in the morning", ingredients: ["Oats", "Soy milk", "Chia seeds", "Fruits"] }
];

export const fiveMinuteMeals = [
  { name: "Peanut Butter Banana Sandwich", time: "3-4 mins", protein: "12g", category: "Breakfast" },
  { name: "Makhana (foxnut) roasted with spices", time: "5 mins", protein: "5g", category: "Snack" },
  { name: "Avocado Toast with Seeds", time: "4 mins", protein: "8g", category: "Breakfast" },
  { name: "Instant Poha with Peanuts", time: "5 mins", protein: "8g", category: "Breakfast" },
  { name: "Fruit + Nut Butter Bowl", time: "3 mins", protein: "10g", category: "Snack" },
  { name: "Hummus + Veggie Sticks", time: "2 mins", protein: "6g", category: "Snack" },
  { name: "Masala Chai + Peanut Chikki", time: "4 mins", protein: "7g", category: "Evening" },
  { name: "Soya Milk Smoothie + Banana", time: "3 mins", protein: "14g", category: "Post-workout" },
  { name: "Dates + Walnuts + Seeds Mix", time: "1 min", protein: "5g", category: "Snack" },
  { name: "Leftover Roti + Peanut Butter Roll-up", time: "2 mins", protein: "10g", category: "Any" }
];

export const studyFriendlyMeals = [
  { name: "Oats Upma with Vegetables", benefit: "Slow energy release", brainBoost: true },
  { name: "Chana Salad with Lemon", benefit: "Protein + iron", brainBoost: false },
  { name: "Walnut + Flax Energy Balls", benefit: "Omega-3 for cognitive function", brainBoost: true },
  { name: "Banana + Dark Chocolate Smoothie", benefit: "Dopamine boost + sustained energy", brainBoost: true },
  { name: "Millet Roti + Palak Dal", benefit: "Iron + B-vitamins for concentration", brainBoost: true },
  { name: "Trail Mix (Almonds, Pumpkin Seeds, Raisins)", benefit: "Zinc + magnesium for memory", brainBoost: true },
  { name: "Turmeric Golden Milk (Soy)", benefit: "Anti-inflammatory, calming for evening study", brainBoost: true },
  { name: "Quinoa + Vegetable Bowl", benefit: "Complete protein + complex carbs", brainBoost: false }
];

export const hydrationTips = [
  "Carry a water bottle to class (1L minimum)",
  "Sip water regularly — set phone reminders if needed",
  "Use coconut water after intense sessions for electrolytes",
  "Infuse water with cucumber, mint, or lemon for variety",
  "Drink a full glass of water 30 minutes before each meal",
  "Avoid excessive caffeine which dehydrates — limit to 2 cups/day",
  "Herbal teas (chamomile, hibiscus) count toward daily intake",
  "Monitor urine color: pale yellow means well-hydrated",
  "Eat water-rich foods: watermelon, cucumber, oranges, tomatoes",
  "During exams, keep a water bottle at your desk — dehydration reduces cognitive performance by 20%"
];

export const immunityBoostingFoods = [
  { name: "Citrus + Amla", benefits: "Vitamin C to support immune response", season: "Winter" },
  { name: "Turmeric Milk (plant)", benefits: "Anti-inflammatory support", season: "All year" },
  { name: "Ginger Tea", benefits: "Antioxidant, anti-nausea, warming", season: "Winter/Monsoon" },
  { name: "Garlic (raw or lightly cooked)", benefits: "Allicin compound boosts white blood cells", season: "All year" },
  { name: "Mushrooms (Shiitake/Button)", benefits: "Beta-glucans support immune cells", season: "All year" },
  { name: "Red Bell Peppers", benefits: "2x vitamin C of oranges, beta-carotene", season: "Winter" },
  { name: "Sunflower Seeds", benefits: "Vitamin E, selenium, zinc trio", season: "All year" },
  { name: "Green Tea", benefits: "EGCG antioxidant, L-theanine for calm immunity", season: "All year" },
  { name: "Sweet Potato", benefits: "Beta-carotene → Vitamin A for mucosal immunity", season: "Winter" },
  { name: "Fermented Foods (Idli/Dosa batter, Kanji)", benefits: "Probiotics strengthen gut immunity", season: "All year" }
];

export const veganMythsDebunked = [
  { myth: "Vegan diets are always low in protein", reality: "Completely False", truth: "With pulses, soy and nuts, protein needs can be met affordably. Indian vegan diets easily provide 80-100g protein daily." },
  { myth: "You can't build muscle on a vegan diet", reality: "Athlete-Proven", truth: "Appropriate calorie and protein intake with strength training supports muscle gain. Many elite athletes are plant-based." },
  { myth: "Vegan food is expensive", reality: "A Budget Myth", truth: "Pulses, grains, and seasonal vegetables are among the cheapest foods globally. A vegan diet costs 30-40% less than meat-based in India." },
  { myth: "Vegans don't get enough calcium", reality: "Calcium-Plenty", truth: "Calcium-set tofu, fortified plant milks, sesame seeds, and leafy greens provide adequate calcium. Some plant milks have more calcium than cow's milk." },
  { myth: "Plant protein is incomplete", reality: "Variety Solves It", truth: "While individual plant foods may be low in certain amino acids, eating a variety of foods across the day provides all essential amino acids." },
  { myth: "Soy causes hormonal imbalances", reality: "Safely Debunked", truth: "Large-scale research shows moderate soy consumption is safe and may even reduce cancer risk. Phytoestrogens are not the same as human estrogen." },
  { myth: "Vegan diets are boring and restrictive", reality: "Infinitely Diverse", truth: "Indian cuisine alone has thousands of naturally vegan dishes. Going vegan often leads to MORE food variety as people explore new cuisines." },
  { myth: "Children and pregnant women can't be vegan", reality: "All Life Stages", truth: "Well-planned vegan diets are nutritionally adequate for all life stages according to the Academy of Nutrition and Dietetics." },
  { myth: "Vegan diets lack iron", reality: "Pair It With C", truth: "Plant iron sources include lentils, chickpeas, spinach, and sesame. Pairing with vitamin C dramatically improves absorption." },
  { myth: "You need dairy for strong bones", reality: "Bone Myth", truth: "Countries with highest dairy consumption (Scandinavia) have the highest osteoporosis rates. Weight-bearing exercise and vitamin D matter more." },
  { myth: "Vegan diets are unsustainable long-term", reality: "Generations Strong", truth: "Millions of people in India have been vegetarian/vegan for generations. With B12 supplementation, it's fully sustainable for life." },
  { myth: "One person going vegan makes no difference", reality: "200 Animals/Year", truth: "One person going vegan saves approximately 200 animals, 15,000L water, 3,300 kg CO₂, and 1,000 sq ft of forest per year." }
];

export const trustIndicators = {
  researchBacked: true,
  reviewedBy: ["Indian Dietetic Association (suggested review)", "Peer-reviewed sources listed per category"],
  showSourceIcons: true
};

// Seasonal produce guide for India
export const seasonalProduceGuide = {
  summer: {
    season: "Summer (March - June)",
    image: IMG.sSummer,
    fruits: ["Mango", "Watermelon", "Litchi", "Muskmelon", "Jackfruit", "Papaya", "Jamun"],
    vegetables: ["Bottle Gourd (Lauki)", "Ridge Gourd", "Bitter Gourd (Karela)", "Cucumber", "Okra (Bhindi)", "Drumstick (Moringa)", "Tinda"],
    grains: ["Jowar (Sorghum)", "Bajra (Pearl Millet)", "Ragi (Finger Millet)"],
    references: [
      { org: "USDA", title: "Seasonal Produce Guide", link: "https://www.usda.gov/" },
      { org: "ICMR India", title: "Dietary Guidelines for Indians", link: "https://www.icmr.gov.in/" }
    ],
    tips: ["Hydrate with water-rich fruits", "Use cooling foods like cucumber raita", "Avoid heavy fried foods in peak heat"],
    recipes: ["Aam Panna (raw mango drink)", "Watermelon mint cooler", "Lauki kofta curry", "Raw mango chutney"]
  },
  monsoon: {
    season: "Monsoon (July - September)",
    image: IMG.sMonsoon,
    fruits: ["Pomegranate", "Pear", "Plum", "Peach", "Jamun", "Custard Apple"],
    vegetables: ["Corn", "Leafy Greens (Amaranth/Cholai)", "Snake Gourd", "Colocasia (Arbi)", "Turmeric (fresh)"],
    grains: ["Corn (Bhutta)", "Kangni (Foxtail Millet)", "Brown Rice"],
    references: [
      { org: "USDA", title: "Seasonal Produce Guide", link: "https://www.usda.gov/" },
      { org: "NIN India", title: "Dietary Guidelines for Indians", link: "https://www.nin.res.in/" }
    ],
    tips: ["Boost immunity with turmeric and ginger", "Eat freshly cooked food — avoid raw salads", "Include probiotics like kanji"],
    recipes: ["Makke ki sabzi (corn curry)", "Arbi fry", "Ginger-turmeric kadha", "Corn soup"]
  },
  winter: {
    season: "Winter (October - February)",
    image: IMG.sWinter,
    fruits: ["Orange", "Guava", "Amla", "Strawberry", "Kinnow", "Chiku (Sapota)"],
    vegetables: ["Spinach (Palak)", "Fenugreek (Methi)", "Mustard Greens (Sarson)", "Peas", "Carrots", "Cauliflower", "Radish", "Sweet Potato", "Beet"],
    grains: ["Wheat (Whole)", "Bajra (Pearl Millet)", "Sarson (Mustard) Seeds"],
    references: [
      { org: "USDA", title: "Seasonal Produce Guide", link: "https://www.usda.gov/" },
      { org: "ICMR India", title: "Dietary Guidelines for Indians", link: "https://www.icmr.gov.in/" }
    ],
    tips: ["Load up on greens — highest nutrition and lowest cost", "Use sarson ka saag for iron", "Eat amla daily for vitamin C"],
    recipes: ["Sarson ka saag (no ghee, use oil)", "Gajar ka halwa (with soy milk)", "Palak paneer (use tofu)", "Amla murabba"]
  }
};

// Weekly meal plan templates
export const weeklyMealPlans = {
  budget: {
    name: "Budget-Friendly Week",
    image: IMG.wBudget,
    references: [
      { org: "ICMR India", title: "Dietary Guidelines for Indians", link: "https://www.icmr.gov.in/" },
      { org: "NIN India", title: "Dietary Guidelines for Indians", link: "https://www.nin.res.in/" }
    ],
    weeklyBudget: "₹800-1,000",
    description: "Maximum nutrition at minimum cost. Built around bulk-bought pulses and seasonal vegetables.",
    days: [
      { day: "Monday", breakfast: "Poha + Peanuts", lunch: "Rajma Rice", dinner: "Moong Dal + Roti", snacks: "Roasted Chana" },
      { day: "Tuesday", breakfast: "Oats + Banana", lunch: "Chole + Rice", dinner: "Khichdi + Pickle", snacks: "Peanut Chikki" },
      { day: "Wednesday", breakfast: "Moong Cheela", lunch: "Aloo Gobi + Roti", dinner: "Dal Fry + Rice", snacks: "Sprouts" },
      { day: "Thursday", breakfast: "Upma + Chutney", lunch: "Soya Chunk Curry + Roti", dinner: "Vegetable Pulao", snacks: "Murmura Bhel" },
      { day: "Friday", breakfast: "Sattu Paratha", lunch: "Kadhi + Rice", dinner: "Chana Dal + Roti", snacks: "Fruit (seasonal)" },
      { day: "Saturday", breakfast: "Aloo Paratha (no ghee)", lunch: "Biryani (soya)", dinner: "Pav Bhaji (oil)", snacks: "Makhana" },
      { day: "Sunday", breakfast: "Idli + Sambar", lunch: "Thali (Dal + Sabzi + Rice + Roti)", dinner: "Light Soup + Bread", snacks: "Homemade Ladoo" }
    ]
  },
  highProtein: {
    name: "High-Protein Muscle Week",
    image: IMG.wHighProtein,
    references: [
      { org: "ICMR India", title: "Dietary Guidelines for Indians", link: "https://www.icmr.gov.in/" },
      { org: "Academy of Nutrition and Dietetics", title: "Vegetarian Diets Position Paper", link: "https://www.eatright.org/" }
    ],
    weeklyBudget: "₹1,200-1,500",
    description: "Targeting 90-100g protein daily for active students and gym-goers.",
    days: [
      { day: "Monday", breakfast: "Soy Milk Smoothie + Oats", lunch: "Tofu Tikka + Quinoa", dinner: "Soya Chunk Curry + Rice", snacks: "Protein shake" },
      { day: "Tuesday", breakfast: "Moong Cheela x3", lunch: "Rajma + Brown Rice", dinner: "Tempeh Stir-fry + Millet", snacks: "PB Toast" },
      { day: "Wednesday", breakfast: "Chickpea Flour Omelette", lunch: "Soya Pulao + Raita", dinner: "Dal Makhani + Roti", snacks: "Trail Mix" },
      { day: "Thursday", breakfast: "Tofu Scramble + Toast", lunch: "Chana Biryani", dinner: "Sprouted Moong Curry + Rice", snacks: "Soya Milk + Banana" },
      { day: "Friday", breakfast: "Peanut Butter Oats", lunch: "Black Bean Bowl + Avocado", dinner: "Mixed Dal + Roti", snacks: "Roasted Peanuts" },
      { day: "Saturday", breakfast: "Sattu Paratha x2", lunch: "Tofu Bhurji Wrap", dinner: "Chole + Rice + Salad", snacks: "Protein Bar (homemade)" },
      { day: "Sunday", breakfast: "Soya Chunk Upma", lunch: "Protein Thali", dinner: "Light Khichdi + Tofu Side", snacks: "Seeds + Dark Chocolate" }
    ]
  }
};

// Environmental impact data
export const environmentalImpact = {
  perDayVegan: {
    waterSaved: "4,164 L",
    co2Reduced: "9 kg",
    landSaved: "3.7 sq m",
    grainSaved: "20 kg",
    animalLives: "1 animal"
  },
  perYearVegan: {
    waterSaved: "1,519,860 L",
    co2Reduced: "3,285 kg",
    landSaved: "1,350 sq m",
    forestSaved: "0.5 acres",
    animalLives: "200+ animals",
    oceanImpact: "Reduced dead zones from agricultural runoff"
  },
  comparisons: [
    { activity: "1 Beef Burger", water: "2,500 L", co2: "6.5 kg", land: "24 sq m", equivalent: "= 2 months of showers" },
    { activity: "1 kg Chicken", water: "4,300 L", co2: "6.9 kg", land: "12 sq m", equivalent: "= Driving 25 km" },
    { activity: "1 L Dairy Milk", water: "1,020 L", co2: "3.2 kg", land: "9 sq m", equivalent: "= Charging 400 phones" },
    { activity: "1 kg Rice", water: "2,500 L", co2: "1.2 kg", land: "2.7 sq m", equivalent: "= 1 bath" },
    { activity: "1 kg Lentils", water: "1,250 L", co2: "0.9 kg", land: "3.4 sq m", equivalent: "= Half a bath" },
    { activity: "1 kg Tofu", water: "302 L", co2: "2.0 kg", land: "2.2 sq m", equivalent: "= A 3-min shower" }
  ],
  globalStats: {
    livestockEmissions: "14.5% of all greenhouse gas emissions",
    deforestation: "80% of Amazon deforestation is for cattle ranching",
    oceanDeadZones: "400+ ocean dead zones caused by agricultural runoff",
    speciesExtinction: "Animal agriculture is the leading cause of species extinction",
    antibioticUse: "73% of global antibiotics are used in farm animals",
    pandemicRisk: "75% of new infectious diseases originate from animals"
  }
};

// Supplement guide
export const supplementGuide = [
  {
    nutrient: "Vitamin B12",
    importance: "Critical",
    dose: "250-500 mcg daily or 2500 mcg weekly",
    form: "Cyanocobalamin (most studied)",
    cost: "₹150-300/month",
    when: "Any time with food",
    notes: "The ONE non-negotiable supplement for vegans. Deficiency causes irreversible nerve damage.",
    brands: ["Neurobion", "Methylcobalamin tablets (generic)"]
  },
  {
    nutrient: "Vitamin D3",
    importance: "High (especially in India despite sun)",
    dose: "1000-2000 IU daily",
    form: "Vegan D3 from lichen (not lanolin)",
    cost: "₹200-400/month",
    when: "With a fat-containing meal",
    notes: "Even in sunny India, 70-80% of adults are deficient. Essential for calcium absorption.",
    brands: ["Doctor's Best Vegan D3", "Nature Made D3"]
  },
  {
    nutrient: "Omega-3 (DHA/EPA)",
    importance: "Moderate-High",
    dose: "250-500 mg DHA+EPA combined",
    form: "Algae-based (not fish oil)",
    cost: "₹500-800/month",
    when: "With meals",
    notes: "ALA from flax/chia converts poorly (5-10%) to DHA. Direct algae source is more reliable for brain health.",
    brands: ["Naturelo Algae DHA", "Ovega-3"]
  },
  {
    nutrient: "Iron",
    importance: "Moderate (test first)",
    dose: "Only if blood tests show deficiency",
    form: "Iron bisglycinate (gentler on stomach)",
    cost: "₹100-200/month",
    when: "Empty stomach with vitamin C, away from calcium",
    notes: "Don't supplement without testing. Plant-based diets can provide adequate iron with proper pairing.",
    brands: ["Gentle Iron (Solgar)", "Generic ferrous bisglycinate"]
  },
  {
    nutrient: "Iodine",
    importance: "Moderate",
    dose: "150 mcg daily (or use iodized salt)",
    form: "Potassium iodide or iodized salt",
    cost: "₹0 (iodized salt) - ₹100/month",
    when: "Any time",
    notes: "If you use Himalayan/rock salt instead of iodized salt, you may need supplementation.",
    brands: ["Iodized table salt", "Kelp tablets"]
  }
];

// Vegan athlete profiles (inspiration)
export const veganAthletes = [
  { name: "Virat Kohli", sport: "Cricket", country: "India", quote: "I feel more energetic and my recovery has improved significantly.", note: "Shifted toward plant-based diet in recent years" },
  { name: "Lewis Hamilton", sport: "Formula 1", country: "UK", quote: "Going vegan was the best decision I've ever made.", note: "7x World Champion, fully plant-based since 2017" },
  { name: "Novak Djokovic", sport: "Tennis", country: "Serbia", quote: "Plant-based eating has opened me up as a person.", note: "Predominantly plant-based, 24 Grand Slams" },
  { name: "Patrik Baboumian", sport: "Strongman", country: "Germany", quote: "The strongest animals are plant eaters.", note: "Holds multiple world records, fully vegan" },
  { name: "Scott Jurek", sport: "Ultramarathon", country: "USA", quote: "Plants give me everything I need to push my limits.", note: "Won Western States 100 seven consecutive times" },
  { name: "Fiona Oakes", sport: "Marathon Running", country: "UK", quote: "Being vegan gives me an edge in endurance.", note: "Holds 4 world records, fully vegan since age 6" },
  { name: "Nate Diaz", sport: "MMA/UFC", country: "USA", quote: "Real food, real fuel, real fighting.", note: "Plant-based fighter in the UFC" },
  { name: "Venus Williams", sport: "Tennis", country: "USA", quote: "I'm powered by plants.", note: "Raw vegan diet helped manage autoimmune condition" }
];

// Daily affirmations for motivation
export const dailyMotivation = [
  "Every plant-based meal is a vote for the planet you want to live on.",
  "You don't have to be perfect. Progress over perfection.",
  "One person going vegan saves 200 animals per year. You are making a difference.",
  "Your body is a garden, not a graveyard.",
  "The food you eat can be the safest form of medicine or the slowest form of poison.",
  "Be the change you wish to see in the world. It starts on your plate.",
  "Compassion is the highest form of strength.",
  "Small daily choices compound into massive environmental impact.",
  "You are not giving something up. You are gaining a clearer conscience.",
  "The future is plant-based. You're just ahead of the curve.",
  "Strength doesn't come from what you can do. It comes from overcoming what you once thought you couldn't.",
  "Every day you eat plants, you're fighting climate change with your fork."
];
