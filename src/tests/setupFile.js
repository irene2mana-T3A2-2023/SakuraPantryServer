import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { envConfig } from '../configs/env.js';
import User from '../models/UserModel.js';
import Category from '../models/CategoryModel.js';
import Product from '../models/ProductModel.js';

async function feedTestData() {
  await Category.deleteMany({});
  await Category.create([
    {
      _id: '657046215ed01f56e0a4e007',
      name: 'Sauces&Seasonings',
      slug: 'sauces-seasonings'
    },
    {
      _id: '657046215ed01f56e80a4e00',
      name: 'Confectionary&Snacks',
      slug: 'confectionary-snacks'
    },
    {
      _id: '657046215ed01f56e0a4e009',
      name: 'Instant Foods',
      slug: 'instant-foods'
    },
    {
      _id: '657046215ed01f56e0a4e00a',
      name: 'Drinks&Sake',
      slug: 'drinks-sake'
    },
    {
      _id: '657046215ed01f56e0a4e00b',
      name: 'Health Foods',
      slug: 'health-foods'
    }
  ]);
  await Product.deleteMany({});
  await Product.create([
    {
      name: 'Soy Sauce',
      slug: 'soy-sauce',
      description:
        'This is naturally brewed soy sauce with whole soybeans, featuring a delicate aroma and mild flavour. As light Asian dressings and dipping sauces for vegetables and seafood, adding it changes daily diet to extraordinary-like magic.',
      category: '657046215ed01f56e0a4e007',
      stockQuantity: 7,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/1454900/a5e084aa98a809c6c2eed42f9ad2945d.jpg?d=0x0',
      price: 6.1,
      isFeatured: true
    },
    {
      name: 'Sukiyaki Sauce',
      slug: 'sukiyaki-sauce',
      description:
        'This is a ready-to-use sukiyaki sauce produced by Kinryu Foods. This product lets you experience one of the most famous Japanese hot pots at home.',
      category: '657046215ed01f56e0a4e007',
      stockQuantity: 7,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/9032237/8665ac97785ade2d5e8de6341621e2fd.jpg?d=450x0',
      price: 6.1,
      isFeatured: true
    },
    {
      name: 'Dashi Stock Powder',
      slug: 'dashi-stock',
      description:
        "If you're aiming for the delectable taste of seasonal vegetables, we recommend using vegetable soup stock. Free from onion, garlic, celery, carrots, cabbage, and raw animal ingredients.",
      category: '657046215ed01f56e0a4e007',
      stockQuantity: 12,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/1508989/fb207367efcf8fbdbb7c58c5596d7767.jpg?d=450x0',
      price: 22.6,
      isFeatured: true
    },
    {
      name: 'Golden Curry',
      slug: 'curry-roux',
      description:
        'Golden Curry consists of curry powder, flour, spices, and seasonings that can quickly transform mundane stew into fine curry simply by adding them to the mixture.',
      category: '657046215ed01f56e0a4e007',
      stockQuantity: 8,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/347091/bd654943a1366e8b4712e990c3ae4cee.jpg?d=450x0',
      price: 7.0,
      isFeatured: false
    },
    {
      name: 'Wasabi Paste',
      slug: 'wasabi-paste',
      description:
        'A ready-to-use Japanese horseradish paste packed in an easy-to-use plastic tube. Use this product to enjoy a contrast of sharp punch and delicate aroma of authentic Japanese wasabi.',
      category: '657046215ed01f56e0a4e007',
      stockQuantity: 5,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/347136/5f919f0cf31f4d530072c21569abe918.jpg?d=450x0',
      price: 5.38,
      isFeatured: false
    },
    {
      name: 'Miso Paste',
      slug: 'miso-paste',
      description:
        'The miso is made with organic certified soybeans and rice harvested in Japan. It is fermented by a traditional barrel brewing for a whole year without heat sterilizing. This provides extra-rich flavour and a significant umami boost thanks to the enzymes.',
      category: '657046215ed01f56e0a4e007',
      stockQuantity: 5,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/701725/f7ed9fe2737a03d5fe16164c784041de.jpg?d=450x0',
      price: 9.5,
      isFeatured: false
    },
    {
      name: 'Rich Butter Cream Sandwich Biscuits',
      slug: 'sandwich-biscuits',
      description:
        'The cracker-style biscuit is crisp and light, and the cream filling is enough to balance the flavour and texture perfectly. Vitamins such as calcium, vitamin D, vitamin B1, and vitamin B2 are also included in these sandwich biscuits, so they are great for growing children.',
      category: '657046215ed01f56e80a4e00',
      stockQuantity: 15,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/9020216/24974500a0ac12330662e217bb9a6e1b.jpg?d=450x0',
      price: 6.5,
      isFeatured: true
    },
    {
      name: 'Calbee Potato Chips',
      slug: 'calbee-chips',
      description:
        'Calbee Potato Chips is the renowned and top-selling Japanese potato chip, commanding about 70% of the potato chips market share in Japan. Seasoned with salt and two types of seaweed, these thinly sliced chips boast a crispy texture and a delicate mouthfeel.',
      category: '657046215ed01f56e80a4e00',
      stockQuantity: 7,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/85339/05426459e39368bb9d77a8688db39bc0.jpg?d=450x0',
      price: 6.1,
      isFeatured: false
    },
    {
      name: 'Gion Tsuji Toshi Kyoto Matcha Confectionery',
      slug: 'matcha-cracker',
      description:
        'Giono-no-Sato is a renowned matcha confectionery from Gion Tsuji, a long-standing and well-known brand. It features a delicate roasted rice cracker, wrapped in a sweet white cream, and infused with vibrant green matcha.',
      category: '657046215ed01f56e80a4e00',
      stockQuantity: 12,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/9038160/24801d4a4c45b06e1ec9efa94a4704af.jpg?d=450x0',
      price: 18.3,
      isFeatured: false
    },
    {
      name: 'ROYCE Potato Chips',
      slug: 'royce-chips',
      description:
        'The refined caramel flavor intertwines with the fragrance of potato chips. The chips, perfectly crisp on one side, enhance the caramel notes of white chocolate.',
      category: '657046215ed01f56e80a4e00',
      stockQuantity: 12,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/217833/d7083f4e3d4cc7c4367427d8c74a4386.jpg?d=450x0',
      price: 15.4,
      isFeatured: false
    },
    {
      name: 'Assorted Rice Crackers',
      slug: 'rice-crackers',
      description:
        'This rice cracker boasts a melt-in-the-mouth texture, eliminating the need for chewing. Its gentle nature on the stomach makes it suitable for babies starting on solid foods. Utilizing 100% domestic ingredients.',
      category: '657046215ed01f56e80a4e00',
      stockQuantity: 8,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/9027672/761ecb2226ca91a187316edca8be9d58.jpg?d=450x0',
      price: 7.5,
      isFeatured: false
    },
    {
      name: 'Chocolate Pocky Biscuit Sticks',
      slug: 'pocky-sticks',
      description:
        'Pocky stands out as the most popular and renowned Japanese sweet snack, and for good reason! Each Giant Pocky pack contains eight regular-sized packages of Pockys featuring biscuit sticks coated in delicious chocolate-flavoured frosting.',
      category: '657046215ed01f56e80a4e00',
      stockQuantity: 10,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/85387/aa2b51809828ca402392701fbe654940.jpg?d=450x0',
      price: 6.8,
      isFeatured: false
    },
    {
      name: 'Tonkotsu Ramen',
      slug: 'tonkotsu-ramen',
      description:
        'This Ramen features a soup base crafted from pork bone extract, resulting in a rich and cloudy broth infused with a blend of vegetables and spices.',
      category: '657046215ed01f56e0a4e009',
      stockQuantity: 20,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/249487/009fef42b818c0e76a4149baf85469b2.jpg?d=450x0',
      price: 14.8,
      isFeatured: true
    },
    {
      name: 'Curry Noodle',
      slug: 'curry-noodle',
      description:
        'This Curry Flavored Nissin Cup Noodle is BIG! Curry soup has the mild, sweet taste of vegetables, and thick noodles taste richly.',
      category: '657046215ed01f56e0a4e009',
      stockQuantity: 7,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/234472/662ee92765a57c9a5cdcf792c7f9cc0c.jpg?d=450x0',
      price: 6.1,
      isFeatured: false
    },
    {
      name: 'Spinach and Bacon Soup',
      slug: 'bacon-soup',
      description:
        'This is a hearty egg soup brimming with ingredients such as spinach and bacon. Made with spinach sourced from a designated farm and eggs collected within three days from a domestic contracted poultry farm.',
      category: '657046215ed01f56e0a4e009',
      stockQuantity: 8,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/9037362/fb1ebe076353e55831979fbfa01cff27.png?d=450x0',
      price: 7.4,
      isFeatured: true
    },
    {
      name: 'Miso Soup',
      slug: 'miso-soup',
      description:
        'A fusion of two rice miso varieties, featuring the budget-friendly raw miso type.',
      category: '657046215ed01f56e0a4e009',
      stockQuantity: 9,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/249101/38c585343255dfdb8a79fa5770f892ef.jpg?d=450x0',
      price: 7.99,
      isFeatured: false
    },
    {
      name: 'Cheese Pasta Sauce',
      slug: 'pasta-sauce',
      description:
        'Celebrating its 25th anniversary since its 2020 launch, the Blue Cave Series blends black pepper and Parmesan cheese, featuring blue cheese, Pecorino Romano.',
      category: '657046215ed01f56e0a4e009',
      stockQuantity: 5,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/1473860/98b1a3523481db9e0bf1a1703a27182c.jpg?d=450x0',
      price: 7.5,
      isFeatured: true
    },
    {
      name: 'Nissin Yakisoba',
      slug: 'nissin-yakisoba',
      description:
        'An enticing appetite meets the deliciousness of the fragrant dense sauce! Essential ingredients include cabbage and pork infused with blue glue and red ginger.',
      category: '657046215ed01f56e0a4e009',
      stockQuantity: 5,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/199540/c2ed09d5767829cb3f863775e85b0ea5.jpg?d=450x0',
      price: 8.5,
      isFeatured: true
    },
    {
      name: 'Premium Japanese Green Tea',
      slug: 'green-tea',
      description:
        'Indulge in the harmonious fusion of traditional Japanese green tea and Uji Matcha with our Premium Tea Bags Japanese Green Tea with Uji Matcha!',
      category: '657046215ed01f56e0a4e00a',
      stockQuantity: 10,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/194916/9b314e1467ae0f33d37d41aff5101e90.jpg?d=450x0',
      price: 9.9,
      isFeatured: false
    },
    {
      name: 'Matcha Latte',
      slug: 'matcha-latte',
      description:
        'Matcha Milk Tea Latte is made from pure Japanese matcha green tea powder, sourced from fresh tea leaves harvested from the Hokkaido mountains in a new, clean, and safe natural environment.',
      category: '657046215ed01f56e0a4e00a',
      stockQuantity: 10,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/194920/3784713be879ddf842eae473da522287.jpg?d=450x0',
      price: 10.9,
      isFeatured: true
    },
    {
      name: 'Honey Lemon Squash',
      slug: 'lemon-squash',
      description:
        'Enjoy a light and invigorating carbonated beverage crafted with two distinct lemon ingredients enhanced by the addition of honey. Delight in the distinctive gentle sweetness of honey.',
      category: '657046215ed01f56e0a4e00a',
      stockQuantity: 5,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/9039409/8ae494ebe2736d446d90489e1350164b.jpg?d=0x0',
      price: 5.0,
      isFeatured: false
    },
    {
      name: 'Sakura Latte',
      slug: 'sakura-latte',
      description:
        'Relax and make yourself a nice cup of warm or cold sakura-flavoured latte! Each cup of latte you make blends the flavour of cherries and mellow milk.',
      category: '657046215ed01f56e0a4e00a',
      stockQuantity: 5,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/210484/ea8643a899b61ebeb357db5e0218cd51.jpg?d=450x0',
      price: 7.8,
      isFeatured: true
    },
    {
      name: 'Prestigious Junmai Daiginjo Sake',
      slug: 'junmai-sake',
      description:
        'Indulge in this opulent set, a sip beyond the pinnacle of sake, Junmai Daiginjo! Crafted under the expert supervision of a master sake brewer, it offers a truly luxurious experience.',
      category: '657046215ed01f56e0a4e00a',
      stockQuantity: 6,
      imageUrl:
        'https://image.dokodemo.world/skus/7735650/8fc0bc8899047c6454af0357cf4cf752.jpg?d=450x0',
      price: 85.4,
      isFeatured: false
    },
    {
      name: 'Wild Blueberry Infused Black Vinegar',
      slug: 'blueberry-vinegar',
      description:
        'Delicious and easy to drink, you can easily get black vinegar daily. Incorporates elusive wild blueberries and utilizes locally sourced black rice vinegar without any added sweetness.',
      category: '657046215ed01f56e0a4e00a',
      stockQuantity: 5,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/9032220/b5f24c06373e7606daf2c42442793539.jpg?d=450x0',
      price: 14.6,
      isFeatured: false
    },
    {
      name: 'Barley Grass Juice',
      slug: 'barley-juice',
      description:
        'This Barely Grass Juice is made of 100% pure organically grown green barley young leaves. The leaves are carefully processed into powder and they are naturally rich in minerals, vitamins, and fibres.',
      category: '657046215ed01f56e0a4e00b',
      stockQuantity: 12,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/198969/f190479520ee86f85eecc8c278639cc7.jpg?d=450x0',
      price: 32.3,
      isFeatured: true
    },
    {
      name: 'Gummy Drops with Cod Liver Oil and Probiotics',
      slug: 'gummy-drops',
      description:
        'Making vitamin intake enjoyable for kids (or adults!) has never been simpler! These banana-flavored gummies are packed with vitamins A, B2, B6, D, and liver oil.',
      category: '657046215ed01f56e0a4e00b',
      stockQuantity: 10,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/30473/b6d2d40dfb078aeef3432a1838670819.jpg?d=450x0',
      price: 14.1,
      isFeatured: false
    },
    {
      name: 'Placenta Collagen Jelly',
      slug: 'placenta-jelly',
      description:
        'BEAUPOWER Placenta Collagen offers a potent blend with 60,000mg of placenta, 40,000mg of isoflavones in collagen, and a rich infusion of 75 fermented plant extracts per box.',
      category: '657046215ed01f56e0a4e00b',
      stockQuantity: 8,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/61247/aab390a26e079b2b7a51cd9a880e5360.jpg?d=450x0',
      price: 29.6,
      isFeatured: true
    },
    {
      name: 'Aged Black Garlic Supplement',
      slug: 'garlic-supplement',
      description:
        "If you're facing morning fatigue and a lack of energy, consider the remedy found in aged black garlic. Created using a patented method in Aomori Prefecture, this garlic variation promotes endurance and fortitude.",
      category: '657046215ed01f56e0a4e00b',
      stockQuantity: 7,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/57538/a878ddfe9c8016346915330b2a1071b6.jpg?d=450x0',
      price: 27.0,
      isFeatured: false
    },
    {
      name: 'Daily Essential Vitamins Juice',
      slug: 'essential-vitamins',
      description:
        'Containing 13 vitamins aligned with Reference Values, this product is devoid of artificial sweeteners. Infused with a zesty, sweet orange taste, it incorporates orange and mandarin juice for added refreshment.',
      category: '657046215ed01f56e0a4e00b',
      stockQuantity: 9,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/1759018/11ccf0d1baa93a9a90a7db2bdb5f2fbf.jpg?d=450x0',
      price: 14.38,
      isFeatured: false
    },
    {
      name: "Brewer's Yeast Powder",
      slug: 'brewers-yeast',
      description:
        "Elevate your daily meals with the nutritional benefits of Brewer's Yeast Powder. This dietary supplement seamlessly blends into common dishes such as curry, hamburgers, or fried chicken coatings, enriching them with its unique formulation.",
      category: '657046215ed01f56e0a4e00b',
      stockQuantity: 12,
      imageUrl:
        'https://image.dokodemo.world/catalog-skus/10003/a2ac715f8210e0681241947f277e4065.jpeg?d=450x0',
      price: 16.9,
      isFeatured: true
    }
  ]);
}

