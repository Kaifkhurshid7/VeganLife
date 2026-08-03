import { IMG } from '../constants/images';

export const blogs = [
  {
    id: 1,
    title: 'The Invisible Water Footprint: Beyond the Shower',
    category: 'Sustainability',
    author: 'Elena Rostov',
    readTime: '5 min read',
    date: 'May 24, 2026',
    image: IMG.bWaterFootprint,
    url: '/posts/1',
    tags: ['Water', 'Food Systems'],
    summary: 'One vegan day saves more water than a month of skipped showers.',
    desc: 'Discover how switching to a plant-based lifestyle for just one day saves more water than avoiding showers for an entire month, and how food production choices dictate our global water security.',
    references: [
      { org: 'FAO', title: 'Livestock and Water', link: 'https://www.fao.org/' },
      { org: 'Our World in Data', title: 'Environmental Impacts of Food', link: 'https://ourworldindata.org/environmental-impacts-of-food' }
    ]
  },
  {
    id: 2,
    title: 'Fueling the Elite: Veganism in Strength & Endurance Sports',
    category: 'Fitness',
    author: 'Marcus Vance',
    readTime: '7 min read',
    date: 'May 18, 2026',
    image: IMG.bEliteAthlete,
    url: '/posts/2',
    tags: ['Sports', 'Recovery'],
    summary: 'Plant-based athletes recover faster and perform at the top.',
    desc: 'From professional football players to champion ultra-marathoners, discover how elite athletes use anti-inflammatory whole vegan foods to radically accelerate muscle recovery and maximize performance limits.',
    references: [
      { org: 'Academy of Nutrition and Dietetics', title: 'Vegetarian Diets Position Paper', link: 'https://www.eatright.org/' },
      { org: 'PubMed', title: 'Plant-based diets and athletic performance', link: 'https://pubmed.ncbi.nlm.nih.gov/' }
    ]
  },
  {
    id: 3,
    title: 'The ₹150 A Day Student Meal Prep Blueprint',
    category: 'Student Life',
    author: 'Kaia Mercer',
    readTime: '6 min read',
    date: 'May 12, 2026',
    image: IMG.bMealPrep,
    url: '/posts/3',
    tags: ['Budget', 'Meal Prep'],
    summary: 'Batch-cook a full week of high-protein meals for under ₹150 a day.',
    desc: "Say goodbye to overpriced groceries and complex recipes. Learn the ultimate bulk ingredient hacks to prepare nutritious, high-protein vegan meals that fit perfectly into a busy college student's budget.",
    references: [
      { org: 'ICMR India', title: 'Dietary Guidelines for Indians', link: 'https://www.icmr.gov.in/' },
      { org: 'NIN India', title: 'Dietary Guidelines for Indians', link: 'https://www.nin.res.in/' }
    ]
  },
  {
    id: 4,
    title: 'Soil, Forests, and the Climate Rescue Plan',
    category: 'Climate',
    author: 'Dr. Julian Thorne',
    readTime: '8 min read',
    date: 'May 02, 2026',
    image: IMG.bForests,
    url: '/posts/4',
    tags: ['Land Use', 'Carbon'],
    summary: 'Regenerating livestock pastureland could capture hundreds of gigatons of carbon.',
    desc: "A look at the science of regenerative agriculture. How reforesting lands currently allocated to livestock feed could capture hundreds of gigatons of carbon, acting as our planet's strongest natural defense.",
    references: [
      { org: 'FAO', title: 'Livestock and Climate Change', link: 'https://www.fao.org/' },
      { org: 'IPCC', title: 'Climate Change and Land', link: 'https://www.ipcc.ch/' }
    ]
  },
  {
    id: 5,
    title: 'The Invisible Water Footprint Behind Everyday Meals',
    category: 'Sustainability',
    author: 'VeganLife',
    readTime: '5 min read',
    date: 'May 24, 2026',
    image: IMG.bWaterFootprint2,
    url: 'https://www.allrecipes.com/article/plant-based-diet-is-sustainable/?utm_source=chatgpt.com',
    tags: ['Water', 'Food Systems'],
    summary: 'Replacing a few meat meals weekly dramatically cuts freshwater demand.',
    desc: 'Discover how food choices impact water consumption far beyond household usage. Learn why replacing even a few animal-based meals each week can significantly reduce freshwater demand and environmental stress. (Allrecipes)',
    references: [
      { org: 'Our World in Data', title: 'Environmental Impacts of Food', link: 'https://ourworldindata.org/environmental-impacts-of-food' },
      { org: 'FAO', title: 'Water use in livestock', link: 'https://www.fao.org/' }
    ]
  },
  {
    id: 6,
    title: 'Fueling Strength: Vegan Nutrition for Muscle Growth & Recovery',
    category: 'Fitness',
    author: 'VeganLife',
    readTime: '7 min read',
    date: 'May 18, 2026',
    image: IMG.bStrength,
    url: 'https://www.amritahealthfoods.com/blogs/news/build-muscle-recover-faster-the-power-of-vegan-protein-for-athletes?srsltid=AfmBOop4iauogSUzhAS5xNOioT3CNVJjfbu5n6L6UeausMMofO4ioU6k&utm_source=chatgpt.com',
    tags: ['Muscle', 'Protein'],
    summary: 'Tofu, lentils, soy and legumes build strength without animal products.',
    desc: 'Explore how athletes build strength and endurance using plant-based protein sources like tofu, lentils, soy chunks, and legumes while maintaining optimal recovery and performance. (Amrita Health Foods)',
    references: [
      { org: 'Academy of Nutrition and Dietetics', title: 'Vegetarian Diets Position Paper', link: 'https://www.eatright.org/' },
      { org: 'PubMed', title: 'Dietary protein and muscle protein synthesis', link: 'https://pubmed.ncbi.nlm.nih.gov/' }
    ]
  },
  {
    id: 7,
    title: 'The ₹150/Day Student Vegan Meal Blueprint',
    category: 'Student Life',
    author: 'VeganLife',
    readTime: '6 min read',
    date: 'May 12, 2026',
    image: IMG.bStudentBlueprint,
    url: '/posts/7',
    tags: ['Budget', 'Meal Prep'],
    summary: 'A practical guide to affordable high-protein vegan student meals.',
    desc: 'A practical guide to affordable high-protein vegan meals for students, including grocery budgeting, meal prep strategies, hostel-friendly recipes, and weekly nutrition planning.',
    references: [
      { org: 'NIN India', title: 'Dietary Guidelines for Indians', link: 'https://www.nin.res.in/' },
      { org: 'Harvard Nutrition Source', title: 'Healthy Eating Plate', link: 'https://nutritionsource.hsph.harvard.edu/' }
    ]
  },
  {
    id: 8,
    title: 'Protein Without Meat: Building a Complete Plant-Based Diet',
    category: 'Nutrition',
    author: 'VeganLife',
    readTime: '9 min read',
    date: 'April 27, 2026',
    image: IMG.bPlantProtein,
    url: 'https://www.healthline.com/nutrition/vegan-diet-benefits',
    tags: ['Protein', 'Amino Acids'],
    summary: 'Combining legumes, grains and soy gives complete amino acid profiles.',
    desc: 'Learn how combining legumes, grains, soy products, nuts, and seeds can provide complete amino acid profiles and support healthy muscle development and overall wellbeing. (Healthline)',
    references: [
      { org: 'Harvard Nutrition Source', title: 'Plant-Based Proteins', link: 'https://nutritionsource.hsph.harvard.edu/' },
      { org: 'NIH Office of Dietary Supplements', title: 'Dietary protein', link: 'https://ods.od.nih.gov/factsheets/' }
    ]
  },
  {
    id: 9,
    title: 'Common Vegan Myths Debunked by Nutrition Experts',
    category: 'Awareness',
    author: 'VeganLife',
    readTime: '6 min read',
    date: 'April 19, 2026',
    image: IMG.bVeganMyths,
    url: 'https://www.theguardian.com/lifeandstyle/2024/sep/28/vegan-plant-based-myths-busted-by-experts',
    tags: ['Myths', 'Evidence'],
    summary: 'What current research actually says about protein, cost and vegan health.',
    desc: 'From protein concerns to affordability myths, discover what current nutrition and sustainability research actually says about modern vegan lifestyles. (The Guardian)',
    references: [
      { org: 'Academy of Nutrition and Dietetics', title: 'Vegetarian Diets Position Paper', link: 'https://www.eatright.org/' },
      { org: 'NIH Office of Dietary Supplements', title: 'Vitamin B12', link: 'https://ods.od.nih.gov/factsheets/' }
    ]
  },
  {
    id: 10,
    title: 'Gut Health Revolution: How Plant Fiber Transforms Your Microbiome',
    category: 'Nutrition',
    author: 'Dr. Meera Shah',
    readTime: '8 min read',
    date: 'June 2, 2026',
    image: IMG.bGutHealth,
    url: '/posts/10',
    tags: ['Gut', 'Fiber'],
    summary: 'Eating 30+ plant foods a week builds a thriving gut ecosystem.',
    desc: 'Your gut microbiome hosts trillions of bacteria that influence mood, immunity, and weight. Learn how plant diversity — eating 30+ plant foods weekly — creates a thriving gut ecosystem that animal-based diets simply cannot replicate.',
    references: [
      { org: 'Harvard Nutrition Source', title: 'Fiber and the microbiome', link: 'https://nutritionsource.hsph.harvard.edu/' },
      { org: 'PubMed', title: 'Gut microbiota and plant-based diets', link: 'https://pubmed.ncbi.nlm.nih.gov/' }
    ]
  },
  {
    id: 11,
    title: 'Zero-Waste Kitchen: A Vegan Student\'s Complete Guide',
    category: 'Sustainability',
    author: 'Priya Nair',
    readTime: '7 min read',
    date: 'June 8, 2026',
    image: IMG.bZeroWaste,
    url: '/posts/11',
    tags: ['Zero Waste', 'Budget'],
    summary: 'Combine veganism with zero-waste habits to cut kitchen waste by 80%.',
    desc: 'From composting banana peels to making vegetable broth from scraps, discover how combining veganism with zero-waste principles can eliminate 80% of your kitchen waste while saving money on groceries.',
    references: [
      { org: 'FAO', title: 'Food loss and waste', link: 'https://www.fao.org/' },
      { org: 'Our World in Data', title: 'Food waste', link: 'https://ourworldindata.org/food-waste' }
    ]
  },
  {
    id: 12,
    title: 'The Psychology of Going Vegan: Overcoming Social Pressure',
    category: 'Student Life',
    author: 'Ananya Rao',
    readTime: '6 min read',
    date: 'June 14, 2026',
    image: IMG.bPsychology,
    url: '/posts/12',
    tags: ['Mindset', 'Social'],
    summary: 'Practical scripts for navigating family, friends and cultural expectations.',
    desc: 'Navigating family gatherings, peer pressure, and cultural expectations as a vegan student in India. Practical communication strategies and scripts for common situations without alienating loved ones.',
    references: [
      { org: 'PubMed', title: 'Psychology of dietary behaviour change', link: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { org: 'Harvard Health', title: 'Building healthy habits', link: 'https://www.health.harvard.edu/' }
    ]
  },
  {
    id: 13,
    title: 'Indian Street Food: 25 Accidentally Vegan Snacks You Already Love',
    category: 'Recipes',
    author: 'Chef Rohan Das',
    readTime: '5 min read',
    date: 'June 18, 2026',
    image: IMG.bStreetFood,
    url: '/posts/13',
    tags: ['Street Food', 'Indian'],
    summary: 'Pani puri, bhel, samosa, vada pav — vegan street food everywhere.',
    desc: 'Pani puri, bhel puri, samosa, vada pav, poha — India has one of the richest traditions of plant-based street food in the world. A curated guide to finding and enjoying vegan street food safely.',
    references: [
      { org: 'NIN India', title: 'Dietary Guidelines for Indians', link: 'https://www.nin.res.in/' },
      { org: 'WHO', title: 'Food safety', link: 'https://www.who.int/' }
    ]
  },
  {
    id: 14,
    title: 'Vegan on a Deadline: 15-Minute Meals for Exam Season',
    category: 'Recipes',
    author: 'Kaia Mercer',
    readTime: '4 min read',
    date: 'June 22, 2026',
    image: IMG.bQuickMeals,
    url: '/posts/14',
    tags: ['Quick Meals', 'Exams'],
    summary: '15 recipes, each under 15 minutes, built for marathon study days.',
    desc: 'When exams hit, cooking becomes the last priority. These 15 recipes each take under 15 minutes, require minimal ingredients, and provide the brain fuel you need to stay sharp during marathon study sessions.',
    references: [
      { org: 'Harvard Nutrition Source', title: 'Simple meal ideas', link: 'https://nutritionsource.hsph.harvard.edu/' },
      { org: 'ICMR India', title: 'Dietary Guidelines for Indians', link: 'https://www.icmr.gov.in/' }
    ]
  },
  {
    id: 15,
    title: 'Climate Anxiety and Action: How Your Plate Fights Back',
    category: 'Climate',
    author: 'Dr. Julian Thorne',
    readTime: '9 min read',
    date: 'June 25, 2026',
    image: IMG.bClimateAnxiety,
    url: '/posts/15',
    tags: ['Climate', 'Action'],
    summary: 'Dietary choices aggregate into measurable planetary impact.',
    desc: 'Climate anxiety affects 75% of young people. This article bridges the gap between despair and empowerment, showing how individual dietary choices aggregate into measurable planetary impact when communities adopt them together.',
    references: [
      { org: 'NASA Climate', title: 'How Do We Know?', link: 'https://climate.nasa.gov/' },
      { org: 'IPCC', title: 'Climate Change and Land', link: 'https://www.ipcc.ch/' }
    ]
  },
  {
    id: 16,
    title: 'Plant-Based Omega-3s: Beyond Fish Oil',
    category: 'Nutrition',
    author: 'Dr. Meera Shah',
    readTime: '7 min read',
    date: 'June 28, 2026',
    image: IMG.bOmega3,
    url: '/posts/16',
    tags: ['Omega-3', 'Fats'],
    summary: 'Flax, chia, walnuts and algae cover your omega-3 needs sustainably.',
    desc: 'Flaxseeds, chia seeds, walnuts, and algae-based DHA supplements offer everything your brain and heart need without depleting ocean ecosystems. A deep dive into conversion rates and optimal intake strategies.',
    references: [
      { org: 'NIH Office of Dietary Supplements', title: 'Omega-3 Fatty Acids', link: 'https://ods.od.nih.gov/factsheets/' },
      { org: 'Harvard Nutrition Source', title: 'Fats and Cholesterol', link: 'https://nutritionsource.hsph.harvard.edu/' }
    ]
  },
  {
    id: 17,
    title: 'The Hidden Carbon Cost of Dairy: A Visual Breakdown',
    category: 'Climate',
    author: 'Elena Rostov',
    readTime: '6 min read',
    date: 'June 30, 2026',
    image: IMG.bDairyCarbon,
    url: '/posts/17',
    tags: ['Dairy', 'Emissions'],
    summary: 'Cow milk emits ~3x the greenhouse gases of oat milk.',
    desc: 'A single glass of cow milk produces 3x the greenhouse emissions of oat milk. This visual guide breaks down the full lifecycle — from feed crop agriculture to methane emissions to transportation — revealing why dairy is the overlooked climate culprit.',
    references: [
      { org: 'FAO', title: 'Greenhouse gas emissions from livestock', link: 'https://www.fao.org/' },
      { org: 'Our World in Data', title: 'Environmental Impacts of Food', link: 'https://ourworldindata.org/environmental-impacts-of-food' }
    ]
  },
  {
    id: 18,
    title: 'Vegan Bodybuilding: Complete Periodization Guide',
    category: 'Fitness',
    author: 'Marcus Vance',
    readTime: '10 min read',
    date: 'June 15, 2026',
    image: IMG.bBodybuilding,
    url: '/posts/18',
    tags: ['Muscle', 'Programming'],
    summary: 'A structured 12-week bulking-to-cutting plan for plant-based athletes.',
    desc: 'From bulking to cutting to maintenance, a structured 12-week periodization plan specifically designed for plant-based athletes. Includes macro targets, supplement protocols, and recovery strategies tailored to vegan nutrition.',
    references: [
      { org: 'Academy of Nutrition and Dietetics', title: 'Vegetarian Diets Position Paper', link: 'https://www.eatright.org/' },
      { org: 'PubMed', title: 'Protein intake for muscle hypertrophy', link: 'https://pubmed.ncbi.nlm.nih.gov/' }
    ]
  },
  {
    id: 19,
    title: 'Fermented Foods: The Vegan Probiotic Powerhouse',
    category: 'Nutrition',
    author: 'Dr. Meera Shah',
    readTime: '6 min read',
    date: 'June 10, 2026',
    image: IMG.bFermented,
    url: '/posts/19',
    tags: ['Probiotics', 'Gut'],
    summary: 'Tempeh, idli, kanji and kimchi bring live cultures to plant diets.',
    desc: 'Kimchi, sauerkraut, tempeh, miso, kombucha, and idli — fermented foods provide billions of live cultures that strengthen immunity, improve nutrient absorption, and support mental health through the gut-brain axis.',
    references: [
      { org: 'PubMed', title: 'Probiotics and gut health', link: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { org: 'Harvard Health', title: 'The gut-brain connection', link: 'https://www.health.harvard.edu/' }
    ]
  },
  {
    id: 20,
    title: 'From Farm to Fork: Understanding Vegan Supply Chains in India',
    category: 'Sustainability',
    author: 'Priya Nair',
    readTime: '8 min read',
    date: 'June 5, 2026',
    image: IMG.bSupplyChains,
    url: '/posts/20',
    tags: ['Supply Chain', 'Local Food'],
    summary: 'Tracing pulses, grains and vegetables from Indian farms to your plate.',
    desc: 'Tracing how pulses, grains, and vegetables move from Indian farms to your plate. Understanding seasonal availability, local sourcing, and how supporting small farmers creates resilient, sustainable food systems.',
    references: [
      { org: 'FAO', title: 'Sustainable food systems', link: 'https://www.fao.org/' },
      { org: 'NIN India', title: 'Dietary Guidelines for Indians', link: 'https://www.nin.res.in/' }
    ]
  },
  {
    id: 21,
    title: 'Sleep, Recovery, and Plant Nutrition: The Overlooked Connection',
    category: 'Fitness',
    author: 'Marcus Vance',
    readTime: '7 min read',
    date: 'May 28, 2026',
    image: IMG.bSleepRecovery,
    url: '/posts/21',
    tags: ['Sleep', 'Recovery'],
    summary: 'Tryptophan, magnesium and melatonin foods can improve sleep quality.',
    desc: 'Tryptophan-rich foods, magnesium from dark greens, and cherry-based melatonin sources — how a carefully designed vegan evening meal can improve sleep quality by 40% and accelerate overnight muscle recovery.',
    references: [
      { org: 'PubMed', title: 'Diet and sleep quality', link: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { org: 'NIH Office of Dietary Supplements', title: 'Magnesium', link: 'https://ods.od.nih.gov/factsheets/' }
    ]
  },
  {
    id: 22,
    title: 'Vegan Skincare: What You Eat Shows on Your Face',
    category: 'General',
    author: 'Ananya Rao',
    readTime: '5 min read',
    date: 'May 20, 2026',
    image: IMG.bSkincare,
    url: '/posts/22',
    tags: ['Skincare', 'Vitamins'],
    summary: 'Vitamins A, C, E and zinc — the plant foods that feed your skin.',
    desc: 'Eliminating dairy has been linked to clearer skin in multiple studies. Learn which plant foods provide the vitamins A, C, E, and zinc your skin needs, plus a 7-day meal plan designed specifically for glowing skin.',
    references: [
      { org: 'NIH Office of Dietary Supplements', title: 'Vitamin C', link: 'https://ods.od.nih.gov/factsheets/' },
      { org: 'Harvard Nutrition Source', title: 'Skin health and diet', link: 'https://nutritionsource.hsph.harvard.edu/' }
    ]
  },
  {
    id: 23,
    title: 'The Economics of Veganism: Saving Money While Saving the Planet',
    category: 'Student Life',
    author: 'Kaia Mercer',
    readTime: '6 min read',
    date: 'May 10, 2026',
    image: IMG.bEconomics,
    url: '/posts/23',
    tags: ['Budget', 'Economics'],
    summary: 'A well-planned vegan diet costs 30–40% less in India.',
    desc: 'Data shows that a well-planned vegan diet costs 30-40% less than a meat-based diet in India. Breakdown of monthly costs, bulk buying strategies, and how to maximize nutrition per rupee spent.',
    references: [
      { org: 'Our World in Data', title: 'Food prices and costs', link: 'https://ourworldindata.org/food-prices' },
      { org: 'ICMR India', title: 'Dietary Guidelines for Indians', link: 'https://www.icmr.gov.in/' }
    ]
  },
  {
    id: 24,
    title: 'The Vegan Iron Playbook: Combating Fatigue on Plant Foods',
    category: 'Nutrition',
    author: 'Dr. Meera Shah',
    readTime: '7 min read',
    date: 'July 3, 2026',
    image: IMG.bNewIron,
    url: '/posts/24',
    tags: ['Iron', 'Energy'],
    summary: 'Pair plant iron with vitamin C to beat study-day fatigue.',
    desc: 'Fatigue and poor concentration are the first signs of low iron — common in students. Learn which plant sources deliver the most absorbable iron, how vitamin C supercharges uptake, and which foods inhibit it.',
    references: [
      { org: 'NIH Office of Dietary Supplements', title: 'Iron', link: 'https://ods.od.nih.gov/factsheets/' },
      { org: 'WHO', title: 'Iron Deficiency Anaemia', link: 'https://www.who.int/' }
    ]
  },
  {
    id: 25,
    title: 'Hostel Life, Plant-Based: A Survival Guide for Indian Campuses',
    category: 'Student Life',
    author: 'Ananya Rao',
    readTime: '6 min read',
    date: 'July 6, 2026',
    image: IMG.bNewCampus,
    url: '/posts/25',
    tags: ['Hostel', 'Campus'],
    summary: 'Kettle-only cooking, mess hacks and dorm-fridge staples for students.',
    desc: 'Living on a hostel mess or a single hotplate doesn\'t mean giving up plant-based eating. Practical hacks for kettle cooking, mess-food modifications, and the cheapest staples that survive a dorm room.',
    references: [
      { org: 'ICMR India', title: 'Dietary Guidelines for Indians', link: 'https://www.icmr.gov.in/' },
      { org: 'NIN India', title: 'Dietary Guidelines for Indians', link: 'https://www.nin.res.in/' }
    ]
  }
];
