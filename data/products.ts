// Unified Product Data for Springz Nutrition

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  currency: string
  rating: number
  reviewCount: number
  images: string[]
  category: 'plant-protein' | 'functional-foods' | 'high-protein-snacks'
  categoryName: string
  sizes: Array<{
    name: string
    price: number
    originalPrice?: number
    available: boolean
  }>
  nutrition: {
    servingSize: string
    protein: string
    calories: string
    fats: string
    carbs: string
    sugar: string
  }
  features: Array<{
    icon: string
    label: string
    description: string
  }>
  ingredients: string
  nutritionFacts: Array<{
    label: string
    value: string
  }>
  howToUse: string[]
  science: string[]
  faqs: Array<{
    question: string
    answer: string
  }>
  tags: string[]
  inStock: boolean
  featured: boolean
}

export const productCategories = {
  'plant-protein': {
    name: 'Plant Protein',
    description: 'Science-grade plant-based proteins with superior amino acid profiles',
    image: '/athletic-person-protein-shake.png'
  },
  'functional-foods': {
    name: 'Functional Foods',
    description: 'Nutrient-dense functional foods for enhanced performance and recovery',
    image: '/recovery-blend-ingredients.png'
  },
  'high-protein-snacks': {
    name: 'High-Protein Snacks',
    description: 'Convenient, ready-to-eat protein snacks for busy lifestyles',
    image: '/placeholder-wsy0q.png'
  }
}

