import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')
  
  try {
    // Clear existing data
    console.log('🧹 Cleaning existing data...')
    await prisma.orderItem.deleteMany({})
    await prisma.order.deleteMany({})
    await prisma.cartItem.deleteMany({})
    await prisma.review.deleteMany({})
    await prisma.productFAQ.deleteMany({})
    await prisma.sciencePoint.deleteMany({})
    await prisma.howToUse.deleteMany({})
    await prisma.nutritionFact.deleteMany({})
    await prisma.productFeature.deleteMany({})
    await prisma.productSize.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.address.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})
    
    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@springz.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    console.log(`✅ Created admin user: ${adminEmail}`)
    
    // Create demo customer
    const demoEmail = 'demo@springz.com'
    const hashedDemoPassword = await bcrypt.hash('demo123', 10)
    const demoUser = await prisma.user.create({
      data: {
        name: 'Demo Customer',
        email: demoEmail,
        password: hashedDemoPassword,
        role: 'CUSTOMER',
        phone: '+91 9876543210'
      }
    })
    console.log(`✅ Created demo customer: ${demoEmail}`)
    
    // Create real categories
    const categories = [
      {
        name: 'Premium Plant Proteins',
        slug: 'premium-plant-proteins',
        description: 'High-quality plant-based protein powders for optimal nutrition and muscle building',
        image: '/athletic-person-protein-shake.png'
      },
      {
        name: 'Functional Foods',
        slug: 'functional-foods',
        description: 'Nutritionally enhanced foods that provide health benefits beyond basic nutrition',
        image: '/recovery-blend-ingredients.png'
      },
      {
        name: 'Guilt-Free Snacks',
        slug: 'guilt-free-snacks',
        description: 'Healthy, delicious snacks that satisfy your cravings without compromise',
        image: '/placeholder-wsy0q.png'
      }
    ]
    
    const createdCategories = {}
    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: categoryData
      })
      createdCategories[categoryData.slug] = category
      console.log(`✅ Created category: ${categoryData.name}`)
    }
    
    // Create real products
    const products = [
      // Premium Plant Proteins
      {
        name: 'Elite Protein',
        slug: 'elite-protein',
        description: 'Our flagship premium plant protein blend, specially formulated with a complete amino acid profile. Made from carefully selected plant sources including pea protein, brown rice protein, and hemp protein. Each serving delivers 25g of high-quality protein to support your fitness goals and overall health.',
        shortDescription: 'Premium plant protein blend with complete amino acid profile - 25g protein per serving',
        price: 2499,
        originalPrice: 2999,
        categoryId: createdCategories['premium-plant-proteins'].id,
        images: JSON.stringify([
          '/athletic-person-protein-shake.png',
          '/native-protein-powder.png',
          '/placeholder-wsy0q.png'
        ]),
        servingSize: '30g',
        protein: '25g',
        calories: '110',
        fats: '2.5g',
        carbs: '3g',
        sugar: '1g',
        ingredients: 'Pea Protein Isolate, Brown Rice Protein, Hemp Protein, Natural Flavors, Stevia Extract, Digestive Enzymes (Protease, Amylase, Lactase)',
        tags: JSON.stringify(['plant-based', 'premium', 'complete-protein', 'digestive-enzymes', 'stevia-sweetened']),
        inStock: true,
        featured: true,
        sizes: {
          create: [
            { name: '900g', price: 2499, originalPrice: 2999, available: true },
            { name: '1.8kg', price: 4799, originalPrice: 5599, available: true },
            { name: '450g (Trial)', price: 1399, originalPrice: 1699, available: true }
          ]
        },
        features: {
          create: [
            { 
              icon: 'leaf', 
              label: '100% Plant-Based', 
              description: 'Made from premium plant sources only' 
            },
            { 
              icon: 'shield', 
              label: 'Complete Amino Profile', 
              description: 'All 9 essential amino acids included' 
            },
            { 
              icon: 'check', 
              label: 'Easy Digestion', 
              description: 'Enhanced with digestive enzymes' 
            },
            {
              icon: 'star',
              label: 'Premium Quality',
              description: 'Third-party tested for purity'
            }
          ]
        },
        nutritionFacts: {
          create: [
            { label: 'Serving Size', value: '30g' },
            { label: 'Calories', value: '110' },
            { label: 'Leucine', value: '2.8g' },
            { label: 'Lysine', value: '2.1g' },
            { label: 'Fiber', value: '2g' },
            { label: 'Iron', value: '4.5mg' },
            { label: 'Calcium', value: '120mg' }
          ]
        },
        howToUse: {
          create: [
            { step: 1, instruction: 'Add 1 scoop (30g) to 250-300ml of water, plant milk, or your favorite beverage' },
            { step: 2, instruction: 'Shake vigorously in a shaker bottle or blend for 30-45 seconds' },
            { step: 3, instruction: 'Best consumed within 30 minutes post-workout or as a meal replacement' },
            { step: 4, instruction: 'Can be mixed into smoothies, oatmeal, or baked goods for added protein' }
          ]
        },
        sciencePoints: {
          create: [
            { point: 'Clinically proven protein digestibility score of 95%' },
            { point: 'Optimal leucine content (2.8g) for muscle protein synthesis' },
            { point: 'Enhanced with digestive enzymes for better absorption' },
            { point: 'Sustainable sourcing with minimal environmental impact' }
          ]
        },
        faqs: {
          create: [
            {
              question: 'Is this suitable for vegans?',
              answer: 'Yes, Elite Protein is 100% plant-based and suitable for vegans and vegetarians.'
            },
            {
              question: 'When is the best time to consume this protein?',
              answer: 'For optimal results, consume within 30 minutes after your workout, or as a meal replacement between meals.'
            },
            {
              question: 'Does it contain any allergens?',
              answer: 'This product is free from dairy, soy, and gluten. It is manufactured in a facility that may process nuts.'
            },
            {
              question: 'How does it taste?',
              answer: 'Elite Protein has a smooth, naturally sweet taste thanks to stevia extract. It mixes easily without chalky texture.'
            }
          ]
        }
      },
      {
        name: 'Native Protein Classic',
        slug: 'native-protein-classic',
        description: 'Our classic plant protein formula that started it all. A time-tested blend of pea and rice proteins that provides excellent nutrition for everyday wellness. Perfect for beginners and those seeking a reliable, affordable protein source.',
        shortDescription: 'Classic plant protein blend - reliable nutrition for everyday wellness',
        price: 1999,
        originalPrice: 2399,
        categoryId: createdCategories['premium-plant-proteins'].id,
        images: JSON.stringify([
          '/native-protein-powder.png',
          '/placeholder-wsy0q.png'
        ]),
        servingSize: '32g',
        protein: '22g',
        calories: '120',
        fats: '3g',
        carbs: '4g',
        sugar: '1.5g',
        ingredients: 'Pea Protein, Brown Rice Protein, Natural Vanilla Flavor, Stevia Extract, Sunflower Lecithin',
        tags: JSON.stringify(['plant-based', 'classic', 'affordable', 'beginner-friendly']),
        inStock: true,
        featured: false,
        sizes: {
          create: [
            { name: '1kg', price: 1999, originalPrice: 2399, available: true },
            { name: '500g', price: 1199, originalPrice: 1399, available: true }
          ]
        },
        features: {
          create: [
            { 
              icon: 'heart', 
              label: 'Time-Tested Formula', 
              description: 'Trusted by thousands of customers' 
            },
            { 
              icon: 'dollar-sign', 
              label: 'Great Value', 
              description: 'Premium quality at affordable price' 
            },
            { 
              icon: 'smile', 
              label: 'Beginner Friendly', 
              description: 'Perfect for those new to plant proteins' 
            }
          ]
        },
        nutritionFacts: {
          create: [
            { label: 'Serving Size', value: '32g' },
            { label: 'Calories', value: '120' },
            { label: 'Leucine', value: '2.2g' },
            { label: 'Lysine', value: '1.8g' },
            { label: 'Fiber', value: '1.5g' },
            { label: 'Sodium', value: '180mg' }
          ]
        },
        howToUse: {
          create: [
            { step: 1, instruction: 'Mix 1 scoop (32g) with 250ml of water or plant milk' },
            { step: 2, instruction: 'Shake well and consume post-workout or between meals' },
            { step: 3, instruction: 'Can be used 1-2 times daily as needed' }
          ]
        },
        sciencePoints: {
          create: [
            { point: 'Balanced amino acid profile from pea and rice protein combination' },
            { point: 'Easily digestible plant-based protein sources' },
            { point: 'No artificial colors or preservatives' }
          ]
        },
        faqs: {
          create: [
            {
              question: 'What makes this different from Elite Protein?',
              answer: 'Native Protein Classic is our foundational formula with excellent value, while Elite Protein has enhanced features like digestive enzymes and premium sourcing.'
            },
            {
              question: 'Is it suitable for weight loss?',
              answer: 'Yes, the high protein content helps maintain muscle mass during weight loss and increases satiety.'
            }
          ]
        }
      },
      {
        name: 'Native Protein Chocolate',
        slug: 'native-protein-chocolate',
        description: 'Indulge in the rich, decadent taste of chocolate while fueling your body with premium plant protein. Our chocolate variant combines the same high-quality protein blend with natural cocoa for a delicious treat that supports your fitness goals.',
        shortDescription: 'Rich chocolate flavored plant protein - indulgent taste, premium nutrition',
        price: 2199,
        originalPrice: 2599,
        categoryId: createdCategories['premium-plant-proteins'].id,
        images: JSON.stringify([
          '/native-protein-powder.png',
          '/placeholder-wsy0q.png'
        ]),
        servingSize: '33g',
        protein: '23g',
        calories: '125',
        fats: '3.5g',
        carbs: '5g',
        sugar: '2g',
        ingredients: 'Pea Protein, Brown Rice Protein, Natural Cocoa Powder, Natural Chocolate Flavor, Stevia Extract, Xanthan Gum',
        tags: JSON.stringify(['plant-based', 'chocolate', 'natural-cocoa', 'indulgent']),
        inStock: true,
        featured: true,
        sizes: {
          create: [
            { name: '1kg', price: 2199, originalPrice: 2599, available: true },
            { name: '2kg', price: 4199, originalPrice: 4899, available: true }
          ]
        },
        features: {
          create: [
            { 
              icon: 'coffee', 
              label: 'Real Cocoa', 
              description: 'Made with natural cocoa powder' 
            },
            { 
              icon: 'smile', 
              label: 'Indulgent Taste', 
              description: 'Rich chocolate flavor you will love' 
            },
            { 
              icon: 'zap', 
              label: 'Natural Energy', 
              description: 'Cocoa provides gentle natural energy boost' 
            }
          ]
        },
        nutritionFacts: {
          create: [
            { label: 'Serving Size', value: '33g' },
            { label: 'Calories', value: '125' },
            { label: 'Protein', value: '23g' },
            { label: 'Fats', value: '3.5g' },
            { label: 'Carbs', value: '5g' },
            { label: 'Sugar', value: '2g' }
          ]
        },
        howToUse: {
          create: [
            { step: 1, instruction: 'Mix 1 scoop (33g) with 250-300ml of water or plant milk' },
            { step: 2, instruction: 'Perfect for post-workout recovery or as a healthy dessert alternative' },
            { step: 3, instruction: 'Can be blended with banana and ice for a delicious chocolate smoothie' }
          ]
        },
        sciencePoints: {
          create: [
            { point: 'Natural cocoa provides antioxidants and flavonoids' },
            { point: 'Premium plant protein blend for muscle recovery' },
            { point: 'Low sugar content with natural sweeteners' }
          ]
        },
        faqs: {
          create: [
            {
              question: 'Does it taste like real chocolate?',
              answer: 'Yes! We use natural cocoa powder to give it an authentic, rich chocolate flavor without artificial additives.'
            },
            {
              question: 'Can I use this for baking?',
              answer: 'Absolutely! It\'s perfect for protein pancakes, muffins, and chocolate protein brownies.'
            }
          ]
        }
      },

      // Functional Foods
      {
        name: 'Nuchhi-Nunde',
        slug: 'nuchhi-nunde',
        description: 'A traditional South Indian superfood blend reimagined for modern nutrition. Nuchhi-Nunde combines ancient grains, lentils, and spices in a convenient powder form. Rich in protein, fiber, and essential nutrients, this functional food supports digestive health and provides sustained energy.',
        shortDescription: 'Traditional South Indian superfood blend - ancient nutrition, modern convenience',
        price: 899,
        originalPrice: 1099,
        categoryId: createdCategories['functional-foods'].id,
        images: JSON.stringify([
          '/recovery-blend-ingredients.png',
          '/placeholder-wsy0q.png'
        ]),
        servingSize: '25g',
        protein: '8g',
        calories: '95',
        fats: '2g',
        carbs: '15g',
        sugar: '3g',
        ingredients: 'Finger Millet (Ragi), Black Gram, Green Gram, Rice, Fenugreek Seeds, Turmeric, Asafoetida, Rock Salt',
        tags: JSON.stringify(['traditional', 'south-indian', 'superfood', 'digestive-health', 'ancient-grains']),
        inStock: true,
        featured: true,
        sizes: {
          create: [
            { name: '500g', price: 899, originalPrice: 1099, available: true },
            { name: '1kg', price: 1699, originalPrice: 1999, available: true }
          ]
        },
        features: {
          create: [
            { 
              icon: 'globe', 
              label: 'Traditional Recipe', 
              description: 'Authentic South Indian superfood formula' 
            },
            { 
              icon: 'heart', 
              label: 'Digestive Support', 
              description: 'Promotes healthy digestion naturally' 
            },
            { 
              icon: 'clock', 
              label: 'Sustained Energy', 
              description: 'Complex carbs for lasting energy' 
            }
          ]
        },
        nutritionFacts: {
          create: [
            { label: 'Serving Size', value: '25g' },
            { label: 'Calories', value: '95' },
            { label: 'Dietary Fiber', value: '4g' },
            { label: 'Iron', value: '3.2mg' },
            { label: 'Calcium', value: '85mg' },
            { label: 'Magnesium', value: '45mg' }
          ]
        },
        howToUse: {
          create: [
            { step: 1, instruction: 'Mix 2-3 tablespoons (25g) with warm water or milk' },
            { step: 2, instruction: 'Stir well to avoid lumps, add jaggery or honey if desired' },
            { step: 3, instruction: 'Best consumed in the morning or as an evening snack' },
            { step: 4, instruction: 'Can be made into porridge or added to smoothies' }
          ]
        },
        sciencePoints: {
          create: [
            { point: 'Rich in prebiotics that support gut microbiome health' },
            { point: 'Contains complete proteins from legume and grain combination' },
            { point: 'High in soluble fiber for cholesterol management' },
            { point: 'Ancient grains provide sustained release of energy' }
          ]
        },
        faqs: {
          create: [
            {
              question: 'What is Nuchhi-Nunde?',
              answer: 'Nuchhi-Nunde is a traditional South Indian health food made from roasted grains, lentils, and spices. It\'s been used for generations for its nutritional and digestive benefits.'
            },
            {
              question: 'How does it help with digestion?',
              answer: 'The combination of spices like fenugreek and asafoetida, along with fiber-rich grains, naturally supports healthy digestion and gut health.'
            }
          ]
        }
      },
      {
        name: 'Native Protein Peanut Butter Powder Sweetened',
        slug: 'native-protein-peanut-butter-powder-sweetened',
        description: 'All the delicious taste of peanut butter with added plant protein and reduced fat. Our sweetened peanut butter powder is perfect for smoothies, baking, or making instant peanut butter. Naturally sweetened with stevia for guilt-free indulgence.',
        shortDescription: 'Protein-enhanced peanut butter powder - all the taste, less fat, more protein',
        price: 799,
        originalPrice: 999,
        categoryId: createdCategories['functional-foods'].id,
        images: JSON.stringify([
          '/placeholder-wsy0q.png',
          '/recovery-blend-ingredients.png'
        ]),
        servingSize: '20g',
        protein: '12g',
        calories: '85',
        fats: '3g',
        carbs: '6g',
        sugar: '2g',
        ingredients: 'Peanut Powder (85%), Pea Protein Isolate, Stevia Extract, Natural Peanut Flavor, Sea Salt',
        tags: JSON.stringify(['peanut-butter', 'protein-enhanced', 'low-fat', 'sweetened', 'versatile']),
        inStock: true,
        featured: false,
        sizes: {
          create: [
            { name: '400g', price: 799, originalPrice: 999, available: true },
            { name: '800g', price: 1499, originalPrice: 1799, available: true }
          ]
        },
        features: {
          create: [
            { 
              icon: 'zap', 
              label: 'Protein Boost', 
              description: '12g protein per serving' 
            },
            { 
              icon: 'droplet', 
              label: 'Low Fat', 
              description: '75% less fat than regular peanut butter' 
            },
            { 
              icon: 'chef-hat', 
              label: 'Versatile Use', 
              description: 'Perfect for baking, smoothies, and more' 
            }
          ]
        },
        nutritionFacts: {
          create: [
            { label: 'Serving Size', value: '20g' },
            { label: 'Calories', value: '85' },
            { label: 'Protein', value: '12g' },
            { label: 'Fats', value: '3g' },
            { label: 'Carbs', value: '6g' },
            { label: 'Sodium', value: '150mg' }
          ]
        },
        howToUse: {
          create: [
            { step: 1, instruction: 'Mix 2 tablespoons powder with 1 tablespoon water to make peanut butter spread' },
            { step: 2, instruction: 'Add to smoothies, oatmeal, or yogurt for extra protein and flavor' },
            { step: 3, instruction: 'Use in baking recipes as a healthy ingredient replacement' },
            { step: 4, instruction: 'Perfect for protein pancakes and energy balls' }
          ]
        },
        sciencePoints: {
          create: [
            { point: 'Defatted through natural pressing process to reduce calories' },
            { point: 'Enhanced with plant protein for better nutritional profile' },
            { point: 'Contains healthy peanut nutrients including vitamin E and niacin' },
            { point: 'Natural stevia sweetening without added sugars' }
          ]
        },
        faqs: {
          create: [
            {
              question: 'How do I make peanut butter from this powder?',
              answer: 'Simply mix 2 parts powder with 1 part water and stir until you get your desired consistency. You can add more water for a thinner consistency.'
            },
            {
              question: 'Is this healthier than regular peanut butter?',
              answer: 'Yes, it has 75% less fat and significantly more protein per serving compared to regular peanut butter, making it a healthier choice.'
            }
          ]
        }
      },
      {
        name: 'Native Protein Peanut Butter Powder Hot and Spicy',
        slug: 'native-protein-peanut-butter-powder-hot-spicy',
        description: 'For those who love a kick in their nutrition! Our hot and spicy peanut butter powder combines the protein benefits of our classic formula with a blend of carefully selected spices. Perfect for adding excitement to your protein routine.',
        shortDescription: 'Spicy protein peanut butter powder - heat up your nutrition game',
        price: 849,
        originalPrice: 1049,
        categoryId: createdCategories['functional-foods'].id,
        images: JSON.stringify([
          '/placeholder-wsy0q.png',
          '/recovery-blend-ingredients.png'
        ]),
        servingSize: '20g',
        protein: '12g',
        calories: '88',
        fats: '3.5g',
        carbs: '5g',
        sugar: '1g',
        ingredients: 'Peanut Powder (80%), Pea Protein Isolate, Chili Powder, Paprika, Cumin, Black Pepper, Garlic Powder, Sea Salt',
        tags: JSON.stringify(['peanut-butter', 'spicy', 'protein-enhanced', 'unique-flavor', 'indian-spices']),
        inStock: true,
        featured: false,
        sizes: {
          create: [
            { name: '400g', price: 849, originalPrice: 1049, available: true }
          ]
        },
        features: {
          create: [
            { 
              icon: 'flame', 
              label: 'Spicy Kick', 
              description: 'Perfect blend of heat and flavor' 
            },
            { 
              icon: 'zap', 
              label: 'Metabolism Boost', 
              description: 'Spices may help boost metabolism' 
            },
            { 
              icon: 'star', 
              label: 'Unique Flavor', 
              description: 'One-of-a-kind taste experience' 
            }
          ]
        },
        nutritionFacts: {
          create: [
            { label: 'Serving Size', value: '20g' },
            { label: 'Calories', value: '88' },
            { label: 'Protein', value: '12g' },
            { label: 'Fats', value: '3.5g' },
            { label: 'Carbs', value: '5g' },
            { label: 'Capsaicin', value: '2mg' }
          ]
        },
        howToUse: {
          create: [
            { step: 1, instruction: 'Mix with water to create a spicy peanut butter spread' },
            { step: 2, instruction: 'Add to savory smoothies for a protein and spice boost' },
            { step: 3, instruction: 'Use as a seasoning powder for roasted vegetables or snacks' },
            { step: 4, instruction: 'Perfect for making spicy protein energy balls' }
          ]
        },
        sciencePoints: {
          create: [
            { point: 'Capsaicin from chili may boost metabolism and fat burning' },
            { point: 'Spices provide anti-inflammatory compounds' },
            { point: 'High protein content supports muscle maintenance' },
            { point: 'Unique flavor profile encourages varied nutrition' }
          ]
        },
        faqs: {
          create: [
            {
              question: 'How spicy is this product?',
              answer: 'It has a moderate spice level - flavorful with a gentle heat that most people can enjoy. It\'s not overwhelmingly hot.'
            },
            {
              question: 'Can I use this in sweet recipes?',
              answer: 'While it\'s designed for savory applications, some customers enjoy the unique flavor in spicy-sweet combinations like chocolate chili energy balls.'
            }
          ]
        }
      },

      // Guilt-Free Snacks
      {
        name: 'Kodubale',
        slug: 'kodubale',
        description: 'Traditional South Indian ring-shaped snacks made healthier! Our Kodubale are baked, not fried, and made with wholesome ingredients including lentil flour and aromatic spices. A perfect guilt-free snack that satisfies your cravings while providing good nutrition.',
        shortDescription: 'Healthy South Indian ring snacks - traditional taste, modern nutrition',
        price: 299,
        originalPrice: 399,
        categoryId: createdCategories['guilt-free-snacks'].id,
        images: JSON.stringify([
          '/placeholder-wsy0q.png',
          '/placeholder-te1mw.png'
        ]),
        servingSize: '30g',
        protein: '6g',
        calories: '135',
        fats: '4g',
        carbs: '20g',
        sugar: '1g',
        ingredients: 'Black Gram Flour, Rice Flour, Cumin Seeds, Sesame Seeds, Asafoetida, Turmeric, Curry Leaves, Coconut Oil, Rock Salt',
        tags: JSON.stringify(['south-indian', 'traditional', 'baked', 'lentil-based', 'crunchy']),
        inStock: true,
        featured: true,
        sizes: {
          create: [
            { name: '200g', price: 299, originalPrice: 399, available: true },
            { name: '400g', price: 549, originalPrice: 699, available: true }
          ]
        },
        features: {
          create: [
            { 
              icon: 'heart', 
              label: 'Baked Not Fried', 
              description: 'Healthier cooking method' 
            },
            { 
              icon: 'wheat', 
              label: 'Lentil Based', 
              description: 'Good source of plant protein' 
            },
            { 
              icon: 'clock', 
              label: 'Traditional Recipe', 
              description: 'Authentic South Indian taste' 
            }
          ]
        },
        nutritionFacts: {
          create: [
            { label: 'Serving Size', value: '30g' },
            { label: 'Calories', value: '135' },
            { label: 'Dietary Fiber', value: '3g' },
            { label: 'Iron', value: '2.1mg' },
            { label: 'Folate', value: '45mcg' },
            { label: 'Magnesium', value: '28mg' }
          ]
        },
        howToUse: {
          create: [
            { step: 1, instruction: 'Enjoy straight from the pack as a healthy snack' },
            { step: 2, instruction: 'Perfect with evening tea or coffee' },
            { step: 3, instruction: 'Can be crushed and used as a crunchy topping for salads' },
            { step: 4, instruction: 'Store in airtight container for maximum freshness' }
          ]
        },
        sciencePoints: {
          create: [
            { point: 'High in plant-based protein from black gram flour' },
            { point: 'Rich in dietary fiber for digestive health' },
            { point: 'Contains beneficial spices with anti-inflammatory properties' },
            { point: 'Baked processing retains more nutrients than frying' }
          ]
        },
        faqs: {
          create: [
            {
              question: 'What makes these different from regular kodubale?',
              answer: 'Our kodubale are baked instead of fried, making them lower in unhealthy fats while retaining the authentic taste and adding nutritional benefits.'
            },
            {
              question: 'Are these suitable for kids?',
              answer: 'Yes! They\'re a healthy snack option for children, providing protein and essential nutrients without excessive oil or artificial additives.'
            },
            {
              question: 'How long do they stay fresh?',
              answer: 'When stored in an airtight container, they maintain their crispiness and flavor for up to 3 months.'
            }
          ]
        }
      }
    ]

    // Create products
    for (const productData of products) {
      const product = await prisma.product.create({
        data: productData
      })
      console.log(`✅ Created product: ${productData.name}`)
    }

    // Create sample reviews for real products
    const allProducts = await prisma.product.findMany()
    
    const sampleReviews = [
      {
        productId: allProducts.find(p => p.slug === 'elite-protein')?.id,
        userId: demoUser.id,
        rating: 5,
        title: 'Excellent quality protein!',
        comment: 'This is hands down the best plant protein I have tried. Mixes well, tastes great, and I can feel the difference in my recovery.',
        verified: true
      },
      {
        productId: allProducts.find(p => p.slug === 'elite-protein')?.id,
        userId: adminUser.id,
        rating: 5,
        title: 'Perfect for post-workout',
        comment: 'Love the smooth texture and natural sweetness. No bloating or digestive issues like with other proteins.',
        verified: true
      },
      {
        productId: allProducts.find(p => p.slug === 'nuchhi-nunde')?.id,
        userId: demoUser.id,
        rating: 4,
        title: 'Authentic taste',
        comment: 'Reminds me of my grandmother\'s recipe. Very nutritious and keeps me full for hours.',
        verified: true
      },
      {
        productId: allProducts.find(p => p.slug === 'kodubale')?.id,
        userId: adminUser.id,
        rating: 5,
        title: 'Healthy and delicious!',
        comment: 'Finally, a healthy snack that actually tastes good. My kids love these too!',
        verified: true
      },
      {
        productId: allProducts.find(p => p.slug === 'native-protein-chocolate')?.id,
        userId: demoUser.id,
        rating: 5,
        title: 'Rich chocolate flavor',
        comment: 'Tastes like a real chocolate milkshake. Hard to believe it\'s plant-based!',
        verified: true
      }
    ]

    for (const reviewData of sampleReviews) {
      if (reviewData.productId) {
        await prisma.review.create({
          data: reviewData
        })
      }
    }
    console.log(`✅ Created ${sampleReviews.filter(r => r.productId).length} sample reviews`)
    
    console.log('🎉 Database seeded successfully with real Springz products!')
    console.log('\n📋 Login credentials:')
    console.log(`Admin: ${adminEmail} / ${adminPassword}`)
    console.log(`Demo Customer: ${demoEmail} / demo123`)
    console.log('\n🛍️ Created Categories:')
    categories.forEach(cat => console.log(`- ${cat.name}`))
    console.log('\n📦 Created Real Products:')
    products.forEach(prod => console.log(`- ${prod.name} (₹${prod.price})`))
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()