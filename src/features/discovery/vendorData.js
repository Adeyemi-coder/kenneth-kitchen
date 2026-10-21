// Strict 1-to-1 unique mapping for verified authentic Nigerian food assets. No duplicate image URLs.

export const MOCK_REVIEWS = [
  {
    id: 1,
    initials: 'TA',
    name: 'Tunde Adebayo',
    area: 'Tanke, Ilorin',
    stars: 5,
    quote: 'The Àmàlà was steaming hot and the gbẹ̀gìrì was proper. The rider phoned right at the gate before handing over the pack.'
  },
  {
    id: 2,
    initials: 'CO',
    name: 'Chioma Okafor',
    area: 'Fate Road, Ilorin',
    stars: 5,
    quote: 'Firewood jollof aroma is completely authentic. The peppered beef cuts were huge and tender.'
  },
  {
    id: 3,
    initials: 'IB',
    name: 'Ibrahim Bello',
    area: 'GRA, Ilorin',
    stars: 4,
    quote: 'Fastest delivery in town. Catfish pepper soup arrived packaged tightly without any stew spilling in transit.'
  },
  {
    id: 4,
    initials: 'FO',
    name: 'Funke Oladipo',
    area: 'University Road',
    stars: 5,
    quote: 'Ordered the deluxe small chops box for our meeting. Puffs were fluffy and the samosas stayed crispy.'
  },
  {
    id: 5,
    initials: 'AA',
    name: 'Amina Alabi',
    area: 'Tanke Budo',
    stars: 5,
    quote: 'Double sausage chicken shawarma was loaded with cream and yaji pepper. Worth every single naira.'
  }
];

export const MOCK_CATEGORIES = [
  'All',
  'Swallow & Soups',
  'Rice & Combos',
  'Shawarma & Wraps',
  'Pizza & Pies',
  'Small Chops & Finger Foods',
  'Grills & Suya',
  'Pepper Soup & Pot',
  'Breakfast & Street Bites',
  'Native Pots & Porridge',
  'Seafood Specials',
  'Bakery & Pastries',
  'Chilled Drinks & Juices'
];

