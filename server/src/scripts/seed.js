import { connectDatabase, disconnectDatabase } from '../config/db.js'
import { Product } from '../models/Product.js'
import { LibraryItem } from '../models/LibraryItem.js'

const seedProducts = [
  {
    name: 'Greenrut Revitalize Daily Supplement',
    sku: 'GR-REV-SUP',
    category: 'Vitamins & Supplements',
    price: 12500,
    stock: 50,
    status: 'published',
    description: 'A powerful blend of adaptogenic herbs designed to enhance energy, reduce stress, and support overall vitality. Scientifically formulated for daily wellness.',
    benefits: 'Enhances natural energy levels, reduces physical and mental fatigue, supports adrenal health, and mitigates stress symptoms.',
    ingredients: 'Moringa oleifera, Panax ginseng, Withania somnifera (Ashwagandha).',
    directions: 'Take 1-2 capsules daily in the morning with a full glass of water, or as directed by your healthcare professional.',
    warnings: 'Consult a physician if pregnant, nursing, or taking blood pressure medication.',
    scientificValidation: 'Standardized extracts tested for heavy metals and toxicology. Active ginsenosides and withanolides verified via chromatography.'
  },
  {
    name: 'Greenrut Soothe & Restore Herbal Balm',
    sku: 'GR-SOT-BLM',
    category: 'Skin & Hair Care',
    price: 8500,
    stock: 30,
    status: 'published',
    description: 'A deeply nourishing and calming balm for skin, infused with potent botanicals known for their restorative properties. Perfect for soothing dry or irritated skin.',
    benefits: 'Restores skin barrier integrity, calms redness, soothes minor irritations, and provides intensive hydration.',
    ingredients: 'Aloe barbadensis, Calendula officinalis, Butyrospermum parkii (Shea Butter), Jatropha curcas (Lapalapa) extract.',
    directions: 'Apply a thin layer to clean, dry skin on the affected area 2-3 times daily, massaging gently until absorbed.',
    warnings: 'For external use only. Discontinue use if irritation occurs.',
    scientificValidation: 'Dermatologically tested. Zero toxicology incidence reported. Phytochemical assays verify high concentrations of triterpenoid saponins.'
  },
  {
    name: 'Greenrut Detox Tea',
    sku: 'GR-DTX-TEA',
    category: 'Targeted Health',
    price: 7500,
    stock: 40,
    status: 'published',
    description: 'A powerful blend of adaptogenic herbs designed to detoxify the entire body of harmful chemicals, and support overall vitality. Scientifically formulated for periodic wellness.',
    benefits: 'Promotes liver detoxification pathways, supports digestive tract function, and aids in body tissue renewal.',
    ingredients: 'Cymbopogon citratus (Lemongrass), Senna alata (Asuwon), Zingiber officinale (Ginger).',
    directions: 'Steep one tea bag in hot water for 10-15 minutes. Drink once daily, preferably in the evening, for a 7-day period.',
    warnings: 'Not recommended for children, pregnant women, or individuals with chronic kidney conditions.',
    scientificValidation: 'In-vitro liver cell antioxidant assays confirmed high protective indices. Heavy metal clearance certified.'
  },
  {
    name: 'Greenrut Herbal Black Soap',
    sku: 'GR-BLK-SOP',
    category: 'Skin & Hair Care',
    price: 5000,
    stock: 100,
    status: 'published',
    description: 'A deeply nourishing and calming blend for skin, infused with potent herbs known for their restorative properties. Perfect for soothing dry or irritated skin.',
    benefits: 'Cleanses skin impurities, reduces acne spots, improves skin tone, and maintains natural moisture balance.',
    ingredients: 'Saponified Elaeis guineensis oil, Cocoa pod ash, Honey, Aloe vera, Baka extract.',
    directions: 'Lather soap in hands or on a washcloth, apply to face and body, then rinse thoroughly with warm water.',
    warnings: 'Avoid direct contact with eyes. Keep dry when not in use.',
    scientificValidation: 'Phytochemical screenings confirm high alkaloid content showing anti-microbial properties without disrupting natural skin pH.'
  },
  {
    name: 'Greenrut Monarch',
    sku: 'GR-MNR-MON',
    category: 'Men & Women',
    price: 15000,
    stock: 25,
    status: 'published',
    description: 'An intensely infused herbs for sexual performance and high libido. Solving the underlying problems of sexual weakness.',
    benefits: 'Supports healthy testosterone levels, improves stamina, enhances blood flow, and promotes sexual vitality and libido.',
    ingredients: 'Tribulus terrestris, Chasmanthera dependens (Ewe Ato) extract, Lepidium meyenii (Maca).',
    directions: 'Take 1 capsule twice daily with meals or 1 hour prior to physical activity.',
    warnings: 'For adult use only. Do not exceed recommended dosage. Seek medical advice if you have heart conditions.',
    scientificValidation: 'Controlled pre-clinical assessments demonstrated significant nitric oxide pathway modulation and enhancement of blood vessel dilation.'
  }
]

