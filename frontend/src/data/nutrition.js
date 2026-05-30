export const nutritionCategories = [
  {
    id: "protein",
    name: "Protein-Rich Foods",
    desc: "Practical, affordable Indian sources of concentrated plant protein — ideal for students on a budget.",
    items: [
      { food: "Soy Chunks (Per 100g dry)", quantity: "~52g protein", cost: "₹35" },
      { food: "Tofu (100g)", quantity: "~15g protein", cost: "₹60" },
      { food: "Peanuts (100g)", quantity: "~26g protein", cost: "₹25" },
      { food: "Chickpeas (1 cup cooked)", quantity: "~19g protein", cost: "₹40" },
      { food: "Moong Dal (100g)", quantity: "~24g protein", cost: "₹50" }
    ]
  },
  {
    id: "iron",
    name: "Plant Iron Sources",
    desc: "Combine these with Vitamin C (lemon, tomatoes, amla) to significantly improve absorption.",
    items: [
      { food: "Spinach (Cooked, 1 cup)", quantity: "~6.4mg iron", tip: "Add lemon" },
      { food: "Sattu (2 tbsp)", quantity: "~5mg iron", cost: "₹25" },
      { food: "Chickpeas (1 cup)", quantity: "~4.7mg iron", cost: "₹40" },
      { food: "Pumpkin Seeds (30g)", quantity: "~2.6mg iron", cost: "₹15" }
    ]
  },
  {
    id: "b12",
    name: "Vitamin B12 Guidance",
    desc: "B12 is rare in unfortified plant foods — students should consider fortified soy milk, cereals or a low-dose supplement (monthly or weekly).",
    items: [
      { food: "Fortified Soy Milk (1 cup)", quantity: "~1.2µg B12", cost: "₹25" },
      { food: "Fortified Nutritional Yeast (2 tbsp)", quantity: "Varies; check label", tip: "Great on cheelas and upma" }
    ]
  },
  {
    id: "calcium",
    name: "Calcium & Bone Support",
    desc: "Affordable sources and simple pairing strategies to hit calcium targets on a vegan diet.",
    items: [
      { food: "Tofu (Calcium-set, 100g)", quantity: "~350mg Ca", cost: "₹60" },
      { food: "Black Sesame (2 tbsp)", quantity: "~200mg Ca", tip: "Use in chutneys or laddoos" },
      { food: "Fortified Soy Milk (1 cup)", quantity: "~300mg Ca", cost: "₹25" }
    ]
  }
];

export const studentVeganDiet = {
  title: "Daily Student Vegan Diet Plan",
  macros: {
    calories: "2200 kcal",
    protein: "92 g",
    carbs: "280 g",
    fats: "68 g",
    fiber: "42 g",
    iron: "22 mg",
    calcium: "1100 mg",
    vitaminB12: "Supplement advised (see B12 guidance)",
    omega3: "1.2 g ALA (from flax/walnuts)"
  },
  costEstimates: {
    perDay: "₹140 - ₹250 (depending on protein choices)",
    weeklyGrocery: "₹900 - ₹1,500",
    monthlyBudget: "₹3,200 - ₹5,500"
  },
  timeline: [
    {
      section: "Early Morning",
      meal: "Warm lemon water + soaked almonds",
      description: "200ml warm water with lemon and 4 soaked almonds to awaken digestion and provide a small protein+fat boost.",
      benefits: ["Hydration", "Vitamin C aids iron absorption"],
      calories: "40 kcal",
      protein: "2 g",
      price: "₹8",
      prep: "2 mins"
    },
    {
      section: "Breakfast",
      meal: "Masala Oats or Moong Dal Cheela",
      description: "Choose savory masala oats or protein-rich moong dal cheela with a side of chutney. Both are quick, filling and durable in hostels.",
      benefits: ["Sustained energy", "Good protein-to-calorie ratio"],
      calories: "320 - 360 kcal",
      protein: "12 - 20 g",
      price: "₹35 - ₹60",
      prep: "8 - 20 mins"
    },
    {
      section: "Mid-Morning Snack",
      meal: "Chana Salad or Sprouts Chaat",
      description: "High-fiber, high-protein snacks to prevent mid-day crashes and keep concentration steady.",
      benefits: ["Iron & protein boost", "Portable"],
      calories: "180 - 220 kcal",
      protein: "12 - 14 g",
      price: "₹30 - ₹60",
      prep: "5 - 10 mins"
    },
    {
      section: "Lunch",
      meal: "Rajma Rice / Chickpea Quinoa Bowl / Tofu Tikka Wrap",
      description: "Balanced plates with legumes or tofu as primary proteins, whole grains and seasonal veggies.",
      benefits: ["Sustained energy for afternoon classes", "Muscle maintenance"],
      calories: "500 - 620 kcal",
      protein: "22 - 36 g",
      price: "₹90 - ₹160",
      prep: "15 - 35 mins (batch cookable)"
    },
    {
      section: "Evening Snack",
      meal: "Peanut Butter Toast / Sprouts Chaat",
      description: "Small nutrient-dense snacks to bridge to dinner — choose peanut-based options for low-cost protein and healthy fats.",
      benefits: ["Quick refill of energy", "Protein + fats"],
      calories: "200 - 300 kcal",
      protein: "8 - 14 g",
      price: "₹30 - ₹60",
      prep: "3 - 8 mins"
    },
    {
      section: "Dinner",
      meal: "Dal Khichdi / Soya Chaap Bowl",
      description: "Easily digestible, complete meals that support recovery and sleep quality—include a vegetable side and a salad where possible.",
      benefits: ["Recovery", "Balanced macros for overnight repair"],
      calories: "430 - 560 kcal",
      protein: "18 - 36 g",
      price: "₹90 - ₹190",
      prep: "20 - 35 mins"
    },
    {
      section: "Post-Workout",
      meal: "Tofu Bhurji Wrap or Protein Shake (soya/pea)",
      description: "Quickly digestible protein with some carbs to support muscle recovery after training.",
      benefits: ["Maximizes recovery", "Convenient for evening gym-goers"],
      calories: "200 - 350 kcal",
      protein: "20 - 30 g",
      price: "₹60 - ₹140",
      prep: "5 - 15 mins"
    },
    {
      section: "Hydration",
      meal: "Water, coconut water (occasionally)",
      description: "Aim for 2.5–3L water per day depending on activity. Replace electrolytes with coconut water after intense sessions.",
      benefits: ["Cognitive performance", "Digestion"],
      calories: "0 - 60 kcal",
      protein: "0 g",
      price: "₹0 - ₹40",
      prep: "—"
    }
  ],
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
    ],
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