/**
 * Sets up mock users for testing purposes.
 * This function creates an admin user and a regular user in the database,
 * then generates JWT tokens for each.
 * @returns An object containing JWT tokens for the admin and regular user.
 */
async function setupMockUsers() {
  // Create an admin user with predefined credentials.
  const adminUser = await User.create({
    firstName: 'Lara',
    lastName: 'Macintosh',
    email: 'admin@test.com',
    password: 'password',
    confirmPassword: 'password',
    role: 'admin'
  });

  // Create a regular user with predefined credentials.
  const user = await User.create({
    firstName: 'Chihiro',
    lastName: 'Ogino',
    email: 'user@test.com',
    password: 'password',
    confirmPassword: 'password'
  });

  // Getting ID of mock users
  const userId = user.id;

  // Generate JWT tokens for both users.
  const adminToken = jwt.sign({ userId: adminUser.id }, envConfig.jwtSecret);
  const userToken = jwt.sign({ userId: user.id }, envConfig.jwtSecret);

  return { adminToken, userToken, userId };
}

/**
 * Before all tests, connect to the MongoDB database and set up mock users.
 * The mock user tokens are stored globally for use in tests.
 */
beforeAll(async () => {
  // Connect to MongoDB using the connection string from environment config.
  await mongoose.connect(envConfig.mongo.host);
  await feedTestData();
  // Set up mock users and store their tokens in a global variable for testing.
  global.mockUsers = await setupMockUsers();
});

/**
 * After all tests, clean up by deleting all users and disconnecting from the database.
 */
afterAll(async () => {
  // Delete all users from the database.
  await User.deleteMany({});

  // Disconnect from the MongoDB database.
  await mongoose.disconnect();
});
