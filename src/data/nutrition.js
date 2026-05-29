export const nutritionCategories = [
  {
    id: "protein",
    name: "Protein-Rich Foods",
    desc: "Essential for muscle repair, hormonal balance, and cellular growth. Plant proteins are clean, fiber-rich, and free from dietary cholesterol.",
    items: [
      { food: "Tempeh", quantity: "20g per 100g", pct: 40 },
      { food: "Hemp Seeds", quantity: "31g per 100g", pct: 62 },
      { food: "Red Lentils", quantity: "18g per cup cooked", pct: 36 },
      { food: "Chickpeas", quantity: "15g per cup cooked", pct: 30 },
      { food: "Spirulina", quantity: "4g per tbsp", pct: 8 }
    ]
  },
  {
    id: "iron",
    name: "Iron Sources",
    desc: "Crucial for oxygen transport and energy levels. Pair plant-based (non-heme) iron with Vitamin C (citrus, bell peppers) to boost absorption by up to 300%.",
    items: [
      { food: "Pumpkin Seeds", quantity: "8.8mg per 100g", pct: 49 },
      { food: "Spinach (Cooked)", quantity: "6.4mg per cup", pct: 36 },
      { food: "Blackstrap Molasses", quantity: "4.9mg per tbsp", pct: 27 },
      { food: "White Beans", quantity: "6.6mg per cup", pct: 37 },
      { food: "Dark Chocolate (85%)", quantity: "12mg per 100g", pct: 67 }
    ]
  },
  {
    id: "b12",
    name: "Vitamin B12 & Riboflavin",
    desc: "Essential for nervous system health and DNA synthesis. Since B12 is produced by micro-organisms, vegans can easily get it from fortified foods or supplements.",
    items: [
      { food: "Nutritional Yeast", quantity: "24mcg per 2 tbsp (Fortified)", pct: 1000 },
      { food: "Fortified Soy Milk", quantity: "1.2mcg per cup", pct: 50 },
      { food: "Fortified Cereals", quantity: "1.5mcg per serving", pct: 62 },
      { food: "B12 Sublingual Spray", quantity: "500mcg per spray", pct: 20000 }
    ]
  },
  {
    id: "calcium",
    name: "Calcium Sources",
    desc: "Vital for bone density and cardiovascular transmission. Plant-based calcium is highly bioavailable and accompanied by magnesium and Vitamin K.",
    items: [
      { food: "Fortified Orange Juice", quantity: "350mg per cup", pct: 35 },
      { food: "Tofu (Calcium Set)", quantity: "350mg per 100g", pct: 35 },
      { food: "Black Sesame Seeds", quantity: "975mg per 100g", pct: 97 },
      { food: "Collard Greens (Cooked)", quantity: "268mg per cup", pct: 27 },
      { food: "Almonds", quantity: "264mg per 100g", pct: 26 }
    ]
  },
  {
    id: "fats",
    name: "Healthy Fats (Omega-3)",
    desc: "Vital for brain health, reducing inflammation, and absorbing fat-soluble vitamins. ALA from plants converts to EPA and DHA.",
    items: [
      { food: "Flaxseeds (Ground)", quantity: "2.3g ALA per tbsp", pct: 140 },
      { food: "Chia Seeds", quantity: "5.0g ALA per ounce", pct: 310 },
      { food: "Walnuts", quantity: "2.5g ALA per ounce", pct: 156 },
      { food: "Algae Oil", quantity: "500mg DHA/EPA per softgel", pct: 100 }
    ]
  }
];

export const studentVeganDiet = {
  title: "Daily Student Vegan Diet Plan",
  calories: "2,200 kcal",
  cost: "Approx. $5.70 / day",
  highlights: ["100% Meets Daily Protein Needs", "Rich in iron & calcium", "Ultra quick prep time"],
  schedule: [
    {
      meal: "Breakfast",
      title: "Hemp & Berry Oatmeal",
      details: "Organic rolled oats cooked in water or soy milk, mixed with 2 tbsp hemp seeds, 1 tbsp ground flax, and a handful of mixed fresh berries. Top with organic peanut butter.",
      prep: "5 mins"
    },
    {
      meal: "Lunch",
      title: "Double-Bean Glassmorphism Wrap",
      details: "Spiced pinto beans and black beans wrapped in a whole-grain tortilla with baby spinach, sweet corn, salsa, and homemade quick guacamole. Serve with sliced carrots.",
      prep: "8 mins"
    },
    {
      meal: "Dinner",
      title: "High-Protein Lentil & Sweet Potato Stew",
      details: "A single-pot stew loaded with yellow lentils, diced sweet potato, chopped kale, and crushed garlic. Seasoned with ginger and warm cumin, served over brown rice.",
      prep: "25 mins"
    },
    {
      meal: "Snack / Post-Workout",
      title: "Power Hummus Plate & Seeded Crackers",
      details: "Organic classic hummus drizzled with olive oil, paired with sliced cucumbers, red bell peppers, and raw walnuts.",
      prep: "3 mins"
    }
  ]
};