const seedLibraryItems = [
  {
    title: 'Moringa Leaf (Zogale)',
    slug: 'moringa-leaf-zogale',
    section: 'Herb Catalogue',
    type: 'Herb Card',
    localName: 'Zogale',
    therapeuticUse: 'Vitality, nutrition, immune support, blood sugar balance',
    constituents: 'Flavonoids, vitamins, minerals, glucosinolates',
    preparationMethod: 'Dried leaf powder, water infusion (tea), or standardized capsule form',
    dosage: 'Take 1-2 teaspoons of powder daily in warm water, or use according to product directions',
    excerpt: 'Moringa oleifera, locally known as Zogale, is a nutrient-dense powerhouse used traditionally and validated scientifically for vitality and metabolic balance.',
    status: 'published'
  },
  {
    title: 'Ewe Asuwon (Senna alata)',
    slug: 'ewe-asuwon-senna-alata',
    section: 'Herb Catalogue',
    type: 'Herb Card',
    localName: 'Asuwon',
    therapeuticUse: 'Skin soothing, anti-fungal, laxative, wound healing',
    constituents: 'Anthraquinones, rhein, chrysophanic acid, flavonoids',
    preparationMethod: 'Fresh leaf paste for topical application, or decoction (boiling leaves) for internal use',
    dosage: 'Apply leaf paste to skin twice daily; or drink 1/2 cup of mild tea occasionally',
    excerpt: 'Senna alata (Ewe Asuwon) is famous in traditional dermatology for treating eczema and ringworm, verified in assays for strong anti-microbial activities.',
    status: 'published'
  },
  {
    title: 'Ewe Ato (Chasmanthera dependens)',
    slug: 'ewe-ato-chasmanthera-dependens',
    section: 'Herb Catalogue',
    type: 'Herb Card',
    localName: 'Ato',
    therapeuticUse: 'Physical recovery, joint pain relief, anti-inflammatory, fracture healing',
    constituents: 'Alkaloids, columbin, tinosporaside, saponins',
    preparationMethod: 'Boil sliced stem or roots in water to make a decoction, or grind into a paste for joint poultices',
    dosage: 'Drink 1/3 cup of decoction daily, or apply paste to painful joints',
    excerpt: 'Chasmanthera dependens (Ewe Ato) is a traditional climbing shrub documented by generations for physical rehabilitation, stroke recovery, and bone mending.',
    status: 'published'
  },
  {
    title: 'Ewe Lapalapa (Jatropha curcas)',
    slug: 'ewe-lapalapa-jatropha-curcas',
    section: 'Herb Catalogue',
    type: 'Herb Card',
    localName: 'Lapalapa',
    therapeuticUse: 'Wound disinfection, skin healing, anti-septic, bleeding stop',
    constituents: 'Tannins, curcin, phorbol esters, phytosterols',
    preparationMethod: 'Extract fresh leaf sap and apply directly onto minor wounds or cuts',
    dosage: 'Apply 2-3 drops of fresh leaf sap topically',
    excerpt: 'Jatropha curcas (Ewe Lapalapa) is widely recognized for its fast-acting anti-septic sap, used to stop bleeding on fresh wounds and prevent infections.',
    status: 'published'
  }
]

async function seed() {
  console.log('Connecting to database...')
  await connectDatabase()
  console.log('Connected.')

  // Seed Products
  console.log('\n--- Seeding Products ---')
  for (const prodData of seedProducts) {
    const existing = await Product.findOne({ name: prodData.name })
    if (existing) {
      console.log(`Product "${prodData.name}" already exists, skipping.`)
    } else {
      await Product.create(prodData)
      console.log(`Created product: "${prodData.name}"`)
    }
  }

  // Seed Library Items
  console.log('\n--- Seeding Herb Library ---')
  for (const libData of seedLibraryItems) {
    const existing = await LibraryItem.findOne({ title: libData.title })
    if (existing) {
      console.log(`Library item "${libData.title}" already exists, skipping.`)
    } else {
      await LibraryItem.create(libData)
      console.log(`Created library item: "${libData.title}"`)
    }
  }

  console.log('\nDatabase seeding completed successfully.')
}

seed()
  .then(() => {
    disconnectDatabase()
    process.exit(0)
  })
  .catch((err) => {
    console.error('Error during seeding:', err)
    disconnectDatabase()
    process.exit(1)
  })