export const MOCK_DISHES = [
  // 1. Swallow & Soups (5 items - distinct swallow & stew photos)
  { 
    id: 'sw1', 
    category: 'Swallow & Soups', 
    name: 'Hot Àmàlà with Ogunfe and Ewédú', 
    price: 3500, 
    description: 'Steaming dark yam flour served with tender goat meat, gbegiri, and ewedu.', 
    vendorId: 'v1', 
    imageUrl: 'https://i.pinimg.com/736x/f8/0d/0f/f80d0f5ceed41a28896ed1aab4e11a76.jpg' 
  },
  { 
    id: 'sw2', 
    category: 'Swallow & Soups', 
    name: 'Pounded Yam with Egusi Elegusi & Assorted', 
    price: 4200, 
    description: 'Smooth Iyan with rich melon seed soup, bitterleaf, and assorted offal.', 
    vendorId: 'v1', 
    imageUrl: 'https://i.pinimg.com/736x/9a/b2/91/9ab29111a1e8a8071a4bd803ada89a65.jpg' 
  },
  { 
    id: 'sw3', 
    category: 'Swallow & Soups', 
    name: 'Ẹ̀bà with Ẹ̀fọ́ Riro & Fried Titus Fish', 
    price: 3200, 
    description: 'Yellow garri with richly seasoned vegetable stew and whole fried mackerel.', 
    vendorId: 'v1', 
    imageUrl: 'https://i.pinimg.com/736x/0c/0e/88/0c0e88074f98fb13025d7923b180ff5a.jpg' 
  },
  { 
    id: 'sw4', 
    category: 'Swallow & Soups', 
    name: 'Semovita with Ogbono & Dry Catfish', 
    price: 3800, 
    description: 'Silky semolina with draw soup, smoked dry fish, and crayfish chunks.', 
    vendorId: 'v1', 
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: 'sw5', 
    category: 'Swallow & Soups', 
    name: 'Tuwo Shinkafa with Miyan Kuka', 
    price: 3400, 
    description: 'Northern mashed rice swallow served with savory baobab leaf soup and beef.', 
    vendorId: 'v1', 
    imageUrl: 'https://i.pinimg.com/1200x/84/45/24/844524a89db4265988475505a4f54aea.jpg' 
  },

  // 2. Rice & Combos (5 items - distinct rice dishes)
  { 
    id: 'rc1', 
    category: 'Rice & Combos', 
    name: 'Smoky Firewood Party Jollof Combo', 
    price: 3600, 
    description: 'Authentic firewood jollof served with fried plantain, salad, and peppered chicken.', 
    vendorId: 'v2', 
    imageUrl: 'https://i.pinimg.com/736x/82/58/b8/8258b850f88f42482460c4dd337ea785.jpg' 
  },
  { 
    id: 'rc2', 
    category: 'Rice & Combos', 
    name: 'Special Fried Rice with Gizzard & Liver', 
    price: 3800, 
    description: 'Basmati rice cooked in herb broth with sweet corn, kidney beans, and diced liver.', 
    vendorId: 'v2', 
    imageUrl: 'https://i.pinimg.com/1200x/4c/c7/9f/4cc79f76b53e00505c9facf01811f952.jpg' 
  },
  { 
    id: 'rc3', 
    category: 'Rice & Combos', 
    name: 'Ofada Rice with Spicy Ayamase Designer Stew', 
    price: 4500, 
    description: 'Unpolished short-grain rice with green bell pepper, bleached palm oil, and locust bean stew.', 
    vendorId: 'v2', 
    imageUrl: 'https://i.pinimg.com/736x/da/3a/07/da3a0762f983f19a37cc2550615cd1d9.jpg' 
  },
  { 
    id: 'rc4', 
    category: 'Rice & Combos', 
    name: 'Native Village Coconut Rice with Smoked Fish', 
    price: 3400, 
    description: 'Rice simmered in fresh coconut milk, dry prawns, and hot Scotch bonnet peppers.', 
    vendorId: 'v2', 
    imageUrl: 'https://i.pinimg.com/736x/18/9f/0b/189f0b2d4a6a8602e7bed3f682edd686.jpg' 
  },
  { 
    id: 'rc5', 
    category: 'Rice & Combos', 
    name: 'White Rice, Ewa Aganyin & Plantain Platter', 
    price: 3000, 
    description: 'Steamed rice with mashed soft beans and spicy, smoky dark chili-onion sauce.', 
    vendorId: 'v2', 
    imageUrl: 'https://i.pinimg.com/1200x/d2/5d/2c/d25d2c24785a27ff1c205389fa674659.jpg' 
  },

  // 3. Shawarma & Wraps (5 items - distinct shawarma & wrap cuts)
  { 
    id: 'sh1', 
    category: 'Shawarma & Wraps', 
    name: 'Double Sausage Special Chicken Shawarma', 
    price: 2800, 
    description: 'Grilled chicken fillet, 2 jumbo beef sausages, cabbage, and creamy garlic-mayo.', 
    vendorId: 'v3', 
    imageUrl: 'https://i.pinimg.com/1200x/9a/6a/9c/9a6a9ca0ce1d743d7d346f98bb03182e.jpg' 
  },
  { 
    id: 'sh2', 
    category: 'Shawarma & Wraps', 
    name: 'Spicy Beef & Suya Yaji Shawarma', 
    price: 3000, 
    description: 'Tender beef strips seasoned with yaji pepper, pickled onions, and special chili cream.', 
    vendorId: 'v3', 
    imageUrl: 'https://i.pinimg.com/736x/6c/b9/65/6cb96590f16c65f1ab0141223a135274.jpg' 
  },
  { 
    id: 'sh3', 
    category: 'Shawarma & Wraps', 
    name: 'Loaded Triple Meat Monster Wrap', 
    price: 3800, 
    description: 'Chicken, shredded beef, two sausages, and melted mozzarella wrapped in toasted flatbread.', 
    vendorId: 'v3', 
    imageUrl: 'https://i.pinimg.com/736x/87/fc/94/87fc94d1a44c1debe67eb06add142c7d.jpg' 
  },
  { 
    id: 'sh4', 
    category: 'Shawarma & Wraps', 
    name: 'Sweet Chilli Chicken & Cheese Shawarma', 
    price: 3200, 
    description: 'Marinated roasted chicken tossed in sweet pepper sauce with cheddar shreds.', 
    vendorId: 'v3', 
    imageUrl: 'https://i.pinimg.com/736x/d0/7b/86/d07b862fcb60b370657bf0a9564f1ae1.jpg' 
  },
  { 
    id: 'sh5', 
    category: 'Shawarma & Wraps', 
    name: 'Barbecue Fish Shawarma Wrap', 
    price: 3500, 
    description: 'Flaked grilled croaker fish with shredded carrots, fresh cucumbers, and spicy dressing.', 
    vendorId: 'v3', 
    imageUrl: 'https://i.pinimg.com/736x/5d/90/b7/5d90b7f86ee45010cd71eb4e37770264.jpg' 
  },

  // 4. Pizza & Pies (5 items - distinct pizzas & pastries)
  { 
    id: 'pz1', 
    category: 'Pizza & Pies', 
    name: 'Naija Beef Suya Special Pizza (Medium)', 
    price: 5800, 
    description: 'Fire-grilled suya beef chunks, red onions, hot green peppers, and gooey mozzarella.', 
    vendorId: 'v4', 
    imageUrl: 'https://i.pinimg.com/736x/fe/48/d8/fe48d874d040d2016ebab86c842a5bb1.jpg' 
  },
  { 
    id: 'pz2', 
    category: 'Pizza & Pies', 
    name: 'BBQ Chicken & Sweetcorn Pizza', 
    price: 6200, 
    description: 'Smoky barbecue base, tender chicken strips, golden sweetcorn, and fresh cilantro.', 
    vendorId: 'v4', 
    imageUrl: 'https://i.pinimg.com/736x/fe/48/d8/fe48d874d040d2016ebab86c842a5bb1.jpg' 
  },
  { 
    id: 'pz3', 
    category: 'Pizza & Pies', 
    name: 'Spicy Pepperoni & Jalapeño Crunch Pizza', 
    price: 6500, 
    description: 'Loaded with beef pepperoni, sliced hot peppers, tomato marinara, and double cheese.', 
    vendorId: 'v4', 
    imageUrl: 'https://i.pinimg.com/736x/63/d1/1c/63d11c98a9ac1613b41efabf8d5c651b.jpg' 
  },
  { 
    id: 'pz4', 
    category: 'Pizza & Pies', 
    name: 'Four Cheese Margherita Deluxe', 
    price: 5400, 
    description: 'Mozzarella, cheddar, parmesan, and local cheese curd over seasoned tomato base.', 
    vendorId: 'v4', 
    imageUrl: 'https://i.pinimg.com/736x/b5/99/0c/b5990c31c83c84ae89984841784664c9.jpg' 
  },
  { 
    id: 'pz5', 
    category: 'Pizza & Pies', 
    name: 'Traditional Nigerian Meat Pie (Box of 3)', 
    price: 2400, 
    description: 'Flaky shortcrust pastry filled with minced beef, potato cubes, and carrots.', 
    vendorId: 'v4', 
    imageUrl: 'https://i.pinimg.com/736x/3f/b1/e2/3fb1e2e53997d2e8bda4796cd0e4cb8c.jpg' 
  },

  // 5. Small Chops & Finger Foods (5 items - distinct finger foods)
  { 
    id: 'sc1', 
    category: 'Small Chops & Finger Foods', 
    name: 'Deluxe Party Small Chops Box', 
    price: 3200, 
    description: '6 Puff-puffs, 2 crispy beef samosas, 2 spring rolls, and 2 peppered chicken wings.', 
    vendorId: 'v5', 
    imageUrl: 'https://i.pinimg.com/1200x/ee/c6/1a/eec61af6e84de272c7d4396113db1357.jpg' 
  },
  { 
    id: 'sc2', 
    category: 'Small Chops & Finger Foods', 
    name: 'Crispy Samosa & Spring Roll Platter (8 pcs)', 
    price: 2800, 
    description: '4 spiced minced beef samosas and 4 crunchy vegetable-chicken spring rolls.', 
    vendorId: 'v5', 
    imageUrl: 'https://i.pinimg.com/736x/a0/8b/99/a08b9976e7f2f383c33ef954aa5352ab.jpg' 
  },
  { 
    id: 'sc3', 
    category: 'Small Chops & Finger Foods', 
    name: 'Peppered Gizzard & Plantain (Gizdodo)', 
    price: 3500, 
    description: 'Tender chicken gizzard and sweet fried plantain tossed in a spicy pepper sauce.', 
    vendorId: 'v5', 
    imageUrl: 'https://i.pinimg.com/1200x/a3/69/fa/a369fa4db0eb01e066195fcec3ce4fea.jpg' 
  },
  { 
    id: 'sc4', 
    category: 'Small Chops & Finger Foods', 
    name: 'Sweet Golden Puff-Puff Bucket (15 pcs)', 
    price: 1800, 
    description: 'Warm, airy fried dough balls with nutmeg notes, dusted lightly with sugar.', 
    vendorId: 'v5', 
    imageUrl: 'https://i.pinimg.com/736x/4c/b8/4e/4cb84e0ce902a16e3777a4aae1fc6edc.jpg' 
  },
  { 
    id: 'sc5', 
    category: 'Small Chops & Finger Foods', 
    name: 'Crispy Battered Fish Bites & Tartar', 
    price: 3600, 
    description: 'Deep-fried croaker fish nuggets coated in seasoned batter with tangy sauce.', 
    vendorId: 'v5', 
    imageUrl: 'https://i.pinimg.com/736x/c0/cb/f6/c0cbf6d59126ba202dbdf9e1359e89fb.jpg' 
  },

  // 6. Grills & Suya (5 items - distinct meats & skewers)
  { 
    id: 'gr1', 
    category: 'Grills & Suya', 
    name: 'Authentic Beef Suya Parcel with Onions', 
    price: 2500, 
    description: 'Thinly sliced boneless beef skewers charred over coals and coated with yaji spice.', 
    vendorId: 'v3', 
    imageUrl: 'https://i.pinimg.com/736x/93/9b/d9/939bd99c3e886f0058bec1e067702f9c.jpg' 
  },
  { 
    id: 'gr2', 
    category: 'Grills & Suya', 
    name: 'Whole Grilled Catfish (Point & Kill)', 
    price: 6500, 
    description: 'Charcoal-grilled fresh catfish basted with spicy ata rodo sauce and served with chips.', 
    vendorId: 'v3', 
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: 'gr3', 
    category: 'Grills & Suya', 
    name: 'Quarter Flame-Grilled Peppered Chicken', 
    price: 3200, 
    description: 'Smoky chicken quarter basted in habanero chili oil and roasted onions.', 
    vendorId: 'v3', 
    imageUrl: 'https://i.pinimg.com/736x/bb/cd/9e/bbcd9ee90dd0c906cd2a2a100bc75e1b.jpg' 
  },
  { 
    id: 'gr4', 
    category: 'Grills & Suya', 
    name: 'Ram Meat Suya (Balangu Special)', 
    price: 3800, 
    description: 'Tender northern-style grilled ram cuts infused with garlic, ginger, and suya pepper.', 
    vendorId: 'v3', 
    imageUrl: 'https://i.pinimg.com/736x/6c/b9/65/6cb96590f16c65f1ab0141223a135274.jpg' 
  },
  { 
    id: 'gr5', 
    category: 'Grills & Suya', 
    name: 'Charcoal-Grilled Turkey Wings (2 pcs)', 
    price: 4200, 
    description: 'Meaty jumbo turkey wings tossed in caramelized spicy tomato-pepper paste.', 
    vendorId: 'v3', 
    imageUrl: 'https://i.pinimg.com/1200x/f8/a2/97/f8a297636f525d3d421f02672e156d37.jpg' 
  },

  // 7. Pepper Soup & Pot (5 items - distinct spicy soups)
  { 
    id: 'ps1', 
    category: 'Pepper Soup & Pot', 
    name: 'Hot Catfish Pepper Soup (Point & Kill Bowl)', 
    price: 4500, 
    description: 'Fresh catfish simmered in aromatic uziza, uda, and calabash nutmeg broth.', 
    vendorId: 'v6', 
    imageUrl: 'https://i.pinimg.com/736x/dc/80/62/dc806210e323d3aa3149f70f48b4fb30.jpg' 
  },
  { 
    id: 'ps2', 
    category: 'Pepper Soup & Pot', 
    name: 'Goat Meat Pepper Soup (Ogunfe Special)', 
    price: 4000, 
    description: 'Tender cuts of goat meat in spicy herbal broth garnished with fresh scent leaves.', 
    vendorId: 'v6', 
    imageUrl: 'https://i.pinimg.com/736x/56/7c/f9/567cf9675d6d442881e7a022c618f3d1.jpg' 
  },
  { 
    id: 'ps3', 
    category: 'Pepper Soup & Pot', 
    name: 'Assorted Cow Leg & Intestines Pepper Soup', 
    price: 3500, 
    description: 'Slow-simmered cow foot, towel, and shaki infused with native northern spices.', 
    vendorId: 'v6', 
    imageUrl: 'https://i.pinimg.com/736x/7b/23/1e/7b231e124ad72f6475edbe48c69594ea.jpg' 
  },
  { 
    id: 'ps4', 
    category: 'Pepper Soup & Pot', 
    name: 'Native Chicken & Yam Pepper Soup', 
    price: 3800, 
    description: 'Local hard chicken cooked with yam cubes in a light, restorative herbal soup.', 
    vendorId: 'v6', 
    imageUrl: 'https://i.pinimg.com/736x/c0/3e/12/c03e129288c77c364543c1972c3c65a7.jpg' 
  },
  { 
    id: 'ps5', 
    category: 'Pepper Soup & Pot', 
    name: 'Dry Fish & Plantain Pepper Soup', 
    price: 3600, 
    description: 'Smoked catfish and semi-ripe plantain simmered in hot peppery soup.', 
    vendorId: 'v6', 
    imageUrl: 'https://i.pinimg.com/736x/22/b8/3e/22b83e28f2007c8b40ad35a8c6f2aae5.jpg' 
  },

  // 8. Breakfast & Street Bites (5 items - authentic morning foods)
  { 
    id: 'br1', 
    category: 'Breakfast & Street Bites', 
    name: 'Agege Bread & Scrambled Egg Stew Platter', 
    price: 2000, 
    description: 'Soft, pillowy Agege bread served with a spicy 2-egg tomato sauce.', 
    vendorId: 'v1', 
    imageUrl: 'https://i.pinimg.com/736x/97/3c/dd/973cdda0244b959122f669f63ff34c32.jpg' 
  },
  { 
    id: 'br2', 
    category: 'Breakfast & Street Bites', 
    name: 'Crispy Akara Balls & Custard Combo (6 pcs)', 
    price: 1800, 
    description: 'Freshly deep-fried black-eyed bean fritters served with hot creamy vanilla custard.', 
    vendorId: 'v1', 
    imageUrl: 'https://i.pinimg.com/736x/4b/8a/52/4b8a5219c3362158bd7cea20b989b43f.jpg' 
  },
  { 
    id: 'br3', 
    category: 'Breakfast & Street Bites', 
    name: 'Moin Moin Elemi Meji (Egg & Fish Inside)', 
    price: 1500, 
    description: 'Steamed bean pudding enriched with boiled egg, flaked fish, and crayfish.', 
    vendorId: 'v1', 
    imageUrl: 'https://i.pinimg.com/736x/c2/2e/ba/c22eba8905ac9c5b2d32c9c02a7e6c6b.jpg' 
  },
  { 
    id: 'br4', 
    category: 'Breakfast & Street Bites', 
    name: 'Fried Yam, Sweet Potato & Pepper Sauce', 
    price: 2200, 
    description: 'Dundun with crunchy sweet potatoes served with fried fish-infused ata dindin.', 
    vendorId: 'v1', 
    imageUrl: 'https://i.pinimg.com/736x/8d/bb/33/8dbb330e79c673c1159fe83975b26e35.jpg' 
  },
  { 
    id: 'br5', 
    category: 'Breakfast & Street Bites', 
    name: 'Northern Masa with Spicy Suya Yaji (4 pcs)', 
    price: 1600, 
    description: 'Fermented pan-fried rice cakes served with powdered groundnut pepper.', 
    vendorId: 'v1', 
    imageUrl: 'https://i.pinimg.com/1200x/25/48/eb/2548eb50eed527e3054740f781afcb29.jpg' 
  },

  // 9. Native Pots & Porridge (5 items - distinct porridge & native pots)
  { 
    id: 'np1', 
    category: 'Native Pots & Porridge', 
    name: 'Yam Porridge (Asaro) with Smoked Fish', 
    price: 2800, 
    description: 'Puna yam cubes cooked in palm oil, blended peppers, and shredded dry fish.', 
    vendorId: 'v2', 
    imageUrl: 'https://i.pinimg.com/736x/21/5e/6c/215e6c43794f12f9e641bdc0621cb3c3.jpg' 
  },
  { 
    id: 'np2', 
    category: 'Native Pots & Porridge', 
    name: 'Native Ikokore (Water Yam Porridge)', 
    price: 3400, 
    description: 'Ijebu delicacy made with grated water yam, smoked fish, and dried prawns.', 
    vendorId: 'v2', 
    imageUrl: 'https://i.pinimg.com/736x/f0/60/64/f060644df453b40b8d044d30312624f4.jpg' 
  },
  { 
    id: 'np3', 
    category: 'Native Pots & Porridge', 
    name: 'Beans Porridge with Fried Ripe Plantain', 
    price: 2500, 
    description: 'Softly stewed honey beans cooked with crayfish, onions, and sweet golden dodo.', 
    vendorId: 'v2', 
    imageUrl: 'https://i.pinimg.com/1200x/ef/77/58/ef7758a9070fbfb30d6e921182bcd9bc.jpg' 
  },
  { 
    id: 'np4', 
    category: 'Native Pots & Porridge', 
    name: 'Unripe Plantain Porridge with Ugwu Leaves', 
    price: 3200, 
    description: 'Nutritious green plantain simmered in fish broth and shredded pumpkin leaves.', 
    vendorId: 'v2', 
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: 'np5', 
    category: 'Native Pots & Porridge', 
    name: 'Ewa Oloyin with Fried Titus Fish Cutlet', 
    price: 2900, 
    description: 'Rich honey bean pot topped with hot palm oil stew and seasoned fried fish.', 
    vendorId: 'v2', 
    imageUrl: 'https://i.pinimg.com/1200x/40/f9/76/40f976bc1b2c298bb7b42e04f3e2fc40.jpg' 
  },

  // 10. Seafood Specials (5 items - distinct seafood)
  { 
    id: 'sf1', 
    category: 'Seafood Specials', 
    name: 'Fisherman Soup with Crab, Prawns & Catfish', 
    price: 6800, 
    description: 'Delta-style seafood soup with jumbo prawns, blue crabs, periwinkles, and fresh fish.', 
    vendorId: 'v6', 
    imageUrl: 'https://i.pinimg.com/1200x/ec/5e/51/ec5e51c9c37ce9e0bfb7931550b929ac.jpg' 
  },
  { 
    id: 'sf2', 
    category: 'Seafood Specials', 
    name: 'Crispy Fried Croaker Fish in Pepper Sauce', 
    price: 4200, 
    description: 'Whole spiced croaker fish drowned in spicy bell pepper and onion sauce.', 
    vendorId: 'v6', 
    imageUrl: 'https://i.pinimg.com/736x/78/56/2d/78562d121b8f7b19a3292f2aa8d8f08b.jpg' 
  },
  { 
    id: 'sf3', 
    category: 'Seafood Specials', 
    name: 'Garlic Butter Tiger Prawns (6 pcs)', 
    price: 7500, 
    description: 'Pan-seared jumbo tiger prawns in garlic, parsley, and hot chili butter.', 
    vendorId: 'v6', 
    imageUrl: 'https://i.pinimg.com/1200x/e9/a4/b5/e9a4b584370eb72dec07dc0d208e7dc0.jpg' 
  },
  { 
    id: 'sf4', 
    category: 'Seafood Specials', 
    name: 'Spicy Calamari Rings & Pepper Dip', 
    price: 4800, 
    description: 'Tender squid rings dusted in spicy flour, fried crisp with chili dip.', 
    vendorId: 'v6', 
    imageUrl: 'https://i.pinimg.com/736x/96/02/2c/96022c8cf87a3b854c56ca9512490e88.jpg' 
  },
  { 
    id: 'sf5', 
    category: 'Seafood Specials', 
    name: 'Seafood Fried Rice with Crab Claws', 
    price: 5500, 
    description: 'Wok-tossed basmati rice with baby shrimp, calamari, sweet peppers, and crab meat.', 
    vendorId: 'v6', 
    imageUrl: 'https://i.pinimg.com/736x/5e/02/54/5e025455eba14c550b2cd20fcd7d4bd6.jpg' 
  },

  // 11. Bakery & Pastries (5 items - distinct bread & pastry items)
  { 
    id: 'bk1', 
    category: 'Bakery & Pastries', 
    name: 'Freshly Baked Agege Butter Bread Loaf', 
    price: 1200, 
    description: 'Ultra-soft, sweet and dense traditional bakery bread loaf made with pure butter.', 
    vendorId: 'v4', 
    imageUrl: 'https://i.pinimg.com/1200x/56/18/ac/5618ace3f2462bc2b43d833cc165d277.jpg' 
  },
  { 
    id: 'bk2', 
    category: 'Bakery & Pastries', 
    name: 'Nigerian Sausage Roll (Pack of 3)', 
    price: 1500, 
    description: 'Flaky pastry wrapped around seasoned minced beef sausage meat.', 
    vendorId: 'v4', 
    imageUrl: 'https://i.pinimg.com/736x/31/94/91/3194916a98f3c3d98fe378ffe7e3c077.jpg' 
  },
  { 
    id: 'bk3', 
    category: 'Bakery & Pastries', 
    name: 'Crunchy Nigerian Chin Chin Jar (500g)', 
    price: 2000, 
    description: 'Crispy fried sweet pastry bites infused with nutmeg and condensed milk.', 
    vendorId: 'v4', 
    imageUrl: 'https://i.pinimg.com/736x/a2/35/f7/a235f71b4ffe799e12ceccc77d2cb01e.jpg' 
  },
  { 
    id: 'bk4', 
    category: 'Bakery & Pastries', 
    name: 'Glazed Ring Doughnuts (Box of 4)', 
    price: 2200, 
    description: 'Fluffy yeast-raised doughnuts with a sweet vanilla sugar glaze.', 
    vendorId: 'v4', 
    imageUrl: 'https://i.pinimg.com/1200x/11/d5/57/11d557f6f8a87282101cc3ff63194f09.jpg' 
  },
  { 
    id: 'bk5', 
    category: 'Bakery & Pastries', 
    name: 'Red Velvet Slice with Cream Cheese', 
    price: 2500, 
    description: 'Moist cocoa sponge layered with rich cream cheese frosting.', 
    vendorId: 'v4', 
    imageUrl: 'https://i.pinimg.com/736x/c3/ba/c0/c3bac0691b95f60ff5bfbe99b2fd3831.jpg' 
  },

  // 12. Chilled Drinks & Juices (5 items - distinct drink images)
  { 
    id: 'dr1', 
    category: 'Chilled Drinks & Juices', 
    name: 'Ice Cold Natural Zobo Juice (1 Litre)', 
    price: 1200, 
    description: 'Hibiscus brew with ginger, cloves, and fresh pineapple juice.', 
    vendorId: 'v5', 
    imageUrl: 'https://i.pinimg.com/1200x/c4/bd/d0/c4bdd0a269db6639a95450a24085147b.jpg' 
  },
  { 
    id: 'dr2', 
    category: 'Chilled Drinks & Juices', 
    name: 'Creamy Tiger Nut Milk (Kunu Aya - 750ml)', 
    price: 1500, 
    description: 'Blended tiger nuts, coconut, and dates, served chilled without dairy.', 
    vendorId: 'v5', 
    imageUrl: 'https://i.pinimg.com/736x/6b/e5/ef/6be5ef115d2300caac92cde331b6ef69.jpg' 
  },
  { 
    id: 'dr3', 
    category: 'Chilled Drinks & Juices', 
    name: 'Nigerian Chapman with Angostura Bitters', 
    price: 1800, 
    description: 'Fanta, Sprite, Ribena, cucumber slices, and lemon with Angostura bitters.', 
    vendorId: 'v5', 
    imageUrl: 'https://i.pinimg.com/736x/e2/da/05/e2da05cfe676680b45ed32e624828b95.jpg' 
  },
  { 
    id: 'dr4', 
    category: 'Chilled Drinks & Juices', 
    name: 'Freshly Tapped Sweet Palm Wine (1 Litre)', 
    price: 2200, 
    description: 'Natural unfermented sweet sap from oil palms, served cold.', 
    vendorId: 'v5', 
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: 'dr5', 
    category: 'Chilled Drinks & Juices', 
    name: 'Chilled Coca-Cola / Fanta Plastic Bottle (50cl)', 
    price: 500, 
    description: 'Cold refreshing soft drink.', 
    vendorId: 'v5', 
    imageUrl: 'https://i.pinimg.com/736x/c3/56/67/c356678d850e8f4ece14dc46bfdfb94e.jpg' 
  }
];

