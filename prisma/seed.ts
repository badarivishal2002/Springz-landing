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
    
    // Create admin user with full profile
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@springz.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    const adminUser = await prisma.user.create({
      data: {
        name: 'Springz Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        phone: '+91 9876543210',
        dateOfBirth: new Date('1990-01-15'),
        gender: 'male'
      }
    })
    console.log(`✅ Created admin user: ${adminEmail}`)
    
    // Create demo customer with full profile
    const demoEmail = 'demo@springz.com'
    const hashedDemoPassword = await bcrypt.hash('demo123', 10)
    const demoUser = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: demoEmail,
        password: hashedDemoPassword,
        role: 'CUSTOMER',
        phone: '+91 8765432109',
        dateOfBirth: new Date('1995-06-20'),
        gender: 'male'
      }
    })
    console.log(`✅ Created demo customer: ${demoEmail}`)

    // Create additional demo users for testing
    const additionalUsers = [
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: await bcrypt.hash('sarah123', 10),
        role: 'CUSTOMER',
        phone: '+91 7654321098',
        dateOfBirth: new Date('1992-03-10'),
        gender: 'female'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: await bcrypt.hash('mike123', 10),
        role: 'CUSTOMER',
        phone: '+91 6543210987',
        dateOfBirth: new Date('1988-11-25'),
        gender: 'male'
      },
      {
        name: 'Emily Chen',
        email: 'emily@example.com',
        password: await bcrypt.hash('emily123', 10),
        role: 'CUSTOMER',
        phone: '+91 5432109876',
        dateOfBirth: new Date('1997-09-08'),
        gender: 'female'
      }
    ]

    for (const userData of additionalUsers) {
      await prisma.user.create({ data: userData })
      console.log(`✅ Created user: ${userData.email}`)
    }
    
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
          '/elite-protein-main.png',
          '/elite-protein-nutrition.png',
          '/elite-protein-ingredients.png'
        ]),
        servingSize: '30g (1 scoop)',
        protein: '25g',
        calories: '120',
        fats: '2g',
        carbs: '3g',
        sugar: '1g',
        ingredients: 'Pea protein isolate, brown rice protein, hemp protein, natural flavors, stevia extract, digestive enzyme blend (protease, amylase, lipase), vitamin and mineral blend',
        tags: JSON.stringify(['premium', 'plant-based', 'complete-protein', 'digestive-enzymes']),
        inStock: true,
        featured: true
      },
      {
        name: 'Native Protein Classic',
        slug: 'native-protein-classic',
        description: 'Our time-tested plant protein blend that has been a customer favorite for years. Made with a simple, clean formula of pea and rice protein. Perfect for those who want reliable, effective nutrition without unnecessary additives.',
        shortDescription: 'Time-tested pea & rice protein blend - 22g protein per serving',
        price: 1999,
        originalPrice: 2299,
        categoryId: createdCategories['premium-plant-proteins'].id,
        images: JSON.stringify([
          '/native-protein-classic.png',
          '/native-protein-classic-ingredients.png'
        ]),
        servingSize: '30g (1 scoop)',
        protein: '22g',
        calories: '110',
        fats: '1.5g',
        carbs: '4g',
        sugar: '1g',
        ingredients: 'Pea protein isolate, brown rice protein, natural vanilla flavor, stevia extract, sunflower lecithin',
        tags: JSON.stringify(['classic', 'plant-based', 'simple', 'value']),
        inStock: true,
        featured: true
      },
      {
        name: 'Native Protein Chocolate',
        slug: 'native-protein-chocolate',
        description: 'The chocolate lover\'s dream protein powder. Rich, indulgent chocolate flavor made with real cocoa powder, combined with our proven plant protein blend. Enjoy guilt-free chocolate nutrition that actually tastes amazing.',
        shortDescription: 'Rich chocolate with natural cocoa - 23g protein per serving',
        price: 2199,
        originalPrice: 2499,
        categoryId: createdCategories['premium-plant-proteins'].id,
        images: JSON.stringify([
          '/native-protein-chocolate.png',
          '/native-protein-chocolate-shake.png'
        ]),
        servingSize: '32g (1 scoop)',
        protein: '23g',
        calories: '125',
        fats: '2g',
        carbs: '5g',
        sugar: '2g',
        ingredients: 'Pea protein isolate, brown rice protein, cocoa powder, natural chocolate flavor, stevia extract, monk fruit extract, sunflower lecithin',
        tags: JSON.stringify(['chocolate', 'plant-based', 'indulgent', 'cocoa']),
        inStock: true,
        featured: true
      },
      
      // Functional Foods
      {
        name: 'Nuchhi-Nunde',
        slug: 'nuchhi-nunde',
        description: 'Traditional South Indian superfood made from a blend of ancient grains and legumes. This nutritional powerhouse has been consumed for generations and provides sustained energy, plant protein, and essential nutrients. Perfect for those seeking authentic, wholesome nutrition.',
        shortDescription: 'Traditional South Indian superfood - 8g protein per serving',
        price: 899,
        originalPrice: 1099,
        categoryId: createdCategories['functional-foods'].id,
        images: JSON.stringify([
          '/nuchhi-nunde.png',
          '/nuchhi-nunde-ingredients.png'
        ]),
        servingSize: '40g',
        protein: '8g',
        calories: '150',
        fats: '4g',
        carbs: '22g',
        sugar: '3g',
        ingredients: 'Finger millet, pearl millet, sorghum, black gram, green gram, sesame seeds, jaggery powder, cardamom',
        tags: JSON.stringify(['traditional', 'superfood', 'ancient-grains', 'digestive-health']),
        inStock: true,
        featured: false
      },
      {
        name: 'Peanut Butter Powder Sweetened',
        slug: 'peanut-butter-powder-sweetened',
        description: 'All the delicious taste of peanut butter with 75% less fat. Our powdered peanut butter is made from premium roasted peanuts with most of the oil removed. Perfect for smoothies, baking, or mixing into oatmeal for protein-packed nutrition.',
        shortDescription: '75% less fat than regular PB - 12g protein per serving',
        price: 799,
        originalPrice: 999,
        categoryId: createdCategories['functional-foods'].id,
        images: JSON.stringify([
          '/peanut-butter-powder-sweetened.png',
          '/peanut-butter-powder-smoothie.png'
        ]),
        servingSize: '32g (2 tbsp)',
        protein: '12g',
        calories: '70',
        fats: '2g',
        carbs: '8g',
        sugar: '4g',
        ingredients: 'Defatted peanut flour, coconut sugar, salt, natural peanut flavor',
        tags: JSON.stringify(['peanut-butter', 'low-fat', 'protein', 'versatile']),
        inStock: true,
        featured: false
      },
      {
        name: 'Peanut Butter Powder Hot & Spicy',
        slug: 'peanut-butter-powder-hot-spicy',
        description: 'A unique twist on our popular peanut butter powder with a kick of heat. Infused with natural spices that may help boost metabolism while delivering the same great protein content. Perfect for those who like their nutrition with some excitement.',
        shortDescription: 'Unique spicy flavor profile - 12g protein per serving',
        price: 849,
        originalPrice: 1049,
        categoryId: createdCategories['functional-foods'].id,
        images: JSON.stringify([
          '/peanut-butter-powder-spicy.png',
          '/peanut-butter-powder-spicy-recipe.png'
        ]),
        servingSize: '32g (2 tbsp)',
        protein: '12g',
        calories: '75',
        fats: '2g',
        carbs: '7g',
        sugar: '3g',
        ingredients: 'Defatted peanut flour, coconut sugar, chili powder, cayenne pepper, black pepper, salt, natural peanut flavor',
        tags: JSON.stringify(['peanut-butter', 'spicy', 'metabolism-boost', 'unique']),
        inStock: true,
        featured: false
      },
      
      // Guilt-Free Snacks
      {
        name: 'Kodubale',
        slug: 'kodubale',
        description: 'Traditional South Indian ring-shaped snacks made with wholesome ingredients. These crunchy delights are baked, not fried, making them a healthier alternative to conventional snacks. Rich in plant protein and fiber for sustained energy.',
        shortDescription: 'Traditional South Indian ring snacks - 6g protein per serving',
        price: 299,
        originalPrice: 399,
        categoryId: createdCategories['guilt-free-snacks'].id,
        images: JSON.stringify([
          '/kodubale.png',
          '/kodubale-ingredients.png'
        ]),
        servingSize: '30g',
        protein: '6g',
        calories: '120',
        fats: '3g',
        carbs: '18g',
        sugar: '1g',
        ingredients: 'Rice flour, urad dal flour, sesame seeds, cumin seeds, curry leaves, hing (asafoetida), salt, cold-pressed oil',
        tags: JSON.stringify(['traditional', 'baked', 'crunchy', 'snack']),
        inStock: true,
        featured: false
      }
    ]

    // Create products with all related data
    for (const productData of products) {
      const product = await prisma.product.create({
        data: productData
      })
      console.log(`✅ Created product: ${productData.name}`)

      // Add product sizes
      const sizes = [
        { name: '500g', price: productData.price, originalPrice: productData.originalPrice, available: true },
        { name: '1kg', price: Math.round(productData.price * 1.8), originalPrice: productData.originalPrice ? Math.round(productData.originalPrice * 1.8) : null, available: true },
        { name: '2kg', price: Math.round(productData.price * 3.5), originalPrice: productData.originalPrice ? Math.round(productData.originalPrice * 3.5) : null, available: true }
      ]

      for (const sizeData of sizes) {
        await prisma.productSize.create({
          data: {
            ...sizeData,
            productId: product.id
          }
        })
      }

      // Add sample reviews from our demo users
      const reviewsData = [
        {
          userId: demoUser.id,
          rating: 5,
          title: 'Excellent quality!',
          comment: 'Really impressed with the quality and taste. Will definitely order again.',
          verified: true
        },
        {
          userId: adminUser.id,
          rating: 4,
          title: 'Great product',
          comment: 'Good nutritional profile and mixes well. Highly recommended.',
          verified: true
        }
      ]

      for (const reviewData of reviewsData) {
        await prisma.review.create({
          data: {
            ...reviewData,
            productId: product.id
          }
        })
      }
    }

    // Create some sample addresses for demo users
    await prisma.address.create({
      data: {
        userId: demoUser.id,
        type: 'shipping',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main Street',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
        phone: '+91 8765432109',
        isDefault: true
      }
    })

    console.log('✅ Database seeded successfully!')
    console.log('')
    console.log('📦 DEMO ACCOUNTS CREATED:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`🔑 Admin: ${adminEmail} / admin123`)
    console.log(`👤 Customer: ${demoEmail} / demo123`)
    console.log(`👤 Sarah: sarah@example.com / sarah123`)
    console.log(`👤 Mike: mike@example.com / mike123`)
    console.log(`👤 Emily: emily@example.com / emily123`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('🎯 PROFILE SYSTEM TESTING:')
    console.log('✅ All users have complete profile information')
    console.log('✅ Admin can manage all user accounts')
    console.log('✅ Users can view and edit their profiles')
    console.log('✅ Role transfer system ready')
    console.log('')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
