import { IMG } from '../constants/images';

export const awarenessCards = [
  {
    id: 1,
    title: "Environment",
    icon: "Globe",
    color: "#a6b48f",
    image: IMG.aEnvironment,
    description:
      "Animal agriculture contributes nearly 14.5% of global greenhouse gas emissions. Transitioning toward plant-based eating can reduce an individual's food-related carbon footprint by up to 73%, while also helping conserve forests, oceans, and biodiversity.",
    highlights: [
      "73% lower carbon footprint",
      "Reduces deforestation",
      "Saves freshwater resources",
      "Supports biodiversity",
    ],
    statistic: "2,500L water saved per vegan meal week",
    quote: "The future of sustainability begins with conscious consumption.",
    references: [
      { org: 'FAO', title: 'Livestock and Climate Change', link: 'https://www.fao.org/' },
      { org: 'Our World in Data', title: 'Environmental Impacts of Food', link: 'https://ourworldindata.org/environmental-impacts-of-food' }
    ]
  },

  {
    id: 2,
    title: "Health",
    icon: "HeartPulse",
    color: "#e3a36e",
    image: IMG.aHealth,
    description:
      "Whole-food plant-based diets are naturally rich in fiber, antioxidants, vitamins, and anti-inflammatory compounds. Research links balanced vegan diets to improved cardiovascular health, lower cholesterol, reduced blood pressure, and better long-term metabolic wellness.",
    highlights: ["Rich in antioxidants", "Supports heart health", "Improves digestion", "Boosts energy levels"],
    statistic: "35g+ daily fiber intake possible",
    quote: "Nutrition should nourish both body and longevity.",
    references: [
      { org: 'Academy of Nutrition and Dietetics', title: 'Vegetarian Diets Position Paper', link: 'https://www.eatright.org/' },
      { org: 'Harvard Nutrition Source', title: 'The Nutrition Source', link: 'https://nutritionsource.hsph.harvard.edu/' }
    ]
  },

  {
    id: 3,
    title: "Compassion",
    icon: "HandHeart",
    color: "#9d82ab",
    image: IMG.aCompassion,
    description:
      "Every animal is a sentient being capable of experiencing emotions, stress, and pain. Choosing plant-based alternatives helps reduce industrial animal farming practices while promoting empathy, kindness, and ethical food systems.",
    highlights: ["Promotes ethical living", "Reduces animal suffering", "Encourages conscious choices", "Supports humane systems"],
    statistic: "Over 80 billion land animals affected yearly",
    quote: "Compassion is reflected in the choices we make daily.",
    references: [
      { org: 'Our World in Data', title: 'How many animals are slaughtered each year?', link: 'https://ourworldindata.org/animal-slaughtered' },
      { org: 'FAO', title: 'Livestock production', link: 'https://www.fao.org/' }
    ]
  },

  {
    id: 4,
    title: "Sustainability",
    icon: "Leaf",
    color: "#6f4e37",
    image: IMG.aSustainability,
    description:
      "Current food systems consume enormous amounts of land, water, and crops. Nearly 70% of agricultural land is used for livestock production. Plant-focused food systems are significantly more resource-efficient and environmentally sustainable for a growing global population.",
    highlights: ["Efficient food production", "Lower land usage", "Supports food equity", "Reduced ecological strain"],
    statistic: "70% of farmland linked to livestock systems",
    quote: "Sustainable systems begin with sustainable plates.",
    references: [
      { org: 'FAO', title: 'Land use in livestock systems', link: 'https://www.fao.org/' },
      { org: 'Our World in Data', title: 'Half of the world\'s habitable land is used for agriculture', link: 'https://ourworldindata.org/land-use' }
    ]
  },

  {
    id: 5,
    title: "Climate Action",
    icon: "CloudSun",
    color: "#7c664d",
    image: IMG.aClimateAction,
    description:
      "Climate scientists consistently identify food systems as a major contributor to global warming. Reducing meat and dairy consumption can significantly decrease methane emissions, habitat destruction, and long-term environmental degradation.",
    highlights: ["Reduces methane emissions", "Supports climate goals", "Protects ecosystems", "Lowers environmental pressure"],
    statistic: "Food systems contribute ~30% of global emissions",
    quote: "Small dietary shifts can create large climate impact.",
    references: [
      { org: 'IPCC', title: 'Climate Change and Land', link: 'https://www.ipcc.ch/' },
      { org: 'NASA Climate', title: 'The Causes of Climate Change', link: 'https://climate.nasa.gov/' }
    ]
  },

  {
    id: 6,
    title: "Future Generations",
    icon: "Sprout",
    color: "#93a77b",
    image: IMG.aFutureGen,
    description:
      "Sustainable eating habits today directly affect the health of future generations. Cleaner ecosystems, healthier food systems, and responsible resource consumption help create a safer and more balanced world for children and future communities.",
    highlights: ["Protects future resources", "Encourages responsible living", "Improves food sustainability", "Supports long-term wellbeing"],
    statistic: "1 planet shared by 10+ billion future citizens",
    quote: "The choices we make today shape tomorrow’s planet.",
    references: [
      { org: 'FAO', title: 'Sustainable food systems', link: 'https://www.fao.org/' },
      { org: 'UN', title: 'Sustainable Development Goals', link: 'https://www.un.org/sustainabledevelopment/' }
    ]
  },
];
