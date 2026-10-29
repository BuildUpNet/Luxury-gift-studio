// Authentic The Gift Studio Data Model

export const STORE_INFO = {
  name: "The Gift Studio",
  tagline: "Buy Premium Gifts & Luxury Hampers Online",
  whatsapp: "+91 7506210892",
  phone: "7506210892",
  email: "support@thegiftstudio.com",
  announcement: "FOR QUERIES PLEASE CALL OR WHATSAPP- 7506210892",
};

export const ORIGINAL_NAV_LINKS = [
  { id: "all", label: "All Hampers" },
  { id: "diwali", label: "Diwali" },
  { id: "celebrity", label: "Celebrity Hampers" },
  { id: "birthdays", label: "Birthdays" },
  { id: "anniversary", label: "Anniversary" },
  { id: "last-minute", label: "Last Minute Gifting" },
  { id: "best-sellers", label: "Best Sellers" },
  { id: "create-own", label: "Create Your Own Hamper", isBuilder: true },
  { id: "corporate", label: "Corporate Gifts" },
  { id: "home-decor", label: "Home Decor" }
];

export const CELEBRITIES = [
  {
    name: "Masaba Gupta",
    role: "Fashion & Lifestyle Icon",
    image: "https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_01.png?v=1784541553&width=800",
    quote: "Gifting is about making someone feel seen and celebrated. Our collection merges quirky elegance with indulgent self-care.",
    highlightHamper: "Self Care Hamper by Masaba",
    price: "₹12,599"
  },
  {
    name: "Anamika Khanna",
    role: "Haute Couture Designer",
    image: "https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna.png?v=1768808499&width=800",
    quote: "The Gift Studio helps you express the extra love and effort for your loved ones with bespoke craftsmanship.",
    highlightHamper: "The Select by Anamika Khanna",
    price: "₹16,999"
  },
  {
    name: "Paresh Maity",
    role: "Acclaimed Master Artist",
    image: "https://thegiftstudio.com/cdn/shop/files/Artful_Indulgence_by_Paresh_Maity_1472899_01.jpg?v=1789036880&width=800",
    quote: "True luxury is art in everyday life. We translated iconic canvas textures into unforgettable gourmet celebration boxes.",
    highlightHamper: "Artful Indulgence by Paresh Maity",
    price: "₹5,999"
  }
];

export const TESTIMONIALS = [
  {
    quote: "Incredible array of hampers and experiences with an assured personal touch.",
    author: "Sonam K. Ahuja",
    location: "Mumbai, India",
    stars: 5
  },
  {
    quote: "The Gift Studio is World Class! Exquisite curation of gourmet and luxury decor.",
    author: "Suhel Seth",
    location: "Mumbai, India",
    stars: 5
  },
  {
    quote: "The Gift Studio helps you express the extra love and effort for your loved ones.",
    author: "Anamika Khanna",
    location: "Mumbai, India",
    stars: 5
  }
];