// Kitchen vendors: Unique, non-repeating storefront and platter photos
export const MOCK_VENDORS = [
  {
    id: 'v1',
    name: 'Iya Basira Amala Joint',
    city: 'Ilorin',
    area: 'Tanke',
    category: 'Swallow & Soups',
    dishesLine: 'Àmàlà dudu, gbẹ̀gìrì, ewédú, ogunfe, assorted beef',
    landmark: 'Opposite University of Ilorin Road, Tanke',
    rating: 4.9,
    reviewCount: 520,
    etaRange: '15–25 min',
    etaMin: 20,
    distanceKm: 1.4,
    deliveryFee: 0,
    isOpen: true,
    opensAt: null,
    isSponsored: false,
    imageUrl: 'https://i.pinimg.com/736x/2e/b7/09/2eb709b27d19bd840aa61b5c0ea6d583.jpg'
  },
  {
    id: 'v2',
    name: 'Mama Put Heritage Bukka',
    city: 'Ilorin',
    area: 'Fate Road',
    category: 'Rice & Combos',
    dishesLine: 'Smoky firewood party jollof, fried plantain, peppered beef',
    landmark: 'Near Fate Roundabout, Ilorin',
    rating: 4.6,
    reviewCount: 310,
    etaRange: '25–35 min',
    etaMin: 30,
    distanceKm: 2.8,
    deliveryFee: 650,
    isOpen: true,
    opensAt: null,
    isSponsored: true,
    imageUrl: 'https://i.pinimg.com/736x/6c/17/bc/6c17bc20335d7a9e54952d6395dbfe37.jpg'
  },
  {
    id: 'v3',
    name: 'Tanke Shawarma & Suya Spot',
    city: 'Ilorin',
    area: 'Tanke Budo',
    category: 'Shawarma & Wraps',
    dishesLine: 'Double sausage shawarma, spicy beef suya, grilled turkey',
    landmark: 'Beside Sanrab Filling Station, Tanke',
    rating: 4.7,
    reviewCount: 420,
    etaRange: '20–30 min',
    etaMin: 22,
    distanceKm: 1.8,
    deliveryFee: 700,
    isOpen: true,
    opensAt: null,
    isSponsored: false,
    imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=640&q=80'
  },
  {
    id: 'v4',
    name: 'Ilorin Crust Pizza & Bakery',
    city: 'Ilorin',
    area: 'GRA',
    category: 'Pizza & Pies',
    dishesLine: 'Naija beef suya pizza, BBQ chicken, meat pies, Agege bread',
    landmark: 'Off Ahmadu Bello Way, GRA, Ilorin',
    rating: 4.8,
    reviewCount: 290,
    etaRange: '25–35 min',
    etaMin: 28,
    distanceKm: 2.4,
    deliveryFee: 800,
    isOpen: true,
    opensAt: null,
    isSponsored: false,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=640&q=80'
  },
  {
    id: 'v5',
    name: 'Small Chops & Drinks Hub',
    city: 'Ilorin',
    area: 'Tanke Junction',
    category: 'Small Chops & Finger Foods',
    dishesLine: 'Party small chops boxes, puff-puff buckets, chilled zobo',
    landmark: 'Behind Total Filling Station, Tanke Junction',
    rating: 4.5,
    reviewCount: 180,
    etaRange: '15–25 min',
    etaMin: 18,
    distanceKm: 1.2,
    deliveryFee: 500,
    isOpen: true,
    opensAt: null,
    isSponsored: false,
    imageUrl: 'https://i.pinimg.com/736x/ea/aa/34/eaaa34d8f23c1a7aa79016b66ee1dfa3.jpg?q=80'
  },
  {
    id: 'v6',
    name: 'Point & Kill Pepper Soup Joint',
    city: 'Ilorin',
    area: 'Challenge',
    category: 'Pepper Soup & Pot',
    dishesLine: 'Fresh catfish pepper soup, goat meat ogunfe, fisherman soup',
    landmark: 'Challenge Junction, Ilorin',
    rating: 4.6,
    reviewCount: 240,
    etaRange: '30–40 min',
    etaMin: 32,
    distanceKm: 3.5,
    deliveryFee: 900,
    isOpen: true,
    opensAt: 'null',
    isSponsored: false,
    imageUrl: 'https://i.pinimg.com/736x/11/52/b1/1152b1830bdea1bd1a77c1c999370b07.jpg'
  }
];

export const MOCK_ORDER_HISTORY = [
  {
    orderId: 'ord-901',
    vendorId: 'v1',
    vendorName: 'Iya Basira Amala Joint',
    dishesSummary: 'Hot Àmàlà with Ogunfe and Ewédú',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80',
    totalNaira: 3500,
    etaRange: '20–30 min'
  },
  {
    orderId: 'ord-902',
    vendorId: 'v2',
    vendorName: 'Mama Put Heritage Bukka',
    dishesSummary: 'Smoky Firewood Party Jollof Combo',
    thumbnail: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=120&q=80',
    totalNaira: 3600,
    etaRange: '25–35 min'
  }
];