export const allProducts: Product[] = [
  // Plant Protein Category
  {
    id: "pp001",
    name: "Premium Plant Protein",
    slug: "premium-plant-protein",
    description: "Clean, high-digestibility plant protein for real-world performance with DIAAS-100% amino acid availability.",
    shortDescription: "Chocolate flavor, 900g premium plant protein",
    price: 1499,
    originalPrice: 1799,
    currency: "₹",
    rating: 4.5,
    reviewCount: 352,
    images: ["/native-protein-powder.png", "/placeholder-wsy0q.png"],
    category: "plant-protein",
    categoryName: "Plant Protein",
    sizes: [
      { name: "900g", price: 1499, originalPrice: 1799, available: true },
      { name: "450g", price: 899, originalPrice: 1099, available: true },
      { name: "1.8kg", price: 2699, originalPrice: 3199, available: false }
    ],
    nutrition: {
      servingSize: "35g",
      protein: "25g",
      calories: "135",
      fats: "3.5g",
      carbs: "6g",
      sugar: "0.5g"
    },
    features: [
      { icon: "diaas", label: "DIAAS 100%", description: "Superior amino acid availability" },
      { icon: "clean", label: "Clean Label", description: "No artificial additives" },
      { icon: "sustainable", label: "Sustainable", description: "Eco-friendly sourcing" }
    ],
    ingredients: "Pea Protein Isolate, Brown Rice Protein, Pumpkin Seed Protein, Spirulina",
    nutritionFacts: [
      { label: "Serving Size", value: "35g" },
      { label: "Calories", value: "135" },
      { label: "Fats", value: "3.5g" },
      { label: "Carbs", value: "6g" },
      { label: "Sugar", value: "0.5g" },
      { label: "Sodium", value: "120mg" },
      { label: "Fiber", value: "2g" }
    ],
    howToUse: [
      "Mix 1 scoop (35g) with 250-300ml of water, milk, or plant-based milk",
      "Consume post-workout for optimal muscle recovery",
      "Can also be used as a daily protein supplement between meals"
    ],
    science: [
      "DIAAS-100% formulation for superior amino acid availability",
      "Clinical-grade sourcing with stringent quality control",
      "Clean-label certified with no artificial colors or preservatives",
      "Third-party tested for purity and potency"
    ],
    faqs: [
      {
        question: "Can I mix this with milk?",
        answer: "Yes, you can mix this protein powder with milk, water, or your favorite plant-based milk alternative for enhanced taste and nutrition."
      },
      {
        question: "Is it lactose-free?",
        answer: "Yes, this is a 100% plant-based protein that is naturally lactose-free and suitable for vegans and those with lactose intolerance."
      },
      {
        question: "How does it taste?",
        answer: "Our chocolate flavor is naturally sweetened and has a smooth, creamy texture that mixes well without being chalky or gritty."
      }
    ],
    tags: ["vegan", "gluten-free", "non-gmo", "sustainable"],
    inStock: true,
    featured: true
  },
  {
    id: "pp002",
    name: "Native Protein Classic",
    slug: "native-protein-classic",
    description: "Premium whey protein with superior bioavailability for muscle building and recovery.",
    shortDescription: "Vanilla flavor, 1kg whey protein",
    price: 1299,
    originalPrice: 1599,
    currency: "₹",
    rating: 4.7,
    reviewCount: 428,
    images: ["/placeholder-wsy0q.png"],
    category: "plant-protein",
    categoryName: "Plant Protein",
    sizes: [
      { name: "1kg", price: 1299, originalPrice: 1599, available: true },
      { name: "2kg", price: 2399, originalPrice: 2999, available: true }
    ],
    nutrition: {
      servingSize: "30g",
      protein: "25g", 
      calories: "123",
      fats: "2g",
      carbs: "4g",
      sugar: "0g"
    },
    features: [
      { icon: "diaas", label: "DIAAS 100%", description: "Complete amino acid profile" },
      { icon: "fast", label: "Fast Absorption", description: "Quick muscle recovery" },
      { icon: "clean", label: "Clean Label", description: "No fillers or additives" }
    ],
    ingredients: "Whey Protein Concentrate, Natural Flavors, Stevia Extract",
    nutritionFacts: [
      { label: "Serving Size", value: "30g" },
      { label: "Calories", value: "123" },
      { label: "Fats", value: "2g" },
      { label: "Carbs", value: "4g" },
      { label: "Sugar", value: "0g" },
      { label: "Sodium", value: "95mg" },
      { label: "Cholesterol", value: "25mg" }
    ],
    howToUse: [
      "Mix 1 scoop (30g) with 200-250ml of water or milk",
      "Best consumed within 30 minutes post-workout",
      "Can be used 1-2 times daily as per protein requirements"
    ],
    science: [
      "Native whey protein for maximum bioavailability",
      "Cold-processed to preserve protein structure",
      "Third-party tested for purity and potency",
      "Fast-digesting for optimal muscle protein synthesis"
    ],
    faqs: [
      {
        question: "What is Native Whey?",
        answer: "Native whey is extracted directly from milk rather than being a byproduct of cheese making, resulting in a purer, more bioavailable protein."
      },
      {
        question: "Is this suitable for beginners?",
        answer: "Yes, this protein is perfect for both beginners and advanced athletes. Start with one scoop daily and adjust as needed."
      },
      {
        question: "Does it mix well?",
        answer: "Yes, our formula is designed to mix smoothly without clumping when shaken or stirred properly."
      }
    ],
    tags: ["whey", "fast-absorption", "muscle-building"],
    inStock: true,
    featured: true
  },
  {
    id: "pp003",
    name: "Organic Green Protein",
    slug: "organic-green-protein",
    description: "Organic plant protein blend with supergreens for complete nutrition.",
    shortDescription: "Organic blend, 750g with supergreens",
    price: 1799,
    originalPrice: 2199,
    currency: "₹",
    rating: 4.3,
    reviewCount: 186,
    images: ["/placeholder-wsy0q.png"],
    category: "plant-protein",
    categoryName: "Plant Protein",
    sizes: [
      { name: "750g", price: 1799, originalPrice: 2199, available: true }
    ],
    nutrition: {
      servingSize: "40g",
      protein: "22g",
      calories: "145",
      fats: "4g",
      carbs: "8g",
      sugar: "1g"
    },
    features: [
      { icon: "sustainable", label: "Organic", description: "Certified organic ingredients" },
      { icon: "clean", label: "Supergreens", description: "20+ organic greens blend" },
      { icon: "diaas", label: "Antioxidants", description: "Rich in natural antioxidants" }
    ],
    ingredients: "Organic Pea Protein, Spirulina, Chlorella, Spinach Powder, Kale Powder",
    nutritionFacts: [
      { label: "Serving Size", value: "40g" },
      { label: "Calories", value: "145" },
      { label: "Fats", value: "4g" },
      { label: "Carbs", value: "8g" },
      { label: "Sugar", value: "1g" },
      { label: "Fiber", value: "3g" },
      { label: "Iron", value: "5mg" }
    ],
    howToUse: [
      "Mix 1 scoop (40g) with 300ml of water or plant milk",
      "Best consumed in the morning or post-workout",
      "Can be blended into smoothies for enhanced nutrition"
    ],
    science: [
      "Certified organic by leading certification bodies",
      "Contains 20+ organic vegetables and supergreens",
      "Rich in chlorophyll and natural antioxidants",
      "Supports overall health and immune function"
    ],
    faqs: [
      {
        question: "What makes this organic?",
        answer: "All ingredients are certified organic, grown without pesticides, herbicides, or synthetic fertilizers."
      },
      {
        question: "Can I taste the greens?",
        answer: "The natural flavor is mild and earthy. It blends well with fruits in smoothies to mask any vegetable taste."
      },
      {
        question: "Is it suitable for detox?",
        answer: "Yes, the organic greens and antioxidants support natural detoxification processes in the body."
      }
    ],
    tags: ["organic", "vegan", "supergreens", "antioxidants"],
    inStock: true,
    featured: false
  },

  // Functional Foods Category
  {
    id: "ff001",
    name: "Peanut Butter Powder",
    slug: "peanut-butter-powder",
    description: "High-protein, low-fat peanut butter powder perfect for smoothies and baking.",
    shortDescription: "Natural protein boost, 400g powder",
    price: 899,
    originalPrice: 1099,
    currency: "₹",
    rating: 4.6,
    reviewCount: 243,
    images: ["/placeholder-wsy0q.png"],
    category: "functional-foods",
    categoryName: "Functional Foods",
    sizes: [
      { name: "400g", price: 899, originalPrice: 1099, available: true },
      { name: "800g", price: 1599, originalPrice: 1999, available: true }
    ],
    nutrition: {
      servingSize: "25g",
      protein: "12g",
      calories: "95",
      fats: "3g",
      carbs: "6g",
      sugar: "2g"
    },
    features: [
      { icon: "clean", label: "Low Fat", description: "85% less fat than regular peanut butter" },
      { icon: "diaas", label: "High Protein", description: "12g protein per serving" },
      { icon: "sustainable", label: "Natural", description: "No artificial preservatives" }
    ],
    ingredients: "Defatted Peanut Flour, Natural Flavors, Sea Salt",
    nutritionFacts: [
      { label: "Serving Size", value: "25g" },
      { label: "Calories", value: "95" },
      { label: "Fats", value: "3g" },
      { label: "Carbs", value: "6g" },
      { label: "Sugar", value: "2g" },
      { label: "Sodium", value: "180mg" },
      { label: "Potassium", value: "240mg" }
    ],
    howToUse: [
      "Mix 2-3 tablespoons with water to make peanut butter spread",
      "Add to smoothies, oatmeal, or yogurt for extra protein",
      "Use in baking recipes as a healthy flour substitute"
    ],
    science: [
      "Defatted through natural pressing process",
      "Retains natural peanut flavor and nutrients",
      "High protein content supports muscle maintenance",
      "Versatile ingredient for multiple culinary applications"
    ],
    faqs: [
      {
        question: "How do I reconstitute it?",
        answer: "Mix 2 parts powder with 1 part water to create a paste consistency similar to regular peanut butter."
      },
      {
        question: "Does it taste like peanut butter?",
        answer: "Yes, it retains the authentic peanut flavor but with a slightly lighter taste due to reduced fat content."
      },
      {
        question: "Can I use it in baking?",
        answer: "Absolutely! It's perfect for protein pancakes, muffins, and energy balls. Use it to replace some flour in recipes."
      }
    ],
    tags: ["natural", "low-fat", "versatile", "protein-rich"],
    inStock: true,
    featured: true
  },
  {
    id: "ff002",
    name: "Recovery Blend Plus",
    slug: "recovery-blend-plus",
    description: "Advanced post-workout recovery formula with protein, BCAAs, and electrolytes.",
    shortDescription: "Post-workout recovery, 500g blend",
    price: 1799,
    originalPrice: 2199,
    currency: "₹",
    rating: 4.4,
    reviewCount: 167,
    images: ["/recovery-blend-ingredients.png"],
    category: "functional-foods",
    categoryName: "Functional Foods",
    sizes: [
      { name: "500g", price: 1799, originalPrice: 2199, available: true }
    ],
    nutrition: {
      servingSize: "30g",
      protein: "18g",
      calories: "120",
      fats: "2g",
      carbs: "8g",
      sugar: "3g"
    },
    features: [
      { icon: "fast", label: "Fast Recovery", description: "Optimized for post-workout recovery" },
      { icon: "diaas", label: "BCAAs", description: "Essential amino acids for muscle repair" },
      { icon: "clean", label: "Electrolytes", description: "Replenishes lost minerals" }
    ],
    ingredients: "Whey Protein Isolate, BCAAs, Creatine, Electrolyte Blend, Natural Flavors",
    nutritionFacts: [
      { label: "Serving Size", value: "30g" },
      { label: "Calories", value: "120" },
      { label: "Fats", value: "2g" },
      { label: "Carbs", value: "8g" },
      { label: "Sugar", value: "3g" },
      { label: "BCAAs", value: "5g" },
      { label: "Creatine", value: "2g" }
    ],
    howToUse: [
      "Mix 1 scoop (30g) with 300ml of cold water",
      "Consume within 30 minutes after workout",
      "Can be used on training days for optimal recovery"
    ],
    science: [
      "Scientifically formulated with optimal BCAA ratio (2:1:1)",
      "Contains creatine monohydrate for strength and power",
      "Electrolyte blend helps maintain hydration balance",
      "Fast-absorbing protein for immediate muscle recovery"
    ],
    faqs: [
      {
        question: "When should I take this?",
        answer: "Best consumed within 30 minutes post-workout when your muscles are most receptive to nutrients."
      },
      {
        question: "Can I take it on rest days?",
        answer: "While designed for post-workout use, it can be consumed on rest days to support ongoing recovery processes."
      },
      {
        question: "Does it contain caffeine?",
        answer: "No, this formula is caffeine-free and can be consumed any time without affecting sleep."
      }
    ],
    tags: ["recovery", "bcaa", "electrolytes", "post-workout"],
    inStock: true,
    featured: true
  },
  {
    id: "ff003",
    name: "Greens Super Powder",
    slug: "greens-super-powder",
    description: "Nutrient-dense superfood blend with 20+ organic greens and vegetables.",
    shortDescription: "Superfood blend, 300g with 20+ greens",
    price: 1399,
    originalPrice: 1699,
    currency: "₹",
    rating: 4.2,
    reviewCount: 134,
    images: ["/placeholder-wsy0q.png"],
    category: "functional-foods",
    categoryName: "Functional Foods",
    sizes: [
      { name: "300g", price: 1399, originalPrice: 1699, available: true }
    ],
    nutrition: {
      servingSize: "10g",
      protein: "3g",
      calories: "35",
      fats: "0.5g",
      carbs: "6g",
      sugar: "2g"
    },
    features: [
      { icon: "sustainable", label: "20+ Greens", description: "Comprehensive vegetable blend" },
      { icon: "diaas", label: "Antioxidants", description: "Rich in natural antioxidants" },
      { icon: "clean", label: "Vitamins", description: "Natural vitamins and minerals" }
    ],
    ingredients: "Spinach, Kale, Spirulina, Chlorella, Broccoli, and 15+ organic greens",
    nutritionFacts: [
      { label: "Serving Size", value: "10g" },
      { label: "Calories", value: "35" },
      { label: "Fats", value: "0.5g" },
      { label: "Carbs", value: "6g" },
      { label: "Sugar", value: "2g" },
      { label: "Fiber", value: "2g" },
      { label: "Vitamin A", value: "2500 IU" }
    ],
    howToUse: [
      "Mix 1 scoop (10g) with 200ml of water or juice",
      "Best consumed in the morning on empty stomach",
      "Can be added to smoothies for enhanced nutrition"
    ],
    science: [
      "Contains over 20 certified organic vegetables and greens",
      "Rich in chlorophyll and natural antioxidants",
      "Provides essential vitamins and minerals",
      "Supports alkaline pH balance in the body"
    ],
    faqs: [
      {
        question: "Does it taste good?",
        answer: "The natural taste is earthy and mild. We recommend mixing with fruit juice or adding to smoothies for better taste."
      },
      {
        question: "Can it replace vegetables?",
        answer: "While it's a great supplement, it's designed to complement, not replace, a diet rich in whole vegetables."
      },
      {
        question: "Is it suitable for detox?",
        answer: "Yes, the blend of greens and antioxidants supports the body's natural detoxification processes."
      }
    ],
    tags: ["superfood", "organic", "vitamins", "minerals"],
    inStock: true,
    featured: false
  },

  // High-Protein Snacks Category  
  {
    id: "hps001",
    name: "High Protein Kodubale",
    slug: "high-protein-kodubale",
    description: "Traditional South Indian snack enriched with plant protein for guilt-free indulgence.",
    shortDescription: "Ready to eat, 200g protein snack",
    price: 299,
    originalPrice: 399,
    currency: "₹",
    rating: 4.8,
    reviewCount: 89,
    images: ["/placeholder-wsy0q.png"],
    category: "high-protein-snacks",
    categoryName: "High-Protein Snacks",
    sizes: [
      { name: "200g", price: 299, originalPrice: 399, available: true },
      { name: "500g", price: 699, originalPrice: 899, available: true }
    ],
    nutrition: {
      servingSize: "50g",
      protein: "10g",
      calories: "180",
      fats: "8g",
      carbs: "18g",
      sugar: "2g"
    },
    features: [
      { icon: "protein", label: "10g Protein", description: "High protein content per serving" },
      { icon: "traditional", label: "Traditional", description: "Authentic South Indian recipe" },
      { icon: "crunchy", label: "Crunchy", description: "Satisfying crispy texture" },
      { icon: "ready", label: "Ready to Eat", description: "Convenient snacking option" }
    ],
    ingredients: "Rice Flour, Chickpea Flour, Pea Protein, Spices, Sunflower Oil",
    nutritionFacts: [
      { label: "Serving Size", value: "50g" },
      { label: "Calories", value: "180" },
      { label: "Fats", value: "8g" },
      { label: "Carbs", value: "18g" },
      { label: "Sugar", value: "2g" },
      { label: "Sodium", value: "320mg" },
      { label: "Fiber", value: "3g" }
    ],
    howToUse: [
      "Enjoy directly as a healthy snack",
      "Perfect with evening tea or coffee",
      "Store in airtight container for freshness"
    ],
    science: [
      "Traditional recipe enhanced with plant protein",
      "Baked using traditional methods for authentic taste",
      "Fortified with pea protein for added nutrition",
      "Quality ingredients sourced from local farmers"
    ],
    faqs: [
      {
        question: "How much protein does this provide?",
        answer: "Each 50g serving provides 10g of high-quality protein to support your fitness goals."
      },
      {
        question: "Is this suitable for vegetarians?",
        answer: "Yes, this is completely vegetarian and made with plant-based protein."
      },
      {
        question: "How long does it stay fresh?",
        answer: "When stored in an airtight container, it stays fresh for up to 3 months."
      }
    ],
    tags: ["traditional", "crunchy", "ready-to-eat", "south-indian"],
    inStock: true,
    featured: true
  },
  {
    id: "hps002", 
    name: "Protein Energy Bars",
    slug: "protein-energy-bars",
    description: "Delicious protein bars packed with nuts, seeds, and natural protein for sustained energy.",
    shortDescription: "Mixed flavors, pack of 6 bars",
    price: 499,
    originalPrice: 599,
    currency: "₹",
    rating: 4.5,
    reviewCount: 156,
    images: ["/placeholder-wsy0q.png"],
    category: "high-protein-snacks",
    categoryName: "High-Protein Snacks",
    sizes: [
      { name: "6 Bars", price: 499, originalPrice: 599, available: true },
      { name: "12 Bars", price: 899, originalPrice: 1099, available: true }
    ],
    nutrition: {
      servingSize: "1 bar (45g)",
      protein: "12g",
      calories: "210",
      fats: "9g",
      carbs: "20g",
      sugar: "8g"
    },
    features: [
      { icon: "protein", label: "12g Protein", description: "High protein content per bar" },
      { icon: "natural", label: "Natural", description: "Made with natural ingredients" },
      { icon: "clean", label: "No Artificial Colors", description: "Free from artificial additives" },
      { icon: "energy", label: "Sustained Energy", description: "Long-lasting energy boost" }
    ],
    ingredients: "Dates, Almonds, Whey Protein, Peanut Butter, Dark Chocolate, Chia Seeds",
    nutritionFacts: [
      { label: "Serving Size", value: "1 bar (45g)" },
      { label: "Calories", value: "210" },
      { label: "Fats", value: "9g" },
      { label: "Carbs", value: "20g" },
      { label: "Sugar", value: "8g" },
      { label: "Fiber", value: "4g" },
      { label: "Calcium", value: "80mg" }
    ],
    howToUse: [
      "Perfect pre or post-workout snack",
      "Great for on-the-go energy boost",
      "Store in cool, dry place for best taste"
    ],
    science: [
      "Balanced macronutrient profile for sustained energy",
      "Natural ingredients provide slow-release carbohydrates",
      "Whey protein supports muscle recovery and growth",
      "Antioxidants from dark chocolate and nuts"
    ],
    faqs: [
      {
        question: "Are these bars suitable for diabetics?",
        answer: "These bars contain natural sugars from dates. Please consult your doctor before consuming if you have diabetes."
      },
      {
        question: "Can I eat this as a meal replacement?",
        answer: "While nutritious, these are designed as snacks. For meal replacement, combine with fruits or yogurt."
      },
      {
        question: "Do they contain gluten?",
        answer: "Our bars are gluten-free, but manufactured in facilities that may process gluten-containing ingredients."
      }
    ],
    tags: ["natural", "nuts", "energy", "convenient"],
    inStock: true,
    featured: true
  },
  {
    id: "hps003",
    name: "Roasted Protein Mix",
    slug: "roasted-protein-mix",
    description: "Crunchy mix of protein-rich nuts, seeds, and legumes for healthy snacking.",
    shortDescription: "Roasted mix, 250g premium blend",
    price: 399,
    originalPrice: 499,
    currency: "₹",
    rating: 4.3,
    reviewCount: 78,
    images: ["/placeholder-wsy0q.png"],
    category: "high-protein-snacks",
    categoryName: "High-Protein Snacks",
    sizes: [
      { name: "250g", price: 399, originalPrice: 499, available: true },
      { name: "500g", price: 699, originalPrice: 899, available: true }
    ],
    nutrition: {
      servingSize: "30g",
      protein: "8g",
      calories: "160",
      fats: "12g",
      carbs: "8g",
      sugar: "1g"
    },
    features: [
      { icon: "protein", label: "8g Protein", description: "Quality protein from nuts and seeds" },
      { icon: "roasted", label: "Roasted", description: "Perfectly roasted for flavor" },
      { icon: "clean", label: "No Preservatives", description: "Natural preservation methods" },
      { icon: "healthy", label: "Healthy Fats", description: "Rich in beneficial fats" }
    ],
    ingredients: "Almonds, Cashews, Pumpkin Seeds, Chickpeas, Edamame, Sea Salt, Spices",
    nutritionFacts: [
      { label: "Serving Size", value: "30g" },
      { label: "Calories", value: "160" },
      { label: "Fats", value: "12g" },
      { label: "Carbs", value: "8g" },
      { label: "Sugar", value: "1g" },
      { label: "Fiber", value: "3g" },
      { label: "Vitamin E", value: "4mg" }
    ],
    howToUse: [
      "Enjoy as a healthy snack between meals",
      "Perfect addition to salads or yogurt",
      "Store in airtight container after opening"
    ],
    science: [
      "Slow-roasted to preserve nutrients and enhance flavor",
      "Combination of nuts and seeds provides complete amino acids",
      "Rich in healthy fats, fiber, and plant-based protein",
      "Natural source of vitamin E and essential minerals"
    ],
    faqs: [
      {
        question: "Are these suitable for nut allergies?",
        answer: "This mix contains tree nuts. Please avoid if you have nut allergies."
      },
      {
        question: "How should I store this mix?",
        answer: "Store in an airtight container in a cool, dry place. Consume within 6 months for best quality."
      },
      {
        question: "Can children eat this?",
        answer: "Yes, it's a healthy snack for children over 3 years old, but supervise due to choking hazard from nuts."
      }
    ],
    tags: ["roasted", "nuts", "seeds", "healthy-fats"],
    inStock: true,
    featured: false
  }
]

// Helper functions
export const getProductsByCategory = (category: string) => {
  return allProducts.filter(product => product.category === category)
}

export const getFeaturedProducts = () => {
  return allProducts.filter(product => product.featured)
}

export const getProductBySlug = (slug: string) => {
  return allProducts.find(product => product.slug === slug)
}

export const getAllCategories = () => {
  return Object.entries(productCategories).map(([key, value]) => ({
    id: key,
    ...value
  }))
}