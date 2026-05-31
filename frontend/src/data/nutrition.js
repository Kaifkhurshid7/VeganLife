export const nutritionCategories = [
  {
    id: "protein",
    name: "Protein-Rich Foods",
    desc: "Practical, affordable Indian sources of concentrated plant protein — ideal for students on a budget.",
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
  { food: "Walnuts", benefits: ["Omega-3 ALA","Cognitive support"], availability: "Common", budgetLevel: "Moderate", hostelFriendly: true },
  { food: "Flaxseeds", benefits: ["ALA omega-3","Fiber"], availability: "Common", budgetLevel: "Very Affordable", hostelFriendly: true },
  { food: "Oats", benefits: ["Slow-release carbs","B vitamins"], availability: "Very common", budgetLevel: "Affordable", hostelFriendly: true }
];

export const examSeasonMeals = [
  { name: "Moong Cheela + Chutney", reason: "High protein + easy digestion", prep: "10-15 mins", hostelFriendly: true },
  { name: "Peanut Butter Banana Toast", reason: "Fast energy + healthy fats", prep: "3-5 mins", hostelFriendly: true }
];

export const muscleGainMeals = [
  { name: "Soya Chunk Pulao + Raita", protein: "High", notes: "Batch-cook for convenience" },
  { name: "Tofu Bhurji + Whole Wheat Wrap", protein: "High", notes: "Good post-workout" }
];

export const weightLossMeals = [
  { name: "Millet Khichdi + Salad", notes: "High fiber, lower calorie density" },
  { name: "Sprouts Salad with Lemon", notes: "Protein-rich, low calorie" }
];

export const cheapProteinSnacks = [
  { name: "Roasted Peanuts Sachet", cost: "₹5-10", hostelFriendly: true },
  { name: "Roasted Chana", cost: "₹10-20", hostelFriendly: true }
];

export const hostelEmergencyMeals = [
  { name: "Instant Sattu Drink", time: "2 mins", notes: "High in iron, easy to store" },
  { name: "Instant Oats with Peanut Butter", time: "3 mins", notes: "Warm and filling" }
];

export const fiveMinuteMeals = [
  { name: "Peanut Butter Banana Sandwich", time: "3-4 mins" },
  { name: "Makhana (foxnut) roasted with spices", time: "5 mins" }
];

export const studyFriendlyMeals = [
  { name: "Oats Upma with Vegetables", benefit: "Slow energy release" },
  { name: "Chana Salad with Lemon", benefit: "Protein + iron" }
];

export const hydrationTips = [
  "Carry a water bottle to class (1L minimum)",
  "Sip water regularly — set phone reminders if needed",
  "Use coconut water after intense sessions for electrolytes"
];

export const immunityBoostingFoods = [
  { name: "Citrus + Amla", benefits: "Vitamin C to support immune response" },
  { name: "Turmeric Milk (plant)", benefits: "Anti-inflammatory support" }
];

export const veganMythsDebunked = [
  { myth: "Vegan diets are always low in protein", truth: "With pulses, soy and nuts, protein needs can be met affordably." },
  { myth: "You can't build muscle on a vegan diet", truth: "Appropriate calorie and protein intake with strength training supports muscle gain." }
];

export const trustIndicators = {
  researchBacked: true,
  reviewedBy: ["Indian Dietetic Association (suggested review)", "Peer-reviewed sources listed per category"],
  showSourceIcons: true
};
