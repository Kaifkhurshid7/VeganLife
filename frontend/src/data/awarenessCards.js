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
      "Lower food emissions",
      "Reduces deforestation",
      "Saves freshwater resources",
      "Supports biodiversity",
    ],
    headline: "Cutting the footprint of what we eat",
    marks: ["nearly 14.5% of global greenhouse gas emissions", "by up to 73%"],
    stat: { figure: "Up to 73%", label: "lower food-related carbon footprint" },
    quote: "The future of sustainability begins with conscious consumption.",
    references: [
      { org: 'FAO', title: 'Global Livestock Environmental Assessment Model', link: 'https://www.fao.org/gleam/results/en/' },
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
    headline: "Food that works for the body",
    marks: ["naturally rich in fiber, antioxidants, vitamins", "lower cholesterol, reduced blood pressure"],
    stat: { figure: "~25%", label: "lower heart disease risk in vegetarians" },
    quote: "Nutrition should nourish both body and longevity.",
    references: [
      { org: 'Academy of Nutrition and Dietetics', title: 'Position paper: vegetarian diets', link: 'https://pubmed.ncbi.nlm.nih.gov/27886704/' },
      { org: 'Dinu et al., 2017', title: 'Vegetarian, vegan diets and multiple health outcomes', link: 'https://pubmed.ncbi.nlm.nih.gov/26853923/' }
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
    headline: "A kinder way to eat",
    marks: ["sentient being", "empathy, kindness"],
    stat: { figure: "80bn+", label: "land animals slaughtered every year" },
    quote: "Compassion is reflected in the choices we make daily.",
    references: [
      { org: 'Our World in Data', title: 'How many animals are slaughtered each year?', link: 'https://ourworldindata.org/animal-slaughtered' },
      { org: 'FAOSTAT', title: 'Livestock slaughtered: production data', link: 'https://www.fao.org/faostat/en/#data/QCL' }
    ]
  },

  {
    id: 4,
    title: "Sustainability",
    icon: "Leaf",
    color: "#b07a4a",
    image: IMG.aSustainability,
    description:
      "Current food systems consume enormous amounts of land, water, and crops. Livestock use about three-quarters of the world's agricultural land. Plant-focused food systems are significantly more resource-efficient and environmentally sustainable for a growing global population.",
    highlights: ["Efficient food production", "Lower land usage", "Supports food equity", "Reduced ecological strain"],
    headline: "Doing more with less land",
    marks: ["about three-quarters of the world's agricultural land"],
    stat: { figure: "~77%", label: "of farmland is used for livestock" },
    quote: "Sustainable systems begin with sustainable plates.",
    references: [
      { org: 'Our World in Data', title: 'Global land use for food production', link: 'https://ourworldindata.org/land-use' },
      { org: 'Our World in Data', title: 'Half of the world\'s habitable land is used for agriculture', link: 'https://ourworldindata.org/land-use' }
    ]
  },

  {
    id: 5,
    title: "Climate Action",
    icon: "CloudSun",
    color: "#6f9a9a",
    image: IMG.aClimateAction,
    description:
      "Climate scientists consistently identify food systems as a major contributor to global warming. Reducing meat and dairy consumption can significantly decrease methane emissions, habitat destruction, and long-term environmental degradation.",
    highlights: ["Reduces methane emissions", "Supports climate goals", "Protects ecosystems", "Lowers environmental pressure"],
    headline: "A plate-sized climate action",
    marks: ["decrease methane emissions"],
    stat: { figure: "21–37%", label: "of global emissions come from food systems" },
    quote: "Small dietary shifts can create large climate impact.",
    references: [
      { org: 'IPCC', title: 'Special Report on Climate Change and Land', link: 'https://www.ipcc.ch/srccl/' },
      { org: 'NASA Climate', title: 'The Causes of Climate Change', link: 'https://climate.nasa.gov/' }
    ]
  },

  {
    id: 6,
    title: "Future Generations",
    icon: "Sprout",
    color: "#7f9a5f",
    image: IMG.aFutureGen,
    description:
      "Sustainable eating habits today directly affect the health of future generations. Cleaner ecosystems, healthier food systems, and responsible resource consumption help create a safer and more balanced world for children and future communities.",
    highlights: ["Protects future resources", "Encourages responsible living", "Improves food sustainability", "Supports long-term wellbeing"],
    headline: "Food choices that outlast us",
    marks: ["health of future generations"],
    stat: { figure: "~10bn", label: "people to feed by 2050" },
    quote: "The choices we make today shape tomorrow’s planet.",
    references: [
      { org: 'FAO', title: 'The future of food and agriculture', link: 'https://www.fao.org/global-perspectives-studies/food-agriculture-projections-to-2050/en' },
      { org: 'UN', title: 'Sustainable Development Goals', link: 'https://www.un.org/sustainabledevelopment/' }
    ]
  },
];
