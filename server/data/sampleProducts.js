// 10 Diverse, realistic sample products for the Universal Second-Hand Marketplace
// Fictional contact details used for academic demonstration
const sampleProducts = [
  {
    name: "Samsung Galaxy S21 5G (128GB, Phantom Gray, Unlocked)",
    description: "Well-maintained Android smartphone in immaculate condition. 120Hz Dynamic AMOLED display, triple camera with 8K recording. Comes with original box, cable, and Spigen protective case.",
    price: 22500,
    category: "Electronics",
    condition: "Like New",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    sellerName: "Priya Sharma",
    sellerContact: "seller.priya@example.com | +91 98765 00001",
    location: "Bangalore, Indiranagar"
  },
  {
    name: "Modern 3-Seater Fabric Sofa with Washable Cushions",
    description: "Comfortable high-density foam 3-seater sofa in charcoal gray. Solid neem wood frame with removable, machine-washable cushion covers. Selling due to house relocation.",
    price: 12000,
    category: "Furniture",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    sellerName: "Vikram Malhotra",
    sellerContact: "seller.vikram@example.com | +91 98765 00002",
    location: "Mumbai, Andheri West"
  },
  {
    name: "Philips Essential Digital Air Fryer (4.1L, 1400W)",
    description: "Digital touchscreen air fryer with 7 preset cooking modes. Makes crispy fries, roasted veggies, and chicken with 90% less oil. Used only for 4 months, thoroughly cleaned.",
    price: 3800,
    category: "Home and Kitchen",
    condition: "Like New",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80",
    sellerName: "Sunita Roy",
    sellerContact: "seller.sunita@example.com | +91 98765 00003",
    location: "Delhi, Saket"
  },
  {
    name: "Handcrafted Vintage Genuine Leather Messenger Bag",
    description: "Premium full-grain distressed brown leather briefcase with brass buckles. Fits up to 15.6 inch laptops, documents, notebooks, and travel accessories. Naturally water-resistant.",
    price: 1850,
    category: "Fashion",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    sellerName: "Priya Sharma",
    sellerContact: "seller.priya@example.com | +91 98765 00001",
    location: "Bangalore, Indiranagar"
  },
  {
    name: "Classic Literature & Bestseller Books Bundle (Set of 12)",
    description: "Curated collection of 12 acclaimed books including Sapiens, Atomic Habits, To Kill a Mockingbird, and 1984. Clean spines with no markings or torn pages.",
    price: 1400,
    category: "Books and Education",
    condition: "Like New",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    sellerName: "Ananya Deshmukh",
    sellerContact: "seller.ananya@example.com | +91 98765 00004",
    location: "Pune, Koregaon Park"
  },
  {
    name: "Decathlon B'Twin Riverside 120 Hybrid Cycle (Adult Unisex)",
    description: "Sturdy aluminum hybrid bicycle suitable for city commuting and paved trails. 8-speed Microshift gears, front and rear V-brakes, comfortable gel seat, and rear kickstand included.",
    price: 6800,
    category: "Sports and Fitness",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    sellerName: "Karthik Raja",
    sellerContact: "seller.karthik@example.com | +91 98765 00005",
    location: "Chennai, Adyar"
  },
  {
    name: "Steelbird SBA-7 Full Face Motorcycle Helmet (ISI Certified)",
    description: "Size Large (58-60cm) matte black finish helmet with quick-release chin strap, scratch-resistant dual visor, and dynamic airflow ventilation. Sanitized and ready to use.",
    price: 1250,
    category: "Vehicles and Accessories",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    sellerName: "Arun Nair",
    sellerContact: "seller.arun@example.com | +91 98765 00006",
    location: "Hyderabad, Hitec City"
  },
  {
    name: "Chicco Foldable Lightweight Baby Stroller with Multi-Recline",
    description: "Compact travel-friendly stroller with 5-point harness safety, UV50+ canopy, swivel wheels, and spacious under-seat basket. Easily folds with one hand for car storage.",
    price: 3400,
    category: "Toys and Baby Products",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
    sellerName: "Deepa Gupta",
    sellerContact: "seller.deepa@example.com | +91 98765 00007",
    location: "Kolkata, Salt Lake"
  },
  {
    name: "Bosch GSB 120-LI Cordless Impact Driver Drill with Tool Set",
    description: "Professional 12V Li-ion cordless drill kit with 2 rechargeable batteries, charger, and a 45-piece multi-bit masonry/wood/metal drill case. Excellent for home DIY repairs.",
    price: 3950,
    category: "Tools and Equipment",
    condition: "Like New",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    sellerName: "Priya Sharma",
    sellerContact: "seller.priya@example.com | +91 98765 00001",
    location: "Bangalore, Indiranagar"
  },
  {
    name: "Apple MacBook Air M1 (8GB Unified Memory, 256GB SSD, Space Gray)",
    description: "Ultra-thin Apple laptop with M1 silicon chip, Retina display with True Tone, backlit Magic Keyboard, and 15+ hour battery life. 91% battery health. Includes MagSafe charger.",
    price: 49500,
    category: "Electronics",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    sellerName: "Rohan Varma",
    sellerContact: "seller.rohan@example.com | +91 98765 00008",
    location: "Gurgaon, Cyber City"
  }
];

module.exports = sampleProducts;