export const HAMPER_BUILDER_OPTIONS = {
  boxes: [
    { id: "box-1", name: "Mighty Celebration Trunk", price: 2499, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80", desc: "Handcrafted velvet trunk with vintage brass latch" },
    { id: "box-2", name: "The Select Keepsake Box", price: 1799, image: "https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna.png?v=1768808499&width=600", desc: "Sturdy rigid box with embossed floral design" },
    { id: "box-3", name: "Artisanal Handwoven Cane Basket", price: 1299, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80", desc: "Natural willow basket with linen lining" },
    { id: "box-4", name: "Midnight Luxe Gift Chest", price: 2199, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=80", desc: "Minimalist black magnetic closure with satin interior" }
  ],
  items: [
    { id: "item-1", name: "Artisanal Belgian Truffles Box", category: "Chocolates", price: 950, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop&q=80" },
    { id: "item-2", name: "Imported Scented Candle (Vanilla & Oud)", category: "Decor", price: 1250, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&auto=format&fit=crop&q=80" },
    { id: "item-3", name: "Roasted Truffle Almonds & Cashews Jar", category: "Gourmet", price: 850, image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80" },
    { id: "item-4", name: "Sparkling Botanical White Grape Nectar", category: "Beverages", price: 1100, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80" },
    { id: "item-5", name: "Hammered Brass Cocktail Shaker & Tumbler", category: "Barware", price: 1850, image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80" },
    { id: "item-6", name: "Himalayan Pink Salt Dark Chocolate Bar", category: "Chocolates", price: 450, image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&auto=format&fit=crop&q=80" }
  ],
  ribbons: [
    { id: "rib-gold", name: "Champagne Gold Ribbon", hex: "#D4AF37" },
    { id: "rib-crimson", name: "Signature Crimson Ribbon", hex: "#a11414" },
    { id: "rib-emerald", name: "Emerald Silk Ribbon", hex: "#174d38" }
  ]
};

export const PRODUCTS = [
  {
    "id": "prod-1",
    "title": "Oppulent Box",
    "url": "https://thegiftstudio.com/products/oppulent-box",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹13,999",
    "priceNum": 13999,
    "originalPrice": "",
    "rating": 4.67,
    "reviews": 6,
    "image": "https://thegiftstudio.com/cdn/shop/files/Oppulent_Box_1451796_1.png?v=1758016118&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Oppulent_Box_1451796_1.png?v=1758016118&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Oppulent_Box_1451796_2_1.png?v=1768807540&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Oppulent_Box_1451796_3.png?v=1763386307&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Oppulent_Box_1451796_4.png?v=1763386307&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Oppulent_Box_1451796_5.png?v=1763386307&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Oppulent_Box_1451796_6.png?v=1763386307&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_bc343950-2fb6-482f-b1fa-ac5b770f47e2.png?v=1763386307&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-2",
    "title": "The Select By Anamika Khanna",
    "url": "https://thegiftstudio.com/products/the-select-by-anamika-khanna",
    "badge": "Sale 15%",
    "category": "Celebrity Hampers",
    "price": "₹16,999",
    "priceNum": 16999,
    "originalPrice": "",
    "rating": 4.73,
    "reviews": 15,
    "image": "https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna.png?v=1768808499&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna.png?v=1768808499&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna_1460095_2_1.jpg?v=1768808505&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna_1460095_4_1.jpg?v=1768808510&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna_1460095_3_1.jpg?v=1768808515&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna_copy.png?v=1768808516&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna_copy_2.png?v=1768808518&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna_copy_3.png?v=1768808519&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_edeeb60c-fcc0-453a-b170-9ad3916e50e5.png?v=1773226527&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-3",
    "title": "Exquisite Treasures",
    "url": "https://thegiftstudio.com/products/exquisite-treasures",
    "badge": "Sale 20%",
    "category": "Best Sellers",
    "price": "₹12,999",
    "priceNum": 12999,
    "originalPrice": "",
    "rating": 4.25,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/ExquisiteTreasures_1460093_1_5cb462c7-6c69-48e0-8c80-00492112012c.jpg?v=1744103837&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/ExquisiteTreasures_1460093_1_5cb462c7-6c69-48e0-8c80-00492112012c.jpg?v=1744103837&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ExquisiteTreasures_1460093_2.jpg?v=1757391225&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ExquisiteTreasures_1460093_3_44aa49a6-5b8e-496c-8560-622b8e8909f2.jpg?v=1757391225&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c3ecb76d-abb7-4ae8-9a17-e44d2c1aa250.png?v=1768808682&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-4",
    "title": "Self Care Hamper by Masaba",
    "url": "https://thegiftstudio.com/products/self-care-hamper-by-masaba",
    "badge": "Sale 5%",
    "category": "Celebrity Hampers",
    "price": "₹12,599",
    "priceNum": 12599,
    "originalPrice": "",
    "rating": 4.81,
    "reviews": 16,
    "image": "https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_01.png?v=1784541553&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_01.png?v=1784541553&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_02.png?v=1784541554&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_03.png?v=1784541556&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_04.png?v=1784541557&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_05.png?v=1784541560&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_06.png?v=1784541562&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_07.png?v=1784541563&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_ccf9c581-fa51-4f8e-b2e3-8e20f028de54.png?v=1784541630&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-5",
    "title": "Out Doors With Anamika Khanna New",
    "url": "https://thegiftstudio.com/products/out-doors-with-anamika-khanna-new",
    "badge": "",
    "category": "Celebrity Hampers",
    "price": "₹13,699",
    "priceNum": 13699,
    "originalPrice": "",
    "rating": 4.53,
    "reviews": 17,
    "image": "https://thegiftstudio.com/cdn/shop/files/OutDoorswithAnamikaKhannaNew_1457747_1.png?v=1758016661&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/OutDoorswithAnamikaKhannaNew_1457747_1.png?v=1758016661&width=533",
      "https://thegiftstudio.com/cdn/shop/files/OutDoorswithAnamikaKhannaNew_1457747_2.png?v=1774618613&width=533",
      "https://thegiftstudio.com/cdn/shop/files/OutDoorswithAnamikaKhannaNew_1457747_3.png?v=1774618613&width=533",
      "https://thegiftstudio.com/cdn/shop/files/OutDoorswithAnamikaKhannaNew_1457747_4.png?v=1774618613&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_decc787e-902f-47f3-a9df-2630998124dd.png?v=1774618613&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-6",
    "title": "Mighty Celebration Trunk Pink",
    "url": "https://thegiftstudio.com/products/mighty-celebration-trunk-pink",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹7,999",
    "priceNum": 7999,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/Mighty_Celebration_Blush_Pink_8f5577f5-9d67-4bfd-9db4-8b17237e78d9.png?v=1784541609&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Mighty_Celebration_Blush_Pink_8f5577f5-9d67-4bfd-9db4-8b17237e78d9.png?v=1784541609&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Mighty_Celebration_Blush_Pink_2_3c5eff49-d334-49e3-a625-b39f60f855f0.png?v=1784541611&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_65997029-130b-458c-979c-7a9d27a073c8.webp?v=1784541614&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-7",
    "title": "Artful Indulgence By Paresh Maity",
    "url": "https://thegiftstudio.com/products/artful-indulgence-by-paresh-maity",
    "badge": "Sale 28%",
    "category": "Celebrity Hampers",
    "price": "₹5,999",
    "priceNum": 5999,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 7,
    "image": "https://thegiftstudio.com/cdn/shop/files/Artful_Indulgence_by_Paresh_Maity_1472899_01.jpg?v=1789036880&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Artful_Indulgence_by_Paresh_Maity_1472899_01.jpg?v=1789036880&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Artful_Indulgence_by_Paresh_Maity_1472899_03.jpg?v=1789036881&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Artful_Indulgence_by_Paresh_Maity_1472899_04.jpg?v=1789036880&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Artful_Indulgence_by_Paresh_Maity_1472899_05.jpg?v=1789036880&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Artful_Indulgence_by_Paresh_Maity_1472899_02.jpg?v=1789036882&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ArtfulIndulgencebyPareshMaity_1472899_06.png?v=1784541601&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c51a9385-2899-44d7-93f0-3751c93d72f5.webp?v=1784541602&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-8",
    "title": "Mighty Celebration Trunk",
    "url": "https://thegiftstudio.com/products/mighty-celebrationtrunk",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹8,899",
    "priceNum": 8899,
    "originalPrice": "",
    "rating": 4.81,
    "reviews": 16,
    "image": "https://thegiftstudio.com/cdn/shop/files/MightyCelebrationTrunk_14517731.jpg?v=1764938650&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/MightyCelebrationTrunk_14517731.jpg?v=1764938650&width=533",
      "https://thegiftstudio.com/cdn/shop/files/MightyCelebrationTrunk_2.jpg?v=1774614536&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c51a9385-2899-44d7-93f0-3751c93d72f5.webp?v=1784541602&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-9",
    "title": "The Artful Indulgence Hamper By Gr Iranna",
    "url": "https://thegiftstudio.com/products/the-artful-indulgence-hamper-by-gr-iranna",
    "badge": "Sale 13%",
    "category": "Celebrity Hampers",
    "price": "₹28,749",
    "priceNum": 28749,
    "originalPrice": "",
    "rating": 4.7,
    "reviews": 10,
    "image": "https://thegiftstudio.com/cdn/shop/files/TheArtfulIndulgenceHamperbyGRIRANNA_1461810_1.jpg?v=1784541565&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/TheArtfulIndulgenceHamperbyGRIRANNA_1461810_1.jpg?v=1784541565&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheArtfulIndulgenceHamperbyGRIRANNA_1461810_2.jpg?v=1784541566&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheArtfulIndulgenceHamperbyGRIRANNA_1461810_3.jpg?v=1784541567&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheArtfulIndulgenceHamperbyGRIRANNA_1461810_4.jpg?v=1784541568&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheArtfulIndulgenceHamperbyGRIRANNA_1461810_5.png?v=1784541569&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheArtfulIndulgenceHamperbyGRIRANNA_1461810_6.png?v=1784541570&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheArtfulIndulgenceHamperbyGRIRANNA_1461810_7.png?v=1784541571&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_8dcdd153-474e-4566-8d29-9744245c2549.png?v=1784541573&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-10",
    "title": "Savoir Faire",
    "url": "https://thegiftstudio.com/products/savoir-faire",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹12,999",
    "priceNum": 12999,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/Savoir_Faire_1456433_01.png?v=1768807625&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Savoir_Faire_1456433_01.png?v=1768807625&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Savoir_Faire_1456433_02.png?v=1768807626&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Savoir_Faire_1456433_03.png?v=1768807628&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Savoir_Faire_1456433_04.png?v=1768807629&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Savoir_Faire_1456433_05.png?v=1768807631&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Savoir_Faire_1456433_06.png?v=1768807633&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_98c68920-d0d7-4a99-983b-d3a12fd6d52a.png?v=1765371767&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-11",
    "title": "The Luxury Food Trunk",
    "url": "https://thegiftstudio.com/products/the-luxury-food-trunk",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹11,299",
    "priceNum": 11299,
    "originalPrice": "",
    "rating": 4.7,
    "reviews": 10,
    "image": "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_1451774_1.png?v=1758016062&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_1451774_1.png?v=1758016062&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_1451774_2.png?v=1774616713&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_1451774_4.png?v=1774616713&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_1451774_3.png?v=1774616713&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheLuxuryFoodTrunk_1451774_4_e363adf5-d8d2-4e33-8629-2bba2e5bbd05.png?v=1774616713&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_665923ca-8179-4fd2-8752-a77fdeba01b7.png?v=1774616798&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-12",
    "title": "The Grand Box",
    "url": "https://thegiftstudio.com/products/the-grand-box",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹12,999",
    "priceNum": 12999,
    "originalPrice": "",
    "rating": 4.56,
    "reviews": 9,
    "image": "https://thegiftstudio.com/cdn/shop/files/The_Grand_Box_1460094_01_1.png?v=1768807705&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/The_Grand_Box_1460094_01_1.png?v=1768807705&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Grand_Box_1460094_03_1.png?v=1768807710&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Grand_Box_1460094_02_2.png?v=1768807713&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Grand_Box_1460094_04_1.png?v=1768807717&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_fa1a5765-7e55-4512-bff2-0c96f6b39092.png?v=1767096911&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-13",
    "title": "Unvined & Vows",
    "url": "https://thegiftstudio.com/products/unvined-vows",
    "badge": "",
    "category": "Anniversary",
    "price": "₹6,299",
    "priceNum": 6299,
    "originalPrice": "",
    "rating": 4.38,
    "reviews": 8,
    "image": "https://thegiftstudio.com/cdn/shop/files/Unvined_Vows_1456441_1.jpg?v=1744133490&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Unvined_Vows_1456441_1.jpg?v=1744133490&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Unvined_Vows_1456441_2.jpg?v=1744133490&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Unvined_Vows_1456441_3.jpg?v=1744103422&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_1861acc6-f360-4133-a48d-66a567ca09e8.png?v=1750938554&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-14",
    "title": "The Artist Indulgence By Bose Krishnamachari",
    "url": "https://thegiftstudio.com/products/the-artist-indulgence-by-bose-krishnamachari",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹12,299",
    "priceNum": 12299,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 10,
    "image": "https://thegiftstudio.com/cdn/shop/files/TheArtistIndulgencebyBoseKrishnamachari_1460098_1.jpg?v=1744103876&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/TheArtistIndulgencebyBoseKrishnamachari_1460098_1.jpg?v=1744103876&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheArtistIndulgencebyBoseKrishnamachari_1460098_2.jpg?v=1744103878&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheArtistIndulgencebyBoseKrishnamachari_1460098_3.jpg?v=1744103882&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_ebc5906c-d90d-439d-8e09-7a17466771a6.png?v=1750938147&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-15",
    "title": "The Luxury Food Trunk Copy",
    "url": "https://thegiftstudio.com/products/the-luxury-food-trunk-copy",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹11,299",
    "priceNum": 11299,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 2,
    "image": "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_Blush.jpg?v=1768808537&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_Blush.jpg?v=1768808537&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Luxury_Food_trunk_pink.png?v=1774616761&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Luxury_trunk_BLush_pink_2.jpg?v=1774616761&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_Blush_3.jpg?v=1774616761&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_Blush_4.jpg?v=1774616761&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_665923ca-8179-4fd2-8752-a77fdeba01b7.png?v=1774616798&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-16",
    "title": "Guilt Free Indulgence With Ak New",
    "url": "https://thegiftstudio.com/products/guilt-free-indulgence-with-ak-new",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹16,439",
    "priceNum": 16439,
    "originalPrice": "",
    "rating": 4.73,
    "reviews": 22,
    "image": "https://thegiftstudio.com/cdn/shop/files/GuiltFreeIndulgencewithAKNew_1457746_1.png?v=1758016688&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/GuiltFreeIndulgencewithAKNew_1457746_1.png?v=1758016688&width=533",
      "https://thegiftstudio.com/cdn/shop/files/GuiltFreeIndulgencewithAKNew_1457746_2.png?v=1758016689&width=533",
      "https://thegiftstudio.com/cdn/shop/files/GuiltFreeIndulgencewithAKNew_1457746_3.png?v=1758016690&width=533",
      "https://thegiftstudio.com/cdn/shop/files/GuiltFreeIndulgencewithAKNew_1457746_4.png?v=1758016691&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_bc7ee541-a5af-4ffd-8073-55e5148688f4.png?v=1758016692&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-17",
    "title": "The Paresh Maity Hamper 2",
    "url": "https://thegiftstudio.com/products/the-paresh-maity-hamper-2",
    "badge": "",
    "category": "Celebrity Hampers",
    "price": "₹5,499",
    "priceNum": 5499,
    "originalPrice": "",
    "rating": 4.77,
    "reviews": 13,
    "image": "https://thegiftstudio.com/cdn/shop/files/The_Paresh_Maity_Hamper_1456989_1_1.png?v=1784541579&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/The_Paresh_Maity_Hamper_1456989_1_1.png?v=1784541579&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Paresh_Maity_Hamper_1456989_2_1.png?v=1784541580&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Paresh_Maity_Hamper_1456989_3_1.png?v=1784541580&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Paresh_Maity_Hamper_1456989_4_1.png?v=1784541581&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_2400ed2d-4758-4c4f-abad-f7752b607cab.png?v=1784541583&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-18",
    "title": "Festive Ritual",
    "url": "https://thegiftstudio.com/products/diwali-ritual",
    "badge": "Sold out",
    "category": "Diwali",
    "price": "₹6,799",
    "priceNum": 6799,
    "originalPrice": "",
    "rating": 4.67,
    "reviews": 9,
    "image": "https://thegiftstudio.com/cdn/shop/files/DiwaliRitual_14517891_a8376168-e32f-4a8e-a690-e93f009590ab.png?v=1750938788&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/DiwaliRitual_14517891_a8376168-e32f-4a8e-a690-e93f009590ab.png?v=1750938788&width=533",
      "https://thegiftstudio.com/cdn/shop/files/DiwaliRitual_14517892_da682de2-d07e-48a8-8e55-e7449aca509a.png?v=1750938788&width=533",
      "https://thegiftstudio.com/cdn/shop/files/DiwaliRitual_14517893_ea8f8529-df7b-4b3b-a20e-8de526b744b6.png?v=1750938788&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_d77a241d-cc0f-401b-b255-94773f748e54.png?v=1750938788&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-19",
    "title": "Savour The Flavours",
    "url": "https://thegiftstudio.com/products/savour-the-flavours",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹4,999",
    "priceNum": 4999,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 5,
    "image": "https://thegiftstudio.com/cdn/shop/files/Savour_the_flavours_01_1451794_1.jpg?v=1768807339&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Savour_the_flavours_01_1451794_1.jpg?v=1768807339&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Savour_the_flavours_01_1451794_2.jpg?v=1768807340&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Savour_the_flavours_01_1451794_3.jpg?v=1768807341&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Savour_the_flavours_01_1451794_4.jpg?v=1771910836&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Savour_the_flavours_01_1451794_5.jpg?v=1771910836&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Savour_the_flavours_01_1451794_6.jpg?v=1768807345&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_96a16bae-4056-4342-b9d5-a02546c86546.png?v=1765371389&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-20",
    "title": "The Luxury Food Trunk Blue Copy",
    "url": "https://thegiftstudio.com/products/the-luxury-food-trunk-blue-copy",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹11,299",
    "priceNum": 11299,
    "originalPrice": "",
    "rating": 4.0,
    "reviews": 1,
    "image": "https://thegiftstudio.com/cdn/shop/files/The_Luxury_food_Trunk_1.jpg?v=1768808548&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_food_Trunk_1.jpg?v=1768808548&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_2.jpg?v=1774616798&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_trunk_3.jpg?v=1774616798&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_luxury_food_trunk_5.jpg?v=1774616798&width=533",
      "https://thegiftstudio.com/cdn/shop/files/The_Luxury_Food_Trunk_7_beea74a9-4601-4d15-b2f3-2620149208b3.jpg?v=1774616798&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_665923ca-8179-4fd2-8752-a77fdeba01b7.png?v=1774616798&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-21",
    "title": "Cocoa Luxe",
    "url": "https://thegiftstudio.com/products/cocoa-luxe",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹6,599",
    "priceNum": 6599,
    "originalPrice": "",
    "rating": 4.4,
    "reviews": 5,
    "image": "https://thegiftstudio.com/cdn/shop/files/cocoa_luxe_1451761_1.png?v=1768807444&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/cocoa_luxe_1451761_1.png?v=1768807444&width=533",
      "https://thegiftstudio.com/cdn/shop/files/cocoa_luxe_1451761_2.png?v=1768807444&width=533",
      "https://thegiftstudio.com/cdn/shop/files/cocoa_luxe_1451761_3.png?v=1768807446&width=533",
      "https://thegiftstudio.com/cdn/shop/files/cocoa_luxe_1451761_4.png?v=1768807447&width=533",
      "https://thegiftstudio.com/cdn/shop/files/cocoa_luxe_1451761_5.png?v=1768807448&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_8586a587-dc17-4394-8b56-e036810e7ea7.png?v=1762769372&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-22",
    "title": "Festive All Nighter",
    "url": "https://thegiftstudio.com/products/diwali-all-nighter",
    "badge": "Sold out",
    "category": "Diwali",
    "price": "₹12,299",
    "priceNum": 12299,
    "originalPrice": "",
    "rating": 4.43,
    "reviews": 7,
    "image": "https://thegiftstudio.com/cdn/shop/files/DiwaliAllNighter_14517931_adb7b07a-401d-49ae-b7ae-20dbf254dc65.jpg?v=1750938788&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/DiwaliAllNighter_14517931_adb7b07a-401d-49ae-b7ae-20dbf254dc65.jpg?v=1750938788&width=533",
      "https://thegiftstudio.com/cdn/shop/files/DiwaliAllNighter_14517932_5ae87f5e-8a11-4bdc-b077-99b7d69822a0.jpg?v=1750938788&width=533",
      "https://thegiftstudio.com/cdn/shop/files/DiwaliAllNighter_14517933_29a64f09-e0c2-4d3f-bf62-796d1abf4163.jpg?v=1750938788&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_e8664472-dad6-4e02-86db-18651ae8511a.png?v=1750938788&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-23",
    "title": "Tranquil Treats",
    "url": "https://thegiftstudio.com/products/tranquil-treats",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹5,999",
    "priceNum": 5999,
    "originalPrice": "",
    "rating": 4.5,
    "reviews": 6,
    "image": "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_1456444_1.jpg?v=1744103448&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_1456444_1.jpg?v=1744103448&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_1456444_2.jpg?v=1744103449&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TranquilTreats_1456444_3.jpg?v=1744103450&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_fe518983-4a58-4a11-a48a-959e6f4a16f1.png?v=1768808584&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-24",
    "title": "Small Big Things Jungle Lore",
    "url": "https://thegiftstudio.com/products/small-big-things-jungle-lore",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹6,829",
    "priceNum": 6829,
    "originalPrice": "",
    "rating": 4.62,
    "reviews": 8,
    "image": "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_3.49.12_PM_2.jpg?v=1768807534&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_3.49.12_PM_2.jpg?v=1768807534&width=533",
      "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_3.49.12_PM.jpg?v=1768807535&width=533",
      "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_3.49.12_PM_1.jpg?v=1768807536&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_7fe09e35-28e2-4003-9c99-9d3a2a2ccfed.png?v=1766139681&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-25",
    "title": "Tranquil Treats (Pink)",
    "url": "https://thegiftstudio.com/products/tranquil-treats-copy",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹5,999",
    "priceNum": 5999,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_Blush_Pink_1.png?v=1768808575&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_Blush_Pink_1.png?v=1768808575&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_Blush_Pink_4.jpg?v=1768808576&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_Blush_Pink_5.png?v=1768808578&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_fe518983-4a58-4a11-a48a-959e6f4a16f1.png?v=1768808584&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-26",
    "title": "Mighty Celebration Trunk Blue",
    "url": "https://thegiftstudio.com/products/mighty-celebration-trunk-blue",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹9,199",
    "priceNum": 9199,
    "originalPrice": "",
    "rating": 4.89,
    "reviews": 9,
    "image": "https://thegiftstudio.com/cdn/shop/files/Mighty_Celebration_Ash_Blue_1_86f6674f-1ab8-4d8b-912f-a2df63cb4aa7.jpg?v=1784541613&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Mighty_Celebration_Ash_Blue_1_86f6674f-1ab8-4d8b-912f-a2df63cb4aa7.jpg?v=1784541613&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Mighty_Celebration_ashblue_2_a553381c-0962-4163-bcda-8bfdc5b404ec.jpg?v=1784541614&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_65997029-130b-458c-979c-7a9d27a073c8.webp?v=1784541614&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-27",
    "title": "Tranquil Treats (Blue)",
    "url": "https://thegiftstudio.com/products/tranquil-treats-blue",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹5,999",
    "priceNum": 5999,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 1,
    "image": "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_Ash_Blue_1.png?v=1768808580&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_Ash_Blue_1.png?v=1768808580&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_Ash_Blue_2.png?v=1768808582&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Tranquil_Treats_Ash_Blue_3.png?v=1768808583&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_fe518983-4a58-4a11-a48a-959e6f4a16f1.png?v=1768808584&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-28",
    "title": "Exquisite Treasures (Blush)",
    "url": "https://thegiftstudio.com/products/exquisite-treasures-ash-pink",
    "badge": "Sale 20%",
    "category": "Best Sellers",
    "price": "₹12,999",
    "priceNum": 12999,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 1,
    "image": "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_11.38.13_AM.jpg?v=1768808671&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_11.38.13_AM.jpg?v=1768808671&width=533",
      "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_11.38.12_AM.jpg?v=1768808673&width=533",
      "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_11.38.13_AM_1.jpg?v=1768808675&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c3ecb76d-abb7-4ae8-9a17-e44d2c1aa250.png?v=1768808682&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-29",
    "title": "Exquisite Treasures Ash Blue Copy",
    "url": "https://thegiftstudio.com/products/exquisite-treasures-ash-blue-copy",
    "badge": "Sale 20%",
    "category": "Best Sellers",
    "price": "₹12,999",
    "priceNum": 12999,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_3.45.57_PM_1.jpg?v=1768808678&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_3.45.57_PM_1.jpg?v=1768808678&width=533",
      "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_3.45.57_PM.jpg?v=1768808680&width=533",
      "https://thegiftstudio.com/cdn/shop/files/WhatsApp_Image_2025-12-19_at_3.45.58_PM.jpg?v=1768808681&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c3ecb76d-abb7-4ae8-9a17-e44d2c1aa250.png?v=1768808682&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-30",
    "title": "Masaba’s Luxe Indulgence Hamper",
    "url": "https://thegiftstudio.com/products/masaba-s-luxe-indulgence-hamper",
    "badge": "",
    "category": "Celebrity Hampers",
    "price": "₹14,999",
    "priceNum": 14999,
    "originalPrice": "",
    "rating": 4.77,
    "reviews": 13,
    "image": "https://thegiftstudio.com/cdn/shop/files/Masaba_s_Luxe_Indulgence_Hamper_1468376_01_df96645b-1c26-4b4b-92ab-a28977d66b0b.jpg?v=1789044272&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Masaba_s_Luxe_Indulgence_Hamper_1468376_01_df96645b-1c26-4b4b-92ab-a28977d66b0b.jpg?v=1789044272&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Masaba_s_Luxe_Indulgence_Hamper_1468376_02_f6196061-29e0-4998-943d-a782d17eb6af.jpg?v=1789044272&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Masaba_s_Luxe_Indulgence_Hamper_1468376_05_c96d65da-0948-4cce-bb52-10178bbdecff.jpg?v=1789044272&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Masaba_s_Luxe_Indulgence_Hamper_1468376_06_e532c0cb-ee0d-4f7e-a110-e8ead3971fe0.jpg?v=1789044273&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Masaba_s_Luxe_Indulgence_Hamper_1468376_03_ee3e80a6-aaa0-4fbb-bf6a-c3f13fd0942a.jpg?v=1789044272&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Masaba_s_Luxe_Indulgence_Hamper_1468376_04_40674de9-5016-448f-8a0f-1ff1246642f5.jpg?v=1789044272&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Masaba_s_Luxe_Indulgence_Hamper_1468376_07_eedc9049-3d32-4032-8cb7-9d139dcdd3e9.jpg?v=1789044274&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Masaba_s_Luxe_Indulgence_Hamper_1468376_08_2d1e3524-5723-4c18-ad01-b07711a88cad.jpg?v=1789044275&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Masaba_s_Luxe_Indulgence_Hamper_9.png?v=1784541630&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_ccf9c581-fa51-4f8e-b2e3-8e20f028de54.png?v=1784541630&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-31",
    "title": "Playing Cards Valentines Day",
    "url": "https://thegiftstudio.com/products/playing-cards-valentines-day",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,879",
    "priceNum": 2879,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_c73da9e7-1646-4fde-bd29-8538cd591180.jpg?v=1744102376&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_c73da9e7-1646-4fde-bd29-8538cd591180.jpg?v=1744102376&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2.jpg?v=1744102377&width=533",
      "https://thegiftstudio.com/cdn/shop/files/3.jpg?v=1744102377&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-32",
    "title": "Bollywood Jenga",
    "url": "https://thegiftstudio.com/products/bollywood-jenga",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹6,889",
    "priceNum": 6889,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/IMG_45932.jpg?v=1744102362&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/IMG_45932.jpg?v=1744102362&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_4595.jpg?v=1744102363&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_4602.jpg?v=1744102363&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-33",
    "title": "Personalized Monopoly",
    "url": "https://thegiftstudio.com/products/monopoly",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹9,779",
    "priceNum": 9779,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/F0984855-1846-4D99-9559-7AC73769E934.jpg?v=1744102354&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/F0984855-1846-4D99-9559-7AC73769E934.jpg?v=1744102354&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_3071.jpg?v=1744102355&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_3073.jpg?v=1744102356&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_3076.jpg?v=1744102357&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_8249.jpg?v=1744102358&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_8254.jpg?v=1744102359&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_9150.jpg?v=1744102360&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-34",
    "title": "You Me After Dark",
    "url": "https://thegiftstudio.com/products/you-me-after-dark",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,219",
    "priceNum": 3219,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0822.jpg?v=1744102570&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0822.jpg?v=1744102570&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2023-08-1518-35-45_B_R8_S4.jpg?v=1744102571&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0819.jpg?v=1744102572&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0858.jpg?v=1744102572&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-35",
    "title": "You & Me",
    "url": "https://thegiftstudio.com/products/you-me",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,219",
    "priceNum": 3219,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0680.jpg?v=1744102562&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0680.jpg?v=1744102562&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0684.jpg?v=1744102563&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0693.jpg?v=1744102564&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0733.jpg?v=1744102566&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0742.jpg?v=1744102566&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0643.jpg?v=1744102568&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0650.jpg?v=1744102568&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-36",
    "title": "Personalized Monopoly Deal",
    "url": "https://thegiftstudio.com/products/monopoly-deal",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹6,889",
    "priceNum": 6889,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/IMG_0475.jpg?v=1744102342&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/IMG_0475.jpg?v=1744102342&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_9864.jpg?v=1744102343&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_9866.jpg?v=1744102345&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-37",
    "title": "Personalized UNO",
    "url": "https://thegiftstudio.com/products/uno",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹4,589",
    "priceNum": 4589,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/Copyofuno.jpg?v=1744102336&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Copyofuno.jpg?v=1744102336&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_0069.jpg?v=1744102337&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_0699.jpg?v=1744102338&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_8795.jpg?v=1744102340&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_8807.jpg?v=1744102341&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-38",
    "title": "Personalized Playing Cards",
    "url": "https://thegiftstudio.com/products/playing-cards",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,879",
    "priceNum": 2879,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/F68D0FDA-D916-4505-8EAF-740484E83791.jpg?v=1744102332&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/F68D0FDA-D916-4505-8EAF-740484E83791.jpg?v=1744102332&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_0008.jpg?v=1744102333&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_7593.jpg?v=1744102334&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_7602.jpg?v=1744102335&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-39",
    "title": "Jenga Wedding Edition",
    "url": "https://thegiftstudio.com/products/jenga-wedding-edition",
    "badge": "",
    "category": "Anniversary",
    "price": "₹8,039",
    "priceNum": 8039,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_32326dbd-ed09-496c-bdb9-813fca862b46.jpg?v=1744102379&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_32326dbd-ed09-496c-bdb9-813fca862b46.jpg?v=1744102379&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_12b11675-a85d-4fe0-9b34-d12cd884975d.jpg?v=1744102380&width=533",
      "https://thegiftstudio.com/cdn/shop/files/3_bd79f89a-7885-4912-904f-e9d16aeaafb1.jpg?v=1744102381&width=533",
      "https://thegiftstudio.com/cdn/shop/files/4.jpg?v=1744102382&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-40",
    "title": "Marvel Playing Cards",
    "url": "https://thegiftstudio.com/products/marvel-playing-cards",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,879",
    "priceNum": 2879,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/IMG_4675.jpg?v=1744102371&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/IMG_4675.jpg?v=1744102371&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_4680.jpg?v=1744102371&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_4684.jpg?v=1744102373&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_4686.jpg?v=1744102375&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-41",
    "title": "Jenga For Kids",
    "url": "https://thegiftstudio.com/products/jenga-for-kids",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹8,039",
    "priceNum": 8039,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/IMG_4387.jpg?v=1744102368&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/IMG_4387.jpg?v=1744102368&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_43892.jpg?v=1744102369&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-42",
    "title": "Bollywood Heads Up",
    "url": "https://thegiftstudio.com/products/bollywood-heads-up",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹5,739",
    "priceNum": 5739,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/IMG_4834.jpg?v=1744102365&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/IMG_4834.jpg?v=1744102365&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_4838.jpg?v=1744102366&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_4841.jpg?v=1744102367&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-43",
    "title": "Personalized Cards Against...",
    "url": "https://thegiftstudio.com/products/cards-against-humanity",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹7,479",
    "priceNum": 7479,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/CE919EF8-90BC-4972-A3D5-83285B6AE9A7.jpg?v=1744102346&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/CE919EF8-90BC-4972-A3D5-83285B6AE9A7.jpg?v=1744102346&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_8187.jpg?v=1744102347&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_9973.jpg?v=1744102348&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-44",
    "title": "This Or That",
    "url": "https://thegiftstudio.com/products/this-or-that",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,219",
    "priceNum": 3219,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0585.jpg?v=1744102558&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0585.jpg?v=1744102558&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0604.jpg?v=1744102559&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2023-08-1518-27-03_B_R8_S4.jpg?v=1744102560&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0582.jpg?v=1744102562&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-45",
    "title": "Personalized Jenga",
    "url": "https://thegiftstudio.com/products/jenga",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹8,039",
    "priceNum": 8039,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/IMG_9943.jpg?v=1744102349&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/IMG_9943.jpg?v=1744102349&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_6990.jpg?v=1744102350&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_8936.jpg?v=1744102352&width=533",
      "https://thegiftstudio.com/cdn/shop/files/IMG_9840.jpg?v=1744102353&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-46",
    "title": "Personalized Guess Who",
    "url": "https://thegiftstudio.com/products/personalized-snakes-ladders-copy",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹7,479",
    "priceNum": 7479,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/PersonalizedGuessWho_1457598_1_1.jpg?v=1745832801&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/PersonalizedGuessWho_1457598_1_1.jpg?v=1745832801&width=533",
      "https://thegiftstudio.com/cdn/shop/files/PersonalizedGuessWho_1457598_2.jpg?v=1745475290&width=533",
      "https://thegiftstudio.com/cdn/shop/files/PersonalizedGuessWho_1457598_3.jpg?v=1745475290&width=533",
      "https://thegiftstudio.com/cdn/shop/files/PersonalizedGuessWho_1457598_4.jpg?v=1745475290&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-47",
    "title": "Personalized Snakes Ladders",
    "url": "https://thegiftstudio.com/products/personalized-snakes-ladders",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹6,329",
    "priceNum": 6329,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/PersonalizedSnakes_Ladders_1457597_1_1.jpg?v=1745832799&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/PersonalizedSnakes_Ladders_1457597_1_1.jpg?v=1745832799&width=533",
      "https://thegiftstudio.com/cdn/shop/files/PersonalizedSnakes_Ladders_1457597_2.jpg?v=1745475265&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-48",
    "title": "Meme Game Bollywood",
    "url": "https://thegiftstudio.com/products/meme-game-bollywood",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,970",
    "priceNum": 3970,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0718.jpg?v=1744102574&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0718.jpg?v=1744102574&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0698.jpg?v=1744102575&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0700.jpg?v=1744102575&width=533",
      "https://thegiftstudio.com/cdn/shop/files/F_GGames_15thAug2023_0714.jpg?v=1744102577&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-49",
    "title": "Personalized Cluedo",
    "url": "https://thegiftstudio.com/products/personalized-monopoly-deal-copy",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹7,990",
    "priceNum": 7990,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_2.png?v=1771833383&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_2.png?v=1771833383&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_bc865e8f-1327-42f8-bcde-f53e9bed101e.png?v=1771833385&width=533",
      "https://thegiftstudio.com/cdn/shop/files/3_bf25171f-7ee6-40f1-b57c-1de2366f113e.png?v=1771833386&width=533",
      "https://thegiftstudio.com/cdn/shop/files/4_0c63c008-5465-4f59-af50-a2c9c660bd26.png?v=1771833388&width=533",
      "https://thegiftstudio.com/cdn/shop/files/5_5be9396d-c6a4-43ec-993c-0b4162866a62.png?v=1771833389&width=533",
      "https://thegiftstudio.com/cdn/shop/files/6_44a703b7-3df0-4c0a-87e3-c09e6489b42e.png?v=1771833390&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-50",
    "title": "52 Little Things Playing Cards",
    "url": "https://thegiftstudio.com/products/52-little-things-playing-cards",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹1,039",
    "priceNum": 1039,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_1.jpg?v=1771833392&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_1.jpg?v=1771833392&width=533",
      "https://thegiftstudio.com/cdn/shop/files/f020d578-2726-40c4-a202-0a7804b4104c.jpg?v=1771833393&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2f9be255-1719-488e-9c69-a9fe02d11e7d.jpg?v=1771833395&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_29a7f203-9486-471b-b482-3d488882603d.jpg?v=1771833386&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c51a9385-2899-44d7-93f0-3751c93d72f5.webp?v=1784541602&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-51",
    "title": "Cards Against Sanity",
    "url": "https://thegiftstudio.com/products/cards-against-sanity",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹1,899",
    "priceNum": 1899,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/PS01-1_1.jpg?v=1771833394&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/PS01-1_1.jpg?v=1771833394&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_1.jpg?v=1771833407&width=533",
      "https://thegiftstudio.com/cdn/shop/files/PS01-19_1_2ee0a887-ee13-4217-8f20-53b325344236.jpg?v=1771833414&width=533",
      "https://thegiftstudio.com/cdn/shop/files/PS01-16_1_d6613bdc-e85e-47c2-b032-f3efaf20eee5.jpg?v=1771833417&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c51a9385-2899-44d7-93f0-3751c93d72f5.webp?v=1784541602&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-52",
    "title": "The Luxe Love Affair Hamper",
    "url": "https://thegiftstudio.com/products/the-luxe-love-affair-hamper",
    "badge": "Sold out",
    "category": "Anniversary",
    "price": "₹7,499",
    "priceNum": 7499,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/TheLuxeLoveAffairHamper_1472262_1.jpg?v=1768808849&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/TheLuxeLoveAffairHamper_1472262_1.jpg?v=1768808849&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheLuxeLoveAffairHamper_1472262_2.jpg?v=1769669660&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheLuxeLoveAffairHamper_1472262_3.jpg?v=1769669660&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheLuxeLoveAffairHamper_1472262_4.jpg?v=1769669660&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheLuxeLoveAffairHamper_1472262_5.jpg?v=1769669660&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheLuxeLoveAffairHamper_1472262_6.jpg?v=1769669660&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-53",
    "title": "Heartfelt Promises",
    "url": "https://thegiftstudio.com/products/heartfelt-promises",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,999",
    "priceNum": 3999,
    "originalPrice": "",
    "rating": 3.0,
    "reviews": 2,
    "image": "https://thegiftstudio.com/cdn/shop/files/Heartfelt_Promises_1457742_1.png?v=1768807669&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Heartfelt_Promises_1457742_1.png?v=1768807669&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Heartfelt_Promises_1457742_2.png?v=1768807670&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Heartfelt_Promises_1457742_3.png?v=1768807671&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Heartfelt_Promises_1457742_4.png?v=1768807673&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Heartfelt_Promises_1457742_5.png?v=1768807674&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Heartfelt_Promises_1457742_6.png?v=1768807675&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_1a9fb51d-5584-4dcf-9b9f-096a916f118e.png?v=1762779713&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-54",
    "title": "Feel The Love Hamper",
    "url": "https://thegiftstudio.com/products/feel-the-love-hamper",
    "badge": "Sale 27%",
    "category": "Anniversary",
    "price": "₹6,599",
    "priceNum": 6599,
    "originalPrice": "",
    "rating": 4.6,
    "reviews": 5,
    "image": "https://thegiftstudio.com/cdn/shop/files/FeelTheLoveHamper_1472256_1.jpg?v=1768808724&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/FeelTheLoveHamper_1472256_1.jpg?v=1768808724&width=533",
      "https://thegiftstudio.com/cdn/shop/files/FeelTheLoveHamper_1472256_2.jpg?v=1769669608&width=533",
      "https://thegiftstudio.com/cdn/shop/files/FeelTheLoveHamper_1472256_3.jpg?v=1769669608&width=533",
      "https://thegiftstudio.com/cdn/shop/files/FeelTheLoveHamper_1472256_4.jpg?v=1769669608&width=533",
      "https://thegiftstudio.com/cdn/shop/files/FeelTheLoveHamper_1472256_5.jpg?v=1769669608&width=533",
      "https://thegiftstudio.com/cdn/shop/files/FeelTheLoveHamper_1472256_6.jpg?v=1769669608&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-55",
    "title": "You Me Romantic Keepsake Hamper",
    "url": "https://thegiftstudio.com/products/you-me-romantic-keepsake-hamper",
    "badge": "Sold out",
    "category": "Anniversary",
    "price": "₹3,599",
    "priceNum": 3599,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 5,
    "image": "https://thegiftstudio.com/cdn/shop/files/You_MeRomanticKeepsakeHamper_1472255_1_afdfdd9f-29f0-4c7e-abe4-438b12e13e35.jpg?v=1768808703&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/You_MeRomanticKeepsakeHamper_1472255_1_afdfdd9f-29f0-4c7e-abe4-438b12e13e35.jpg?v=1768808703&width=533",
      "https://thegiftstudio.com/cdn/shop/files/You_MeRomanticKeepsakeHamper_1472255_2_e2756b29-3da0-4eae-aee8-bcd62f6e0bcb.jpg?v=1769669227&width=533",
      "https://thegiftstudio.com/cdn/shop/files/You_MeRomanticKeepsakeHamper_1472255_3_e6bc1fce-1f71-49e4-8f41-8f00c866c25e.jpg?v=1769669227&width=533",
      "https://thegiftstudio.com/cdn/shop/files/You_MeRomanticKeepsakeHamper_1472255_4_6b9d178a-8338-4cd2-90d9-efe73f0157fc.jpg?v=1769669227&width=533",
      "https://thegiftstudio.com/cdn/shop/files/You_MeRomanticKeepsakeHamper_1472255_5_22070fcd-dcac-451c-9c61-633b632f2c1f.jpg?v=1769669227&width=533",
      "https://thegiftstudio.com/cdn/shop/files/You_MeRomanticKeepsakeHamper_1472255_6_bf707263-cd0e-4a90-a26b-6cba8d01951a.jpg?v=1769669227&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-56",
    "title": "Seal with Kiss",
    "url": "https://thegiftstudio.com/products/seal-with-kiss",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,699",
    "priceNum": 1699,
    "originalPrice": "",
    "rating": 4.75,
    "reviews": 8,
    "image": "https://thegiftstudio.com/cdn/shop/files/SealwithKiss_1457738_1.jpg?v=1744103603&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/SealwithKiss_1457738_1.jpg?v=1744103603&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SealwithKiss_1457738_2.jpg?v=1744103604&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_ca5e78c4-ca40-4e69-ac97-80ba8de011da.png?v=1750938553&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-57",
    "title": "Love Potion",
    "url": "https://thegiftstudio.com/products/love-potion",
    "badge": "",
    "category": "Anniversary",
    "price": "₹3,499",
    "priceNum": 3499,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 3,
    "image": "https://thegiftstudio.com/cdn/shop/files/LovePotion_1457744_1.jpg?v=1744103619&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/LovePotion_1457744_1.jpg?v=1744103619&width=533",
      "https://thegiftstudio.com/cdn/shop/files/LovePotion_1457744_2.jpg?v=1744103620&width=533",
      "https://thegiftstudio.com/cdn/shop/files/LovePotion_1457744_3.jpg?v=1744103621&width=533",
      "https://thegiftstudio.com/cdn/shop/files/LovePotion_1457744_4.png?v=1750938553&width=533",
      "https://thegiftstudio.com/cdn/shop/files/LovePotion_1457744_5.png?v=1750938553&width=533",
      "https://thegiftstudio.com/cdn/shop/files/LovePotion_1457744_6.png?v=1750938553&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_1de612c2-818a-466d-81a0-572a65d8dc25.png?v=1750938553&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-58",
    "title": "Cuddle Me Teddy Hamper",
    "url": "https://thegiftstudio.com/products/cuddle-me-teddy-hamper",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹3,499",
    "priceNum": 3499,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 5,
    "image": "https://thegiftstudio.com/cdn/shop/files/CuddleMeTeddyHamper_1472260_1.jpg?v=1768808802&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/CuddleMeTeddyHamper_1472260_1.jpg?v=1768808802&width=533",
      "https://thegiftstudio.com/cdn/shop/files/CuddleMeTeddyHamper_1472260_2.jpg?v=1769669413&width=533",
      "https://thegiftstudio.com/cdn/shop/files/CuddleMeTeddyHamper_1472260_3.jpg?v=1769669413&width=533",
      "https://thegiftstudio.com/cdn/shop/files/CuddleMeTeddyHamper_1472260_4.jpg?v=1769669413&width=533",
      "https://thegiftstudio.com/cdn/shop/files/CuddleMeTeddyHamper_1472260_5.jpg?v=1769669413&width=533",
      "https://thegiftstudio.com/cdn/shop/files/CuddleMeTeddyHamper_1472260_6.jpg?v=1769669413&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-59",
    "title": "Sunset Savories",
    "url": "https://thegiftstudio.com/products/sunset-savories",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹5,299",
    "priceNum": 5299,
    "originalPrice": "",
    "rating": 3.75,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/SunsetSavories_1456431_1.jpg?v=1784541605&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/SunsetSavories_1456431_1.jpg?v=1784541605&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SunsetSavories_1456431_2.jpg?v=1784541605&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SunsetSavories_1456431_3.jpg?v=1784541607&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Sunset_Savories_1456431_1.jpg?v=1784541607&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_648b21ed-eb70-40c9-bb4f-10e2074429f9.png?v=1784541609&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-60",
    "title": "XOXO Treats",
    "url": "https://thegiftstudio.com/products/xoxo-treats",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹5,749",
    "priceNum": 5749,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 5,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_fc633ccc-af1d-49c6-9c56-179b6ef3b1c4.jpg?v=1771833198&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_fc633ccc-af1d-49c6-9c56-179b6ef3b1c4.jpg?v=1771833198&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_a669fc55-863c-4735-ba7d-396efd7b0886.jpg?v=1771833200&width=533",
      "https://thegiftstudio.com/cdn/shop/files/3_7947847d-1391-42cf-8d43-9f097d0222d2.jpg?v=1771833202&width=533",
      "https://thegiftstudio.com/cdn/shop/files/4_75c2982f-4cbf-4a65-94b0-b676857dd6e7.jpg?v=1771833204&width=533",
      "https://thegiftstudio.com/cdn/shop/files/5_6b0a3e49-056b-4cb4-a78c-8b6806396ee0.jpg?v=1771833206&width=533",
      "https://thegiftstudio.com/cdn/shop/files/6_8eab281d-c731-4953-8047-d7584e774ebd.jpg?v=1771833207&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_65997029-130b-458c-979c-7a9d27a073c8.webp?v=1784541614&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-61",
    "title": "The Wild Indulgence Hamper",
    "url": "https://thegiftstudio.com/products/the-wild-indulgence-hamper",
    "badge": "Sale 28%",
    "category": "Best Sellers",
    "price": "₹4,999",
    "priceNum": 4999,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 3,
    "image": "https://thegiftstudio.com/cdn/shop/files/TheWildIndulgenceHamper_1472901_01.png?v=1771833611&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/TheWildIndulgenceHamper_1472901_01.png?v=1771833611&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheWildIndulgenceHamper_1472901_02.png?v=1771833616&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheWildIndulgenceHamper_1472901_03.png?v=1771833620&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheWildIndulgenceHamper_1472901_04.png?v=1771833624&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheWildIndulgenceHamper_1472901_05.png?v=1771833627&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheWildIndulgenceHamper_1472901_06.png?v=1771833631&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c51a9385-2899-44d7-93f0-3751c93d72f5.webp?v=1784541602&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-62",
    "title": "Grooming Essential Hamper For Men",
    "url": "https://thegiftstudio.com/products/grooming-essential-hamper-for-men",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹6,999",
    "priceNum": 6999,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/GroomingEssentialHamperforMen_1472911_01.png?v=1771833409&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/GroomingEssentialHamperforMen_1472911_01.png?v=1771833409&width=533",
      "https://thegiftstudio.com/cdn/shop/files/GroomingEssentialHamperforMen_1472911_02.png?v=1771833411&width=533",
      "https://thegiftstudio.com/cdn/shop/files/GroomingEssentialHamperforMen_1472911_03.png?v=1771833412&width=533",
      "https://thegiftstudio.com/cdn/shop/files/GroomingEssentialHamperforMen_1472911_04.png?v=1771833413&width=533",
      "https://thegiftstudio.com/cdn/shop/files/GroomingEssentialHamperforMen_1472911_05.png?v=1771833415&width=533",
      "https://thegiftstudio.com/cdn/shop/files/GroomingEssentialHamperforMen_1472911_06.png?v=1771833417&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c51a9385-2899-44d7-93f0-3751c93d72f5.webp?v=1784541602&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-63",
    "title": "Giant Love Themed Balloon",
    "url": "https://thegiftstudio.com/products/giant-love-themed-balloon",
    "badge": "",
    "category": "Anniversary",
    "price": "₹2,799",
    "priceNum": 2799,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-64",
    "title": "Caffeine Addicts (Blush)",
    "url": "https://thegiftstudio.com/products/caffeine-addicts-blush",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,299",
    "priceNum": 3299,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_09474fbe-4184-4bc9-b884-55ac1bfc610f.png?v=1782125416&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_09474fbe-4184-4bc9-b884-55ac1bfc610f.png?v=1782125416&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_508131c8-f7ae-44c8-9ccc-057a43eaf002.png?v=1782125417&width=533",
      "https://thegiftstudio.com/cdn/shop/files/3_17_square_1200x1200_nocompress.png?v=1782125419&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ChatGPT_Image_Jun_1_2026_05_47_50_PM.png?v=1782125421&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-65",
    "title": "Sunset Savories For International Shipping Exclusive Global Delivery",
    "url": "https://thegiftstudio.com/products/sunset-savories-for-international-shipping-exclusive-global-delivery",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹9,999",
    "priceNum": 9999,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/SunsetSavories_1456431_2.jpg?v=1784541605&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/SunsetSavories_1456431_2.jpg?v=1784541605&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SunsetSavories_1456431_3.jpg?v=1784541607&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SunsetSavories_1456431_1.jpg?v=1784541605&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_648b21ed-eb70-40c9-bb4f-10e2074429f9.png?v=1784541609&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-66",
    "title": "Chocoholic (Mughal)",
    "url": "https://thegiftstudio.com/products/chocoholic-mughal",
    "badge": "",
    "category": "Home Decor",
    "price": "₹4,299",
    "priceNum": 4299,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_773ca717-bc63-4c37-a387-38ef46088b38.png?v=1782125425&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_773ca717-bc63-4c37-a387-38ef46088b38.png?v=1782125425&width=533",
      "https://thegiftstudio.com/cdn/shop/files/hamper_square_1200x1200_bright.png?v=1782125427&width=533",
      "https://thegiftstudio.com/cdn/shop/files/3_7a3e48e7-8a2c-4d55-ac38-5f9aca0f47d7.png?v=1782125429&width=533",
      "https://thegiftstudio.com/cdn/shop/files/4_60c671d5-6ab9-4b86-aee1-00b98e443244.png?v=1782125431&width=533",
      "https://thegiftstudio.com/cdn/shop/files/5_9ea91396-7741-4b85-b2d2-82b6eda522d7.png?v=1782125432&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-67",
    "title": "The Tray Of Six Senses Mint",
    "url": "https://thegiftstudio.com/products/the-tray-of-six-senses-mint",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,289",
    "priceNum": 2289,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/TheTrayofSixSenses_1451770_M_1.png?v=1782124998&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/TheTrayofSixSenses_1451770_M_1.png?v=1782124998&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheTrayofSixSenses_1451770_M_2.png?v=1782124999&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheTrayofSixSenses_1451770_M_3_1.png?v=1782125002&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheTrayofSixSenses_1451770_M_4.png?v=1782125004&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheTrayofSixSenses_1451770_M_5.png?v=1782125005&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TheTrayofSixSenses_1451770_M_6.webp?v=1782125006&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TGSBRAND.jpg?v=1782125005&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-68",
    "title": "Coffee Crunch Hamper",
    "url": "https://thegiftstudio.com/products/coffee-crunch-hamper",
    "badge": "Sale 23%",
    "category": "Best Sellers",
    "price": "₹3,799",
    "priceNum": 3799,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 7,
    "image": "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_01.png?v=1771833509&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_01.png?v=1771833509&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_02.png?v=1771833513&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_03.png?v=1771833520&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_04.png?v=1771833524&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_05.png?v=1771833528&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_06.png?v=1771833533&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c51a9385-2899-44d7-93f0-3751c93d72f5.webp?v=1784541602&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-69",
    "title": "Coffee Cookie Bag A",
    "url": "https://thegiftstudio.com/products/coffee-cookie-bag-a",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,709",
    "priceNum": 1709,
    "originalPrice": "",
    "rating": 4.67,
    "reviews": 3,
    "image": "https://thegiftstudio.com/cdn/shop/files/Coffeecookiebag-1451787_R_1.png?v=1782124983&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Coffeecookiebag-1451787_R_1.png?v=1782124983&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffeecookiebag-1451787_R_2.png?v=1782124985&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffeecookiebag-1451787_R_3.png?v=1782124986&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffeecookiebag-1451787_R_4.png?v=1782124988&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TGSBRAND.jpg?v=1782125005&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-70",
    "title": "Coffee Crunch Hamper Mint",
    "url": "https://thegiftstudio.com/products/coffee-crunch-hamper-mint",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,799",
    "priceNum": 3799,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 1,
    "image": "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_M_1.png?v=1782124972&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_M_1.png?v=1782124972&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_M_2.png?v=1782124973&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_M_3.png?v=1782124975&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_M_4.png?v=1782124977&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_M_5.png?v=1782124979&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_M_6.png?v=1782124980&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TGSBRAND.jpg?v=1782125005&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-71",
    "title": "Coffee Crunch Hamper Red",
    "url": "https://thegiftstudio.com/products/coffee-crunch-hamper-red",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,799",
    "priceNum": 3799,
    "originalPrice": "",
    "rating": 4.5,
    "reviews": 2,
    "image": "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_R_1.png?v=1782124950&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_R_1.png?v=1782124950&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_R_2.png?v=1782124952&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_R_3.png?v=1782124953&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_R_4.png?v=1782124955&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_R_5.png?v=1782124956&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_R_6.png?v=1782124958&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TGSBRAND.jpg?v=1782125005&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-72",
    "title": "Coffee Cookie Bag B",
    "url": "https://thegiftstudio.com/products/coffee-cookie-bag-b",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹1,709",
    "priceNum": 1709,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 1,
    "image": "https://thegiftstudio.com/cdn/shop/files/Coffeecookiebag-1451787_B_1.png?v=1782124991&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Coffeecookiebag-1451787_B_1.png?v=1782124991&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffeecookiebag-1451787_B_2.png?v=1782124993&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffeecookiebag-1451787_B_3.png?v=1782124994&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffeecookiebag-1451787_B_4.jpg?v=1782124995&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TGSBRAND.jpg?v=1782125005&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-73",
    "title": "Caffeine Addicts (Bento)",
    "url": "https://thegiftstudio.com/products/caffeine-addicts-_bento",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,609",
    "priceNum": 3609,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 1,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_43a0004c-b365-4194-9358-0147201d8d23.png?v=1782125392&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_43a0004c-b365-4194-9358-0147201d8d23.png?v=1782125392&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_932df53e-b48a-439b-8709-614e6b5a7cd9.png?v=1782125394&width=533",
      "https://thegiftstudio.com/cdn/shop/files/3_472afbae-d9bc-4dc6-bc35-e4d3a33ad4b7.png?v=1782125395&width=533",
      "https://thegiftstudio.com/cdn/shop/files/4_55da24cc-0be8-4c6d-8975-4fe70474236b.png?v=1782125397&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TGSBRAND_bc4ef7d7-98c6-4305-8848-30d7bead9626.jpg?v=1782125442&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-74",
    "title": "Coffee Crunch Hamper Yellow",
    "url": "https://thegiftstudio.com/products/coffee-crunch-hamper-yellow",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,799",
    "priceNum": 3799,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_Y_1.png?v=1782124960&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_Y_1.png?v=1782124960&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_Y_2.png?v=1782124962&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_Y_3.png?v=1782124965&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_Y_4.png?v=1782124965&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_Y_5.png?v=1782124967&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Coffee_CrunchHamper_1472897_Y_6.png?v=1782124968&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TGSBRAND.jpg?v=1782125005&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-75",
    "title": "Caffeine Addicts (Mughal)",
    "url": "https://thegiftstudio.com/products/caffeine-addicts_mughal",
    "badge": "",
    "category": "Home Decor",
    "price": "₹3,499",
    "priceNum": 3499,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/2_3e9a8af9-cce4-4494-992f-3d38ca71f79a.png?v=1782125400&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/2_3e9a8af9-cce4-4494-992f-3d38ca71f79a.png?v=1782125400&width=533",
      "https://thegiftstudio.com/cdn/shop/files/3_1e7582c2-0254-4c5c-b03c-aeff038e1ec9.png?v=1782125402&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TGSBRAND_bc4ef7d7-98c6-4305-8848-30d7bead9626.jpg?v=1782125442&width=533",
      "https://thegiftstudio.com/cdn/shop/files/4_b7221018-1e5d-4b06-95e9-23f82b7eff03.png?v=1782125405&width=533",
      "https://thegiftstudio.com/cdn/shop/files/gift_hamper_1200x1200_square_nocompress.png?v=1782125406&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-76",
    "title": "Caffeine Addicts Jungle Lore",
    "url": "https://thegiftstudio.com/products/caffeine-addicts-jungle-lore",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹3,609",
    "priceNum": 3609,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1-Copy.png?v=1782125408&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1-Copy.png?v=1782125408&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2-Copy.png?v=1782125410&width=533",
      "https://thegiftstudio.com/cdn/shop/files/3-Copy.png?v=1782125412&width=533",
      "https://thegiftstudio.com/cdn/shop/files/4-Copy.png?v=1782125414&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-77",
    "title": "Chocoholic (Junglelore)",
    "url": "https://thegiftstudio.com/products/chocoholic-junglelore",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹4,479",
    "priceNum": 4479,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_60850ff3-ca66-40a0-93b1-c331cb02f893.png?v=1782125435&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_60850ff3-ca66-40a0-93b1-c331cb02f893.png?v=1782125435&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_cf7a156e-111d-42f3-a2e3-bf8773ff567d.png?v=1782125437&width=533",
      "https://thegiftstudio.com/cdn/shop/files/3_d47dd8b0-c002-4bd5-821b-7a334a2bbad8.png?v=1782125439&width=533",
      "https://thegiftstudio.com/cdn/shop/files/4_25233bb3-0e23-4999-b95a-e6f69836cb91.png?v=1782125441&width=533",
      "https://thegiftstudio.com/cdn/shop/files/5_1392681e-bd88-4537-a4cb-b77c1f08a79a.png?v=1782125443&width=533",
      "https://thegiftstudio.com/cdn/shop/files/TGSBRAND_bc4ef7d7-98c6-4305-8848-30d7bead9626.jpg?v=1782125442&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-78",
    "title": "Climbers Earrings",
    "url": "https://thegiftstudio.com/products/climbers-earrings",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,499",
    "priceNum": 2499,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/ProductShoot51575.jpg?v=1744102779&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51575.jpg?v=1744102779&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51534.jpg?v=1744102780&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52408.jpg?v=1744102780&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52412.jpg?v=1744102782&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-79",
    "title": "Zirconia Ash Earrings",
    "url": "https://thegiftstudio.com/products/zirconia-ash-earrings",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,499",
    "priceNum": 2499,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_490a45ea-414c-4c69-9bde-5de29b7b4a45.jpg?v=1744102791&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_490a45ea-414c-4c69-9bde-5de29b7b4a45.jpg?v=1744102791&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_9811ddb2-ef70-4634-97ad-9ae57840fd54.jpg?v=1744102792&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52437.jpg?v=1744102792&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52442.jpg?v=1744102794&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-80",
    "title": "Zircon Balis",
    "url": "https://thegiftstudio.com/products/zircon-balis",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,749",
    "priceNum": 1749,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/11.jpg?v=1744102787&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/11.jpg?v=1744102787&width=533",
      "https://thegiftstudio.com/cdn/shop/files/156.jpg?v=1744102788&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52193.jpg?v=1744102789&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52198.jpg?v=1744102790&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-81",
    "title": "Allure Earrings",
    "url": "https://thegiftstudio.com/products/allure-earrings",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,999",
    "priceNum": 1999,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_426d21e0-e0e9-410b-85f6-5f24576c420c.jpg?v=1744102758&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_426d21e0-e0e9-410b-85f6-5f24576c420c.jpg?v=1744102758&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_8d6348db-23ca-44bf-bbeb-a09730b7b897.jpg?v=1744102759&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52071.jpg?v=1744102760&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52074.jpg?v=1744102761&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-82",
    "title": "Iris Studs",
    "url": "https://thegiftstudio.com/products/iris-studs",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,249",
    "priceNum": 1249,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/ProductShoot53676.jpg?v=1744102762&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot53676.jpg?v=1744102762&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot53561.jpg?v=1744102763&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52044.jpg?v=1744102764&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52049.jpg?v=1744102766&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-83",
    "title": "Mirabel Earrings",
    "url": "https://thegiftstudio.com/products/mirabel-earrings",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,299",
    "priceNum": 3299,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_10040fce-fb28-4434-9530-95569b210253.jpg?v=1744102795&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_10040fce-fb28-4434-9530-95569b210253.jpg?v=1744102795&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_53588647-563d-4ea6-8c92-71b548f8756d.jpg?v=1744102796&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52326.jpg?v=1744102797&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52335.jpg?v=1744102798&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-84",
    "title": "Better Together Earrings",
    "url": "https://thegiftstudio.com/products/better-together-earrings",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,799",
    "priceNum": 2799,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/ProductShoot51588.jpg?v=1744102783&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51588.jpg?v=1744102783&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51448.jpg?v=1744102784&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52475.jpg?v=1744102784&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52485.jpg?v=1744102785&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-85",
    "title": "Orb Earrings Earrings",
    "url": "https://thegiftstudio.com/products/orb-earrings-earrings",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,299",
    "priceNum": 3299,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/ProductShoot51629.jpg?v=1744102767&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51629.jpg?v=1744102767&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51404.jpg?v=1744102768&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52309.jpg?v=1744102769&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52319.jpg?v=1744102770&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-86",
    "title": "Lucy Earrings",
    "url": "https://thegiftstudio.com/products/lucy-earrings",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,799",
    "priceNum": 1799,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/ProductShoot51580.jpg?v=1744102750&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51580.jpg?v=1744102750&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51541.jpg?v=1744102751&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52375.jpg?v=1744102752&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52368.jpg?v=1744102753&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-87",
    "title": "Graced Shimmer Earrings",
    "url": "https://thegiftstudio.com/products/graced-shimmer-earrings",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹4,299",
    "priceNum": 4299,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/ProductShoot51583.jpg?v=1744102775&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51583.jpg?v=1744102775&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51552.jpg?v=1744102776&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52279.jpg?v=1744102777&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52272.jpg?v=1744102778&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-88",
    "title": "Roots Earrings",
    "url": "https://thegiftstudio.com/products/roots-earrings",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹3,799",
    "priceNum": 3799,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1_f98b4b9e-37b8-40d8-8f67-0343a7100905.jpg?v=1744102771&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1_f98b4b9e-37b8-40d8-8f67-0343a7100905.jpg?v=1744102771&width=533",
      "https://thegiftstudio.com/cdn/shop/files/2_fc001153-c218-4527-9756-24bed771d7bd.jpg?v=1744102772&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52082.jpg?v=1744102773&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52085.jpg?v=1744102774&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-89",
    "title": "Equinox Earrings",
    "url": "https://thegiftstudio.com/products/equinox-earrings",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,799",
    "priceNum": 1799,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/ProductShoot51650.jpg?v=1744102754&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51650.jpg?v=1744102754&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ProductShoot51435.jpg?v=1744102755&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52232.jpg?v=1744102756&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Modelshoot52237.jpg?v=1744102757&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-90",
    "title": "Resin Photo Frame With Mop Inlay",
    "url": "https://thegiftstudio.com/products/resin-photo-frame-with-mop-inlay",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,299",
    "priceNum": 1299,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1418888_ResinPhotoFramewithMOPInlay_1.jpg?v=1791368554&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1418888_ResinPhotoFramewithMOPInlay_1.jpg?v=1791368554&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1418888_ResinPhotoFramewithMOPInlay_2.jpg?v=1791368554&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-91",
    "title": "Floral Petal T Lite Holder",
    "url": "https://thegiftstudio.com/products/floral-petal-t-lite-holder",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹699",
    "priceNum": 699,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1418887_FloralPetalT-LiteHolder_1.jpg?v=1791368797&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1418887_FloralPetalT-LiteHolder_1.jpg?v=1791368797&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1418887_FloralPetalT-LiteHolder_2.jpg?v=1791368796&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1418887_FloralPetalT-LiteHolder_3.jpg?v=1791368795&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-92",
    "title": "Marble Cheeseboard Set With Blue Lapis Inlay",
    "url": "https://thegiftstudio.com/products/marble-cheeseboard-set-with-blue-lapis-inlay",
    "badge": "",
    "category": "Corporate Gifts",
    "price": "₹2,799",
    "priceNum": 2799,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/1481256_MarbleCheeseboardsetwithBlueLapisInlay_1.jpg?v=1791368950&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1481256_MarbleCheeseboardsetwithBlueLapisInlay_1.jpg?v=1791368950&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1481256_MarbleCheeseboardsetwithBlueLapisInlay_2.jpg?v=1791368947&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1481256_MarbleCheeseboardsetwithBlueLapisInlay_3.jpg?v=1791368944&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1481256_MarbleCheeseboardsetwithBlueLapisInlay_4.jpg?v=1791368943&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-93",
    "title": "Blush Bliss Chip N Dip Set",
    "url": "https://thegiftstudio.com/products/blush-bliss-chip-n-dip-set",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,799",
    "priceNum": 1799,
    "originalPrice": "",
    "rating": 4.56,
    "reviews": 9,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451093_image1.jpg?v=1744102869&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451093_image1.jpg?v=1744102869&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451093_image2.jpg?v=1744102870&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-94",
    "title": "Brass Flower Oil Diyas Set Of 4",
    "url": "https://thegiftstudio.com/products/brass-flower-oil-diyas-set-of-4",
    "badge": "",
    "category": "Home Decor",
    "price": "₹2,499",
    "priceNum": 2499,
    "originalPrice": "",
    "rating": 4.38,
    "reviews": 8,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451092_image1.jpg?v=1744102871&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451092_image1.jpg?v=1744102871&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451092_image2.jpg?v=1744102865&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-95",
    "title": "Brass Lotus Oil Diya Set Of 4",
    "url": "https://thegiftstudio.com/products/brass-lotus-oil-diya-set-of-4",
    "badge": "Sale 6%",
    "category": "Home Decor",
    "price": "₹1,699",
    "priceNum": 1699,
    "originalPrice": "",
    "rating": 4.62,
    "reviews": 8,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451091image1.jpg?v=1744102859&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451091image1.jpg?v=1744102859&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451091_image2.jpg?v=1744102860&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-96",
    "title": "Floral T-Light Holder",
    "url": "https://thegiftstudio.com/products/floral-t-light-holder",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹679",
    "priceNum": 679,
    "originalPrice": "",
    "rating": 4.0,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451090_image1.jpg?v=1744102855&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451090_image1.jpg?v=1744102855&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451090_image2.jpg?v=1744102856&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-97",
    "title": "Floral Elegance Twin Platter",
    "url": "https://thegiftstudio.com/products/floral-elegance-twin-platter",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,599",
    "priceNum": 2599,
    "originalPrice": "",
    "rating": 4.6,
    "reviews": 10,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451088_image1.jpg?v=1744102845&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451088_image1.jpg?v=1744102845&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451088_image2.jpg?v=1744102846&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-98",
    "title": "Sleek Wire Candle Prism",
    "url": "https://thegiftstudio.com/products/sleek-wire-candle-prism",
    "badge": "",
    "category": "Home Decor",
    "price": "₹2,649",
    "priceNum": 2649,
    "originalPrice": "",
    "rating": 4.75,
    "reviews": 8,
    "image": "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-99",
    "title": "Luxe Round Candle Holder",
    "url": "https://thegiftstudio.com/products/luxe-round-candle-holder",
    "badge": "",
    "category": "Home Decor",
    "price": "₹3,399",
    "priceNum": 3399,
    "originalPrice": "",
    "rating": 4.33,
    "reviews": 3,
    "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-100",
    "title": "Grey Agate Square Coasters Set Of 2",
    "url": "https://thegiftstudio.com/products/grey-agate-square-coasters-set-of-2",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,649",
    "priceNum": 1649,
    "originalPrice": "",
    "rating": 4.42,
    "reviews": 12,
    "image": "https://thegiftstudio.com/cdn/shop/files/1450883_image_1_305c8edb-71b0-4808-8792-8779bd93cc5f.jpg?v=1744102883&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1450883_image_1_305c8edb-71b0-4808-8792-8779bd93cc5f.jpg?v=1744102883&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1450883_image_2_2bdb919f-4b0a-48be-9f68-ee371f5bc7f2.jpg?v=1744102884&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-101",
    "title": "Twin Flame Candle Holder",
    "url": "https://thegiftstudio.com/products/twin-flame-candle-holder",
    "badge": "",
    "category": "Home Decor",
    "price": "₹3,799",
    "priceNum": 3799,
    "originalPrice": "",
    "rating": 4.6,
    "reviews": 5,
    "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-102",
    "title": "Luxe Rose Agate With T Light Holder 1",
    "url": "https://thegiftstudio.com/products/luxe-rose-agate-with-t-light-holder-1",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,999",
    "priceNum": 1999,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-103",
    "title": "Fragrance Gift Set Peony Blush Suede",
    "url": "https://thegiftstudio.com/products/fragrance-gift-set-peony-blush-suede",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,399",
    "priceNum": 1399,
    "originalPrice": "",
    "rating": 4.25,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/FragranceGiftsetPeony_BlushSuede_1454604_1.jpg?v=1744103714&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/FragranceGiftsetPeony_BlushSuede_1454604_1.jpg?v=1744103714&width=533",
      "https://thegiftstudio.com/cdn/shop/files/FragranceGiftsetPeony_BlushSuede_1454604_2.jpg?v=1744103716&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-104",
    "title": "Coaster Peach Quartz Set Of 2",
    "url": "https://thegiftstudio.com/products/coaster-peach-quartz-set-of-2",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,649",
    "priceNum": 1649,
    "originalPrice": "",
    "rating": 5.0,
    "reviews": 4,
    "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-105",
    "title": "Bell Jar Candle 310 Gm Peony Blush Suede",
    "url": "https://thegiftstudio.com/products/bell-jar-candle-310-gm-peony-blush-suede",
    "badge": "",
    "category": "Home Decor",
    "price": "₹1,529",
    "priceNum": 1529,
    "originalPrice": "",
    "rating": 4.4,
    "reviews": 5,
    "image": "https://thegiftstudio.com/cdn/shop/files/BellJarCandle310gmPeony_BlushSuede_1454610_1_46eec167-189e-4c57-b454-d02223bbc68c.jpg?v=1744103726&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/BellJarCandle310gmPeony_BlushSuede_1454610_1_46eec167-189e-4c57-b454-d02223bbc68c.jpg?v=1744103726&width=533",
      "https://thegiftstudio.com/cdn/shop/files/BellJarCandle310gmPeony_BlushSuede_1454610_2.jpg?v=1744103727&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-106",
    "title": "Luxe Gold Ripple Bowl Set",
    "url": "https://thegiftstudio.com/products/luxe-gold-ripple-bowl-set",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,479",
    "priceNum": 1479,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-107",
    "title": "Luxe Rose Agate With T Light Holder",
    "url": "https://thegiftstudio.com/products/luxe-rose-agate-with-t-light-holder",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,499",
    "priceNum": 1499,
    "originalPrice": "",
    "rating": 4.25,
    "reviews": 4,
    "image": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-108",
    "title": "Signature Room Spray Mandarin 50 Ml",
    "url": "https://thegiftstudio.com/products/signature-room-spray-mandarin-50-ml",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹1,580",
    "priceNum": 1580,
    "originalPrice": "",
    "rating": 4.0,
    "reviews": 2,
    "image": "https://thegiftstudio.com/cdn/shop/files/SignatureRoomSpray-Mandarin50ml_1462535_1.jpg?v=1747210778&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/SignatureRoomSpray-Mandarin50ml_1462535_1.jpg?v=1747210778&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SignatureRoomSpray-Mandarin50ml_1462535_2.jpg?v=1747210779&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SignatureRoomSpray-Mandarin50ml_1462535_3.jpg?v=1747210780&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_0ec19c28-7e8f-480d-a613-559c5c67687f.png?v=1768808562&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-109",
    "title": "Artisanal Grooved Platter",
    "url": "https://thegiftstudio.com/products/artisanal-grooved-platter",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,599",
    "priceNum": 1599,
    "originalPrice": "",
    "rating": 4.5,
    "reviews": 8,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451100_image1.jpg?v=1758016040&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451100_image1.jpg?v=1758016040&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451100-image2.jpg?v=1758016042&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-110",
    "title": "Aria Raw Textured Gold Bowls Set Of 2",
    "url": "https://thegiftstudio.com/products/aria-raw-textured-gold-bowls-set-of-2",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,629",
    "priceNum": 1629,
    "originalPrice": "",
    "rating": 4.33,
    "reviews": 3,
    "image": "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-111",
    "title": "Candle 200 Gm Lime Basil Crush",
    "url": "https://thegiftstudio.com/products/candle-200-gm-lime-basil-crush",
    "badge": "",
    "category": "Home Decor",
    "price": "₹949",
    "priceNum": 949,
    "originalPrice": "",
    "rating": 4.67,
    "reviews": 6,
    "image": "https://thegiftstudio.com/cdn/shop/files/Candle200gmLimeBasilCrush_1454609_1.jpg?v=1744103725&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Candle200gmLimeBasilCrush_1454609_1.jpg?v=1744103725&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Candle200gmLimeBasilCrush_1454609_2.jpg?v=1744103726&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-112",
    "title": "Tulip-shaped T-light Holder",
    "url": "https://thegiftstudio.com/products/tulip-shaped-t-light-holder",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹979",
    "priceNum": 979,
    "originalPrice": "",
    "rating": 4.5,
    "reviews": 4,
    "image": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-113",
    "title": "Signature Candle Mandarin",
    "url": "https://thegiftstudio.com/products/signature-candle-mandarin",
    "badge": "Sold out",
    "category": "Home Decor",
    "price": "₹1,580",
    "priceNum": 1580,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/Signature_Candle_-_Mandarin_3_1462530_1.jpg?v=1747210765&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Signature_Candle_-_Mandarin_3_1462530_1.jpg?v=1747210765&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Signature_Candle_-_Mandarin_3_1462530_2.jpg?v=1747210766&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Signature_Candle_-_Mandarin_3_1462530_3.jpg?v=1747210767&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_c3ecb76d-abb7-4ae8-9a17-e44d2c1aa250.png?v=1768808682&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-114",
    "title": "Marble Coasters With Lotus Mother Of Pearl Inlay",
    "url": "https://thegiftstudio.com/products/marble-coasters-with-lotus-mother-of-pearl-inlay",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹1,129",
    "priceNum": 1129,
    "originalPrice": "",
    "rating": 4.75,
    "reviews": 4,
    "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-115",
    "title": "Signature Room Spray Summertime Cedar 50 Ml",
    "url": "https://thegiftstudio.com/products/signature-room-spray-summertime-cedar-50-ml",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹1,580",
    "priceNum": 1580,
    "originalPrice": "",
    "rating": 4.5,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/SignturRoomSpraySummertimeCedar50ml_1462536_1.jpg?v=1747210782&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/SignturRoomSpraySummertimeCedar50ml_1462536_1.jpg?v=1747210782&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SignturRoomSpraySummertimeCedar50ml_1462536_2.jpg?v=1747210783&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SignturRoomSpraySummertimeCedar50ml_1462536_3.jpg?v=1747210784&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-116",
    "title": "Ode To India Srinagar",
    "url": "https://thegiftstudio.com/products/ode-to-india-srinagar",
    "badge": "Sold out",
    "category": "Best Sellers",
    "price": "₹2,700",
    "priceNum": 2700,
    "originalPrice": "",
    "rating": 4.67,
    "reviews": 3,
    "image": "https://thegiftstudio.com/cdn/shop/files/OdetoIndia-Srinagar_1462534_1.jpg?v=1747210773&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/OdetoIndia-Srinagar_1462534_1.jpg?v=1747210773&width=533",
      "https://thegiftstudio.com/cdn/shop/files/OdetoIndia-Srinagar_1462534_2.jpg?v=1747210774&width=533",
      "https://thegiftstudio.com/cdn/shop/files/OdetoIndia-Srinagar_1462534_3.jpg?v=1747210775&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_920a73df-35b5-454c-81fc-ed7a618e844c.png?v=1750937656&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-117",
    "title": "Signature Candle Summertime Cedar",
    "url": "https://thegiftstudio.com/products/signature-candle-summertime-cedar",
    "badge": "Sold out",
    "category": "Home Decor",
    "price": "₹1,580",
    "priceNum": 1580,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/SignatureCandle-SummertimeCedar_1462531_1.jpg?v=1747210769&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/SignatureCandle-SummertimeCedar_1462531_1.jpg?v=1747210769&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SignatureCandle-SummertimeCedar_1462531_2.jpg?v=1747210770&width=533",
      "https://thegiftstudio.com/cdn/shop/files/SignatureCandle-SummertimeCedar_1462531_3.jpg?v=1747210771&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_e2f3a964-fc0c-40b0-81d9-c4ee2e677ebb.png?v=1750937656&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-118",
    "title": "Enchante Candle Dil Se Saffron Silk Birds",
    "url": "https://thegiftstudio.com/products/enchante-candle-dil-se-saffron-silk-birds",
    "badge": "Sold out",
    "category": "Home Decor",
    "price": "₹900",
    "priceNum": 900,
    "originalPrice": "",
    "rating": 4.67,
    "reviews": 3,
    "image": "https://thegiftstudio.com/cdn/shop/files/EnchanteCandleDilSeSaffronSilkBird_1462529_1.jpg?v=1747210761&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/EnchanteCandleDilSeSaffronSilkBird_1462529_1.jpg?v=1747210761&width=533",
      "https://thegiftstudio.com/cdn/shop/files/EnchanteCandleDilSeSaffronSilkBird_1462529_2.jpg?v=1747210761&width=533",
      "https://thegiftstudio.com/cdn/shop/files/EnchanteCandleDilSeSaffronSilkBird_1462529_3.jpg?v=1747210762&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_b0eec842-d5a4-4180-b69f-aea44fc9fb68.png?v=1750937656&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-119",
    "title": "Enchante Candle Dil Se Saffron Silk Dance",
    "url": "https://thegiftstudio.com/products/enchante-candle-dil-se-saffron-silk-dance",
    "badge": "",
    "category": "Home Decor",
    "price": "₹900",
    "priceNum": 900,
    "originalPrice": "",
    "rating": 4.5,
    "reviews": 2,
    "image": "https://thegiftstudio.com/cdn/shop/files/EnchanteCandleDilSeSaffronSilkDance_1462528_1.jpg?v=1747210756&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/EnchanteCandleDilSeSaffronSilkDance_1462528_1.jpg?v=1747210756&width=533",
      "https://thegiftstudio.com/cdn/shop/files/EnchanteCandleDilSeSaffronSilkDance_1462528_2.jpg?v=1747210757&width=533",
      "https://thegiftstudio.com/cdn/shop/files/EnchanteCandleDilSeSaffronSilkDance_1462528_3.jpg?v=1747210758&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_da13ce51-9848-4c6f-b27e-3ca781187307.png?v=1750937656&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-120",
    "title": "Grey Agate Wine Stopper",
    "url": "https://thegiftstudio.com/products/grey-agate-wine-stopper",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹929",
    "priceNum": 929,
    "originalPrice": "",
    "rating": 4.4,
    "reviews": 5,
    "image": "https://thegiftstudio.com/cdn/shop/files/1450891_image1.jpg?v=1744102949&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1450891_image1.jpg?v=1744102949&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1450891_image2.jpg?v=1744102950&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-121",
    "title": "Heirloom Candle Dil Se Rustic Roots Black Classic",
    "url": "https://thegiftstudio.com/products/heirloom-candle-dil-se-rustic-roots-black-classic",
    "badge": "Sold out",
    "category": "Home Decor",
    "price": "₹2,700",
    "priceNum": 2700,
    "originalPrice": "",
    "rating": 4.0,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/HeirloomCandleDilSeRusticRootBlack_1462527_1.jpg?v=1747210753&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/HeirloomCandleDilSeRusticRootBlack_1462527_1.jpg?v=1747210753&width=533",
      "https://thegiftstudio.com/cdn/shop/files/HeirloomCandleDilSeRusticRootBlack_1462527_2.jpg?v=1747210754&width=533",
      "https://thegiftstudio.com/cdn/shop/files/about_us_image_03v_eb0425a3-9c01-4f42-ac95-2c6f53a8e7c8.png?v=1763011865&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-122",
    "title": "Bell Jar Candle 310 Gm Lime Basil Crush",
    "url": "https://thegiftstudio.com/products/bell-jar-candle-310-gm-lime-basil-crush",
    "badge": "",
    "category": "Home Decor",
    "price": "₹1,529",
    "priceNum": 1529,
    "originalPrice": "",
    "rating": 4.5,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/BellJarCandle310gmLimeBasilCrush_1454611_1.jpg?v=1744103729&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/BellJarCandle310gmLimeBasilCrush_1454611_1.jpg?v=1744103729&width=533",
      "https://thegiftstudio.com/cdn/shop/files/BellJarCandle310gmLimeBasilCrush_1454611_2.jpg?v=1744103730&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-123",
    "title": "Candle 200 Gm Peony Blush Suede",
    "url": "https://thegiftstudio.com/products/candle-200-gm-peony-blush-suede",
    "badge": "",
    "category": "Home Decor",
    "price": "₹949",
    "priceNum": 949,
    "originalPrice": "",
    "rating": 4.33,
    "reviews": 3,
    "image": "https://thegiftstudio.com/cdn/shop/files/Candle200gmPeony_BlushSuede_1454608_1.jpg?v=1744103723&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/Candle200gmPeony_BlushSuede_1454608_1.jpg?v=1744103723&width=533",
      "https://thegiftstudio.com/cdn/shop/files/Candle200gmPeony_BlushSuede_1454608_2.jpg?v=1744103724&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-124",
    "title": "Candles Set Of 3 Peony Blush Suede",
    "url": "https://thegiftstudio.com/products/candles-set-of-3-peony-blush-suede",
    "badge": "",
    "category": "Home Decor",
    "price": "₹749",
    "priceNum": 749,
    "originalPrice": "",
    "rating": 4.8,
    "reviews": 14,
    "image": "https://thegiftstudio.com/cdn/shop/files/CandlesSetof3Peony_BlushSuede_1454606_1.jpg?v=1744103719&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/CandlesSetof3Peony_BlushSuede_1454606_1.jpg?v=1744103719&width=533",
      "https://thegiftstudio.com/cdn/shop/files/CandlesSetof3Peony_BlushSuede_1454606_2.jpg?v=1744103720&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-125",
    "title": "Fragrance Gift Set Lime Basil Crush",
    "url": "https://thegiftstudio.com/products/fragrance-gift-set-lime-basil-crush",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,399",
    "priceNum": 1399,
    "originalPrice": "",
    "rating": 4.75,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/FragranceGiftsetLimeBasilCrush_1454605_1.jpg?v=1744103717&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/FragranceGiftsetLimeBasilCrush_1454605_1.jpg?v=1744103717&width=533",
      "https://thegiftstudio.com/cdn/shop/files/FragranceGiftsetLimeBasilCrush_1454605_2.jpg?v=1744103718&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-126",
    "title": "Rose Quartz Wine Stopper",
    "url": "https://thegiftstudio.com/products/rose-quartz-wine-stopper",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹929",
    "priceNum": 929,
    "originalPrice": "",
    "rating": 4.43,
    "reviews": 7,
    "image": "https://thegiftstudio.com/cdn/shop/files/1450890_image1.jpg?v=1744102946&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1450890_image1.jpg?v=1744102946&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1450890_image2.jpg?v=1744102947&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-127",
    "title": "Reed Diffuser Lime Basil Crush 150 Ml",
    "url": "https://thegiftstudio.com/products/reed-diffuser-lime-basil-crush-150-ml",
    "badge": "",
    "category": "Home Decor",
    "price": "₹999",
    "priceNum": 999,
    "originalPrice": "",
    "rating": 4.33,
    "reviews": 6,
    "image": "https://thegiftstudio.com/cdn/shop/files/ReedDiffuserLimeBasilCrush150ml_1454603_1.jpg?v=1744103713&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/ReedDiffuserLimeBasilCrush150ml_1454603_1.jpg?v=1744103713&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ReedDiffuserLimeBasilCrush150ml_1454603_2.jpg?v=1744103714&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-128",
    "title": "Reed Diffuser Peony Blush Suede 150 Ml",
    "url": "https://thegiftstudio.com/products/reed-diffuser-peony-blush-suede-150-ml",
    "badge": "",
    "category": "Home Decor",
    "price": "₹999",
    "priceNum": 999,
    "originalPrice": "",
    "rating": 4.5,
    "reviews": 4,
    "image": "https://thegiftstudio.com/cdn/shop/files/ReedDiffuserPeony_BlushSuede150ml_1454602_1_6c35aba6-0fc9-4d8c-b9b7-ad4170cb16ef.jpg?v=1744103710&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/ReedDiffuserPeony_BlushSuede150ml_1454602_1_6c35aba6-0fc9-4d8c-b9b7-ad4170cb16ef.jpg?v=1744103710&width=533",
      "https://thegiftstudio.com/cdn/shop/files/ReedDiffuserPeony_BlushSuede150ml_1454602_2.jpg?v=1744103711&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-129",
    "title": "Peach Agate Photo Frame",
    "url": "https://thegiftstudio.com/products/peach-agate-photo-frame",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,349",
    "priceNum": 2349,
    "originalPrice": "",
    "rating": 4.43,
    "reviews": 7,
    "image": "https://thegiftstudio.com/cdn/shop/files/1450893_image1.jpg?v=1744102953&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1450893_image1.jpg?v=1744102953&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1450893_image2.jpg?v=1744102955&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-130",
    "title": "Grey Agate Photo Frame",
    "url": "https://thegiftstudio.com/products/grey-agate-photo-frame",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,349",
    "priceNum": 2349,
    "originalPrice": "",
    "rating": 4.6,
    "reviews": 10,
    "image": "https://thegiftstudio.com/cdn/shop/files/1450892_image1.jpg?v=1744102951&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1450892_image1.jpg?v=1744102951&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1450892_image2.jpg?v=1744102952&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-131",
    "title": "Rose Quartz Cheeseboard Set Of 3 Cheese Knives",
    "url": "https://thegiftstudio.com/products/rose-quartz-cheeseboard-set-of-3-cheese-knives",
    "badge": "",
    "category": "Corporate Gifts",
    "price": "₹3,279",
    "priceNum": 3279,
    "originalPrice": "",
    "rating": 4.62,
    "reviews": 8,
    "image": "https://thegiftstudio.com/cdn/shop/files/1450888_image1_7ca9bde2-8fd0-4bf9-acbb-ebbfb68f384e.jpg?v=1744102924&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1450888_image1_7ca9bde2-8fd0-4bf9-acbb-ebbfb68f384e.jpg?v=1744102924&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1450888_image2_e1679e81-d3a6-4b67-9c97-360d134e4af8.jpg?v=1744102925&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1450888_image3_cfde8460-d119-42ca-af9f-6407324bbfb2.jpg?v=1744102926&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-132",
    "title": "Petal T Light Holders Set Of 2",
    "url": "https://thegiftstudio.com/products/petal-t-light-holders-set-of-2",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹599",
    "priceNum": 599,
    "originalPrice": "",
    "rating": 4.56,
    "reviews": 9,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451102_image1.jpg?v=1744102929&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451102_image1.jpg?v=1744102929&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451102_image2.jpg?v=1744102931&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-133",
    "title": "Ornate Cutwork T Light Holder Set Of 4",
    "url": "https://thegiftstudio.com/products/ornate-cutwork-t-light-holder-set-of-4",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹999",
    "priceNum": 999,
    "originalPrice": "",
    "rating": 4.22,
    "reviews": 9,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451101_image2.jpg?v=1744102927&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451101_image2.jpg?v=1744102927&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451101-image1.jpg?v=1744102928&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-134",
    "title": "Leafy Elegance Platter",
    "url": "https://thegiftstudio.com/products/leafy-elegance-platter",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹2,999",
    "priceNum": 2999,
    "originalPrice": "",
    "rating": 4.6,
    "reviews": 5,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451099_image1.jpg?v=1744102916&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451099_image1.jpg?v=1744102916&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451099_image2.jpg?v=1744102917&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-135",
    "title": "Cutwork Serenity T Light Holder Votive",
    "url": "https://thegiftstudio.com/products/cutwork-serenity-t-light-holder-votive",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹659",
    "priceNum": 659,
    "originalPrice": "",
    "rating": 4.67,
    "reviews": 6,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451098_image1.jpg?v=1744102911&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451098_image1.jpg?v=1744102911&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451098_image2.jpg?v=1744102912&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-136",
    "title": "Lotus Casted T Light Holder",
    "url": "https://thegiftstudio.com/products/lotus-casted-t-light-holder",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,099",
    "priceNum": 1099,
    "originalPrice": "",
    "rating": 4.17,
    "reviews": 6,
    "image": "https://thegiftstudio.com/cdn/shop/files/1451096_image1.jpg?v=1744102900&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1451096_image1.jpg?v=1744102900&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1451096_image2.jpg?v=1744102902&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-137",
    "title": "Grey Agate Cheeseboard Set Of 3 Cheese Knives",
    "url": "https://thegiftstudio.com/products/grey-agate-cheeseboard-set-of-3-cheese-knives",
    "badge": "",
    "category": "Corporate Gifts",
    "price": "₹3,279",
    "priceNum": 3279,
    "originalPrice": "",
    "rating": 4.67,
    "reviews": 9,
    "image": "https://thegiftstudio.com/cdn/shop/files/1450887_image1.jpg?v=1744102895&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1450887_image1.jpg?v=1744102895&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1450887_image2.jpg?v=1744102896&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1450887_image3.jpg?v=1744102897&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  },
  {
    "id": "prod-138",
    "title": "White Quartz Gold Edge Coasters Set Of 2",
    "url": "https://thegiftstudio.com/products/white-quartz-gold-edge-coasters-set-of-2",
    "badge": "",
    "category": "Best Sellers",
    "price": "₹1,649",
    "priceNum": 1649,
    "originalPrice": "",
    "rating": 4.62,
    "reviews": 8,
    "image": "https://thegiftstudio.com/cdn/shop/files/1450885_image2.jpg?v=1744102889&width=533",
    "images": [
      "https://thegiftstudio.com/cdn/shop/files/1450885_image2.jpg?v=1744102889&width=533",
      "https://thegiftstudio.com/cdn/shop/files/1450885_image1.jpg?v=1744102891&width=533"
    ],
    "inStock": true,
    "description": "An exquisite hand-curated gift hamper featuring premium artisanal delights, luxury packaging, and a personalized keepsake card. Hand-tied with silk ribbon."
  }
];


export const DIWALI_GIFTING_IDEAS = [
  {
    id: 'blog-1',
    date: '17 October 2026',
    title: 'Top 10 Unique Diwali Gift Hamper Ideas for Family & Friends',
    category: 'Gifting Guide',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    excerpt: 'From handcrafted brass diyas and aromatic soy candles to artisanal pistachio baklava and silver keepsakes, discover meaningful gifting inspirations for your dearest.'
  },
  {
    id: 'blog-2',
    date: '19 October 2026',
    title: 'Luxury Corporate Diwali Gifts That Leave a Lasting Impression',
    category: 'Corporate Excellence',
    readTime: '5 min read',
    image: 'https://thegiftstudio.com/cdn/shop/files/TheArtfulIndulgenceHamperbyGRIRANNA_1461810_1.jpg?v=1784541565&width=800',
    excerpt: 'Elevate your corporate gifting strategy this festive season. Explore bespoke branded leather trunks, temperature-controlled gourmet treats, and personalized gratitude notes.'
  },
  {
    id: 'blog-3',
    date: '21 October 2026',
    title: 'How to Curate the Perfect Eco-Friendly & Artisanal Diwali Hamper',
    category: 'Festive Trends',
    readTime: '3 min read',
    image: 'https://thegiftstudio.com/cdn/shop/files/Savoir_Faire_1456433_01.png?v=1768807625&width=800',
    excerpt: 'Sustainable celebrations meet pure luxury: learn how handmade terracotta diyas, organic dry fruits, and reusable keepsake storage boxes are defining modern festive gifting.'
  }
];

export const HOME_DECOR_PRICE_TIERS = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-1500', label: 'Under ₹1,500', min: 0, max: 1499 },
  { id: '1500-2499', label: '₹1,500 - ₹2,499', min: 1500, max: 2499 },
  { id: '2500-3499', label: '₹2,500 - ₹3,499', min: 2500, max: 3499 },
  { id: 'above-3500', label: 'Above ₹3,500', min: 3500, max: Infinity }
];

export const HOME_DECOR_SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'bestselling', label: 'Best Selling' }
];

export const HOME_DECOR_SEO_CONTENT = {
  mainHeading: 'Transform Homes with Thoughtful Home Décor Gifts',
  introParagraphs: [
    'A home is a sanctuary where memories are woven and celebratory moments unfold. At The Gift Studio, our Home Décor collection is thoughtfully curated to infuse luxury, warmth, and artistic panache into every living space.',
    'From hand-carved marble cheeseboards with genuine blue lapis inlays to glowing pure brass lotus diyas and mother-of-pearl photo frames, each piece blends heritage Indian craftsmanship with sleek contemporary aesthetics.'
  ],
  whyChooseHeading: 'Why Choose Our Home Décor Presents?',
  features: [
    { title: '1. Same Day Delivery', description: 'Enjoy reliable same-day delivery across Mumbai, Delhi NCR, Bengaluru, Kolkata, and major Indian metros.' },
    { title: '2. Handpicked Gifts', description: 'Every item in our collection is meticulously handpicked and inspected for flawless craftsmanship.' },
    { title: '3. Wide Variety', description: 'Discover versatile pieces suited for diverse interiors.' },
    { title: '4. Elegant Packaging', description: 'Our signature luxury gift boxing ensures an unforgettable unboxing experience.' },
    { title: '5. Pan-India Delivery', description: 'Specialized shock-proof packaging ensures fragile pieces arrive safely across India.' }
  ]
};
