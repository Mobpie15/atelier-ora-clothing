/**
 * ATELIER ORA // STORE CONTROLLER & SPECIFICATION ENGINE
 * 
 * Includes:
 * 1. Rich Garment Specifications & Provenance Catalog
 * 2. Product Detail / Quick-Spec Modal with Multi-Tabs & Color Swatches
 * 3. Patron Account & Bespoke Measurements Portal
 * 4. Multi-Faceted Filters (Category, Material Provenance, Price Spectrum, GSM Sort)
 * 5. Concept Demo Disclaimer Modal (Travertine / Oat Milk Luxury Aesthetic)
 * 6. Slide-Over Cart Drawer & WhatsApp Concierge Checkout
 */

(function () {
  'use strict';

  const CART_KEY = 'atelier_ora_cart';
  const DISCLAIMER_KEY = 'atelier_ora_disclaimer_dismissed';
  let cart = [];

  const PRODUCTS = [
    {
      id: 'hoodie-01',
      title: '500 GSM Heavyweight Boxy Hoodie',
      category: 'sweats',
      materialKey: 'fleece',
      material: '500 GSM Loopback Fleece',
      price: 260,
      weightGsm: 500,
      image: 'assets/images/garment-hoodie-oatmeal.jpg',
      colorName: 'Oatmeal Heather',
      badge: 'BESTSELLER // 500 GSM FLEECE',
      colors: [
        { name: 'Oatmeal Heather', hex: '#d8d1c5' },
        { name: 'Vintage Washed Olive', hex: '#5b5f49' },
        { name: 'Deep Espresso', hex: '#231f1d' },
        { name: 'Terracotta Clay', hex: '#9d5d47' },
        { name: 'Warm Camel', hex: '#b8946e' }
      ],
      sizes: ['S (US 36)', 'M (US 38)', 'L (US 40)', 'XL (US 42)'],
      composition: '100% Combed Long-Staple Organic Cotton (500 GSM)',
      provenance: 'Milled & knit in Guimar\u00e3es, Portugal. Garment-dyed with low-impact reactive earth pigments.',
      silhouette: 'Architectural boxy cut with relaxed dropped shoulders, seamless 2x2 rib cuffs, and a self-lined double-layer structured hood that stays upright without drawstrings.',
      occasion: 'Designed for daily architectural uniform, cool-weather layering, international transit, and relaxed evening rotation.',
      pairing: 'Pairs effortlessly with the Wide-Leg Pleated Tailored Trouser and Suede Chelsea Boots.',
      dispatchEstimate: 'Ready for immediate dispatch within 24 hours. Delivered worldwide in 2-3 business days via insured white-glove express courier.',
      care: 'Machine wash cold at 30\u00b0C inside out with mild neutral detergent. Reshape while damp and dry flat in shade. Do not tumble dry. Low iron if required.',
      fitAdvice: 'True to size for the signature architectural boxy drape. Size down if you prefer a traditional tailored fit.',
      measurements: [
        { size: 'S (US 36)', chest: '42.0 in', length: '26.5 in', shoulder: '21.0 in', sleeve: '24.5 in' },
        { size: 'M (US 38)', chest: '44.0 in', length: '27.5 in', shoulder: '22.0 in', sleeve: '25.0 in' },
        { size: 'L (US 40)', chest: '46.0 in', length: '28.5 in', shoulder: '23.0 in', sleeve: '25.5 in' },
        { size: 'XL (US 42)', chest: '48.0 in', length: '29.5 in', shoulder: '24.0 in', sleeve: '26.0 in' }
      ],
      specs: [
        { label: 'FABRIC WEIGHT', value: '500 GSM Loopback Fleece' },
        { label: 'YARN ORIGIN', value: 'Guimar\u00e3es, Northern Portugal' },
        { label: 'HOOD CONSTRUCTION', value: 'Double-Ply Self-Fabric Architecture' },
        { label: 'SHRINK RESISTANCE', value: 'Pre-washed at 60\u00b0C (0% Dimensional Shift)' },
        { label: 'HARDWARE', value: 'Seamless Drawstring-Free Neckline' },
        { label: 'COURIER PACKAGING', value: 'Heavyweight Dust Bag Included' }
      ],
      has3DPreview: true
    },
    {
      id: 'bomber-02',
      title: 'Washed Canvas Flight Bomber Jacket',
      category: 'outerwear',
      materialKey: 'canvas',
      material: 'Washed Cotton Canvas',
      price: 420,
      weightGsm: 440,
      image: 'assets/images/garment-bomber-olive.jpg',
      colorName: 'Vintage Olive',
      badge: 'LIMITED EDITION // ENZYME PATINA',
      colors: [
        { name: 'Vintage Olive', hex: '#545942' },
        { name: 'Washed Obsidian', hex: '#222224' },
        { name: 'Desert Sand Khaki', hex: '#c5b79d' }
      ],
      sizes: ['M (US 38)', 'L (US 40)', 'XL (US 42)'],
      composition: '100% Heavyweight Cotton Duck Canvas (440 GSM) with Quilted Japanese Cupro Lining',
      provenance: 'Woven in Okayama, Japan. Hand-assembled and enzyme-washed in Porto, Portugal for a subtle broken-in patina.',
      silhouette: 'Classic MA-1 tactical flight silhouette with dropped shoulders, slightly cropped waist ribbing, and heavy 2x2 wool-blend ribbed collar.',
      occasion: 'Autumn / Winter statement outerwear, transitional weather, gallery openings, and urban evening travel.',
      pairing: 'Layers cleanly over the 280 GSM Boxy Drop-Shoulder Tee with double-pleated trousers.',
      dispatchEstimate: 'In stock. Hand-checked and dispatched within 24 hours via express priority airfreight.',
      care: 'Specialist dry clean only to maintain the enzyme-washed canvas patina and quilted cupro lining.',
      fitAdvice: 'Boxy chest with high-hip cropped finish. Order your regular jacket size for intended outerwear fit.',
      measurements: [
        { size: 'M (US 38)', chest: '45.0 in', length: '25.5 in', shoulder: '21.5 in', sleeve: '25.0 in' },
        { size: 'L (US 40)', chest: '47.0 in', length: '26.5 in', shoulder: '22.5 in', sleeve: '25.5 in' },
        { size: 'XL (US 42)', chest: '49.0 in', length: '27.5 in', shoulder: '23.5 in', sleeve: '26.0 in' }
      ],
      specs: [
        { label: 'CANVAS DENSITY', value: '440 GSM Duck Canvas' },
        { label: 'INTERIOR LINING', value: '100% Japanese Bemberg Cupro' },
        { label: 'MAIN CLOSURE', value: 'Solid Brushed Silver Riri 2-Way Zip' },
        { label: 'STORM COLLAR', value: '100% Merino Wool 2x2 Rib' },
        { label: 'POCKETS', value: '2 Exterior Welt Pockets, 2 Concealed Interior' },
        { label: 'WASH TREATMENT', value: 'Subtle Stone & Enzyme Bath' }
      ],
      has3DPreview: false
    },
    {
      id: 'trench-03',
      title: 'Double-Breasted Heavy Wool Overcoat',
      category: 'outerwear',
      materialKey: 'wool',
      material: '850 GSM Italian Virgin Wool',
      price: 780,
      weightGsm: 850,
      image: 'assets/images/garment-trench-camel.jpg',
      colorName: 'Warm Camel',
      badge: 'ITALIAN VIRGIN WOOL // 850 GSM',
      colors: [
        { name: 'Warm Camel', hex: '#b6926b' },
        { name: 'Deep Espresso', hex: '#26201a' },
        { name: 'Midnight Charcoal', hex: '#1c1e22' }
      ],
      sizes: ['48 / M', '50 / L', '52 / XL'],
      composition: '100% Italian Virgin Wool Melton (850 GSM) with Bemberg Cupro Full Lining',
      provenance: 'Woven by Lanificio di Pray in Biella, Northern Italy. Tailored with hand-sewn floating canvas interlining in Tuscany.',
      silhouette: 'Grand double-breasted overcoat silhouette with broad peaked lapels, deep angled hand-warmer welt pockets, and a full self-fabric waist belt with horn buckle.',
      occasion: 'Formal architectural occasions, winter travel, client presentations, and evening dining.',
      pairing: 'Engineered to layer seamlessly over our 500 GSM Boxy Hoodie or tailored suiting.',
      dispatchEstimate: 'Dispatches within 24 hours. Includes complimentary engraved solid wood hangar and heavy breathable cotton garment travel bag.',
      care: 'Specialist dry clean only. Steam refresh recommended between wears.',
      fitAdvice: 'Cut with generous outerwear ease to comfortably fit heavy loopback hoodies or blazers underneath.',
      measurements: [
        { size: '48 / M', chest: '46.0 in', length: '46.0 in', shoulder: '20.5 in', sleeve: '26.0 in' },
        { size: '50 / L', chest: '48.0 in', length: '47.0 in', shoulder: '21.5 in', sleeve: '26.5 in' },
        { size: '52 / XL', chest: '50.0 in', length: '48.0 in', shoulder: '22.5 in', sleeve: '27.0 in' }
      ],
      specs: [
        { label: 'FABRIC WEIGHT', value: '850 GSM Wool Melton' },
        { label: 'MILL PROVENANCE', value: 'Lanificio di Pray, Biella, Italy' },
        { label: 'BUTTONS', value: 'Hand-Carved Genuine Buffalo Horn' },
        { label: 'CONSTRUCTION', value: 'Full Floating Horsehair Canvas' },
        { label: 'LAPEL SPEC', value: '11.5cm Architectural Peak' },
        { label: 'TRAVEL ACCESSORY', value: 'Custom Canvas Garment Bag' }
      ],
      has3DPreview: false
    },
    {
      id: 'tee-04',
      title: '280 GSM Boxy Drop-Shoulder Tee',
      category: 'tees',
      materialKey: 'jersey',
      material: '280 GSM Single Jersey',
      price: 110,
      weightGsm: 280,
      image: 'assets/images/garment-tee-charcoal.jpg',
      colorName: 'Vintage Washed Black',
      badge: 'EVERYDAY UNIFORM // 280 GSM',
      colors: [
        { name: 'Vintage Washed Black', hex: '#2c2b29' },
        { name: 'Oatmeal Milk', hex: '#d9d3c7' },
        { name: 'Raw Bone White', hex: '#ebe7de' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      composition: '100% Long-Staple Combed Organic Cotton (280 GSM)',
      provenance: 'Knit and pigment-washed in Barcelos, Portugal using natural botanical dyes.',
      silhouette: 'Relaxed boxy silhouette with elongated short sleeves, dropped shoulders, and a heavy 32mm reinforced double-needle ribbed collar that never sags.',
      occasion: 'Essential year-round foundational uniform, casual studio work, and understated warm-weather wear.',
      pairing: 'Pairs directly beneath the Washed Canvas Flight Bomber or tucks neatly into Wide-Leg Tailored Trousers.',
      dispatchEstimate: 'In stock. Shipped within 24 hours in biodegradable glassine packaging.',
      care: 'Machine wash cold at 30\u00b0C. Hang dry in shade. Pre-shrunk to retain its boxy proportions wash after wash.',
      fitAdvice: 'Relaxed oversized boxy cut. Select your standard size for the intended drape.',
      measurements: [
        { size: 'S', chest: '43.0 in', length: '28.0 in', shoulder: '21.0 in', sleeve: '9.5 in' },
        { size: 'M', chest: '45.0 in', length: '29.0 in', shoulder: '22.0 in', sleeve: '10.0 in' },
        { size: 'L', chest: '47.0 in', length: '30.0 in', shoulder: '23.0 in', sleeve: '10.5 in' },
        { size: 'XL', chest: '49.0 in', length: '31.0 in', shoulder: '24.0 in', sleeve: '11.0 in' }
      ],
      specs: [
        { label: 'FABRIC WEIGHT', value: '280 GSM Heavy Jersey' },
        { label: 'COLLAR PROFILE', value: '32mm Reinforced 1x1 Rib' },
        { label: 'STITCHING', value: 'Twin-Needle Flatlock Throughout' },
        { label: 'DYE PROCESS', value: 'Sun-Faded Vintage Pigment Wash' },
        { label: 'SHRINKAGE', value: 'Zero (Industrial Pre-Washed)' }
      ],
      has3DPreview: false
    },
    {
      id: 'trouser-05',
      title: 'Wide-Leg Pleated Tailored Trouser',
      category: 'trousers',
      materialKey: 'tropical',
      material: 'High-Twist Tropical Wool',
      price: 320,
      weightGsm: 310,
      image: 'assets/images/garment-trouser-espresso.jpg',
      colorName: 'Deep Espresso',
      badge: 'RAW ARCHITECTURE // DOUBLE PLEATS',
      colors: [
        { name: 'Deep Espresso', hex: '#211d1a' },
        { name: 'Travertine Chalk', hex: '#d6cfc3' },
        { name: 'Midnight Charcoal', hex: '#1e2023' }
      ],
      sizes: ['30 (S)', '32 (M)', '34 (L)', '36 (XL)'],
      composition: '100% High-Twist Tropical Wool (310 GSM)',
      provenance: 'Tailored in Varese, Northern Italy with internal curtain waistband construction.',
      silhouette: 'High-rise architectural waist, deep double forward pleats, extended tab waistband with concealed closure, and a straight, generous wide-leg drape.',
      occasion: 'Tailored architectural uniform, fine dining, international travel, creative office environments.',
      pairing: 'Coordinates with the 500 GSM Boxy Hoodie or Double-Breasted Wool Overcoat and Suede Chelsea Boots.',
      dispatchEstimate: 'Dispatched within 24 hours. Includes 2 inches of internal hem let-out allowance for custom tailoring.',
      care: 'Specialist dry clean or light hand steaming only.',
      fitAdvice: 'High-rise fit through the natural waist, opening into a relaxed wide straight leg.',
      measurements: [
        { size: '30 (S)', waist: '30.5 in', rise: '13.0 in', inseam: '31.0 in', legOpening: '21.0 in' },
        { size: '32 (M)', waist: '32.5 in', rise: '13.5 in', inseam: '31.5 in', legOpening: '21.5 in' },
        { size: '34 (L)', waist: '34.5 in', rise: '14.0 in', inseam: '32.0 in', legOpening: '22.0 in' },
        { size: '36 (XL)', waist: '36.5 in', rise: '14.5 in', inseam: '32.5 in', legOpening: '22.5 in' }
      ],
      specs: [
        { label: 'FABRIC WEIGHT', value: '310 GSM High-Twist Wool' },
        { label: 'PLEAT DESIGN', value: 'Double Forward Architectural Pleats' },
        { label: 'WAISTBAND', value: 'Concealed Hook-and-Bar with Side Tabs' },
        { label: 'POCKETS', value: 'Deep Slanted Pockets, 2 Rear Jet Pockets' },
        { label: 'HEM ALLOWANCE', value: '5cm / 2-inch Internal Let-Out' }
      ],
      has3DPreview: false
    },
    {
      id: 'boots-06',
      title: 'Hand-Burnished Suede Chelsea Boots',
      category: 'footwear',
      materialKey: 'suede',
      material: 'Italian Hydro Calf Suede',
      price: 450,
      weightGsm: 900,
      image: 'assets/images/garment-boots-suede.jpg',
      colorName: 'Sand Almond',
      badge: 'HANDCRAFTED IN ITALY // CREPE SOLE',
      colors: [
        { name: 'Sand Almond', hex: '#c5b196' },
        { name: 'Espresso Brown Suede', hex: '#3e3128' },
        { name: 'Obsidian Black Suede', hex: '#19191b' }
      ],
      sizes: ['EU 41 / US 8', 'EU 42 / US 9', 'EU 43 / US 10', 'EU 44 / US 11'],
      composition: '100% Water-Repellent Tuscan Calf Suede, Full Calfskin Lining, 100% Natural Plantation Crepe Sole',
      provenance: 'Hand-lasted and bench-made in Civitanova Marche, Italy.',
      silhouette: 'Clean architectural almond toe silhouette with tonally matched heavy elastic side gussets, blake-stitched construction, and reinforced double grosgrain pull tabs.',
      occasion: 'All-season footwear rotation, urban walking, long-haul travel, and casual tailored evenings.',
      pairing: 'The natural foundation for the Wide-Leg Pleated Tailored Trouser.',
      dispatchEstimate: 'In stock. Ships in custom debossed collector box with individual cotton flannel shoe bags.',
      care: 'Treated with water-repellent protection. Maintain with brass suede brush and natural crepe eraser.',
      fitAdvice: 'True to standard European dress shoe sizing. If between sizes, choose the smaller size.',
      measurements: [
        { size: 'EU 41 / US 8', insole: '26.8 cm', width: 'Medium D', shaftHeight: '14.5 cm' },
        { size: 'EU 42 / US 9', insole: '27.5 cm', width: 'Medium D', shaftHeight: '15.0 cm' },
        { size: 'EU 43 / US 10', insole: '28.2 cm', width: 'Medium D', shaftHeight: '15.5 cm' },
        { size: 'EU 44 / US 11', insole: '29.0 cm', width: 'Medium D', shaftHeight: '16.0 cm' }
      ],
      specs: [
        { label: 'UPPER LEATHER', value: 'Tuscan Hydro Calf Suede' },
        { label: 'OUTSOLE', value: '100% Natural Plantation Crepe' },
        { label: 'CONSTRUCTION', value: 'Blake Stitched (Fully Recraftable)' },
        { label: 'LINING', value: 'Vegetable-Tanned Italian Calfskin' },
        { label: 'ORIGIN', value: 'Civitanova Marche, Italy' }
      ],
      has3DPreview: false
    },
    {
      id: 'dress-07',
      title: 'Bias-Cut Pleated Silk Evening Maxi Dress',
      category: 'dresses',
      materialKey: 'silk',
      material: '32 Momme Mulberry Silk',
      price: 640,
      weightGsm: 140,
      image: 'assets/images/garment-dress-silk.jpg',
      colorName: 'Obsidian Black Silk',
      badge: 'HAUTE COUTURE // 32 MOMME SILK',
      colors: [
        { name: 'Obsidian Black Silk', hex: '#161618' },
        { name: 'Travertine Champagne', hex: '#d9cdb8' }
      ],
      sizes: ['FR 36 / US 4', 'FR 38 / US 6', 'FR 40 / US 8', 'FR 42 / US 10'],
      composition: '100% Mulberry Crepe de Chine Silk (32 Momme)',
      provenance: 'Woven in Como, Italy. Hand-pleated and finished with rolled edges in Lyon, France.',
      silhouette: 'High halter neckline with architectural micro-pleating through the bodice, cascading into an asymmetrical bias-cut handkerchief maxi hem with undulating fluid movement.',
      occasion: 'Black-tie architectural galas, opera evenings, high-summer private receptions, and trans-seasonal couture styling.',
      pairing: 'Styled in harmony with our Double-Breasted Wool Overcoat and Handcrafted Leather Derby.',
      dispatchEstimate: 'Dispatched within 24 hours in archival garment box with acid-free tissue and scented cedar sachet.',
      care: 'Specialist dry clean only. Cool reverse iron under silk press cloth.',
      fitAdvice: 'Cut on the true 45-degree bias for a body-skimming contour. Order your standard French / US dress size.',
      measurements: [
        { size: 'FR 36 / US 4', chest: '33.0 in', length: '53.0 in', shoulder: '14.0 in', sleeve: 'Sleeveless' },
        { size: 'FR 38 / US 6', chest: '35.0 in', length: '54.0 in', shoulder: '14.5 in', sleeve: 'Sleeveless' },
        { size: 'FR 40 / US 8', chest: '37.0 in', length: '55.0 in', shoulder: '15.0 in', sleeve: 'Sleeveless' },
        { size: 'FR 42 / US 10', chest: '39.0 in', length: '56.0 in', shoulder: '15.5 in', sleeve: 'Sleeveless' }
      ],
      specs: [
        { label: 'SILK GRADE', value: 'Grade 6A 100% Mulberry Silk' },
        { label: 'FABRIC DENSITY', value: '32 Momme Crepe de Chine' },
        { label: 'HEM CONSTRUCTION', value: 'Hand-Rolled French Edge' },
        { label: 'WEAVE PROVENANCE', value: 'Lake Como, Northern Italy' },
        { label: 'PLEATING ATELIER', value: 'Lyon, France' },
        { label: 'CLOSURE', value: 'Concealed Hand-Sewn Riri Zip' }
      ],
      has3DPreview: false
    },
    {
      id: 'derby-08',
      title: 'Hand-Welted Goodyear Leather Derby',
      category: 'footwear',
      materialKey: 'leather',
      material: 'French Box Calf Leather',
      price: 520,
      weightGsm: 880,
      image: 'assets/images/garment-derby-leather.jpg',
      colorName: 'Polished Black Noir',
      badge: 'GOODYEAR WELTED // DAINITE SOLE',
      colors: [
        { name: 'Polished Black Noir', hex: '#111112' },
        { name: 'Espresso Patina', hex: '#2b211a' }
      ],
      sizes: ['EU 41 / US 8', 'EU 42 / US 9', 'EU 43 / US 10', 'EU 44 / US 11'],
      composition: '100% French Box Calf Full-Grain Leather, Vegetable-Tanned Lining, British Studded Rubber Dainite Outsole',
      provenance: 'Hand-lasted and Goodyear-welted in Northamptonshire, England.',
      silhouette: 'Classic 5-eyelet plain-toe derby with 360-degree storm welt, double-stitched perimeter, custom brass-turned shoe tree, and high-density British studded rubber sole.',
      occasion: 'All-weather formal occasions, architectural practice, international business, and sharp evening dining.',
      pairing: 'Complements both the Wide-Leg Pleated Tailored Trouser and the Double-Breasted Wool Overcoat.',
      dispatchEstimate: 'In stock. Includes handcrafted cedar shoe trees, cotton flannel dust covers, and spare waxed laces.',
      care: 'Condition regularly with beeswax leather balm and buff with horsehair brush.',
      fitAdvice: 'True to English dress shoe sizing (Medium F width). If between sizes, size down by half size.',
      measurements: [
        { size: 'EU 41 / US 8', insole: '26.8 cm', length: 'Medium E', shoulder: '-', sleeve: '-' },
        { size: 'EU 42 / US 9', insole: '27.5 cm', length: 'Medium E', shoulder: '-', sleeve: '-' },
        { size: 'EU 43 / US 10', insole: '28.2 cm', length: 'Medium E', shoulder: '-', sleeve: '-' },
        { size: 'EU 44 / US 11', insole: '29.0 cm', length: 'Medium E', shoulder: '-', sleeve: '-' }
      ],
      specs: [
        { label: 'UPPER LEATHER', value: 'French Full-Grain Box Calf' },
        { label: 'CONSTRUCTION', value: '360° Goodyear Storm Welt' },
        { label: 'OUTSOLE', value: 'British Studded Dainite Rubber' },
        { label: 'ORIGIN', value: 'Northamptonshire, England' },
        { label: 'HARDWARE', value: 'Solid Brass Last Turn' },
        { label: 'RESOLABILITY', value: 'Unlimited Recrafting Life' }
      ],
      has3DPreview: false
    },
    {
      id: 'scarf-09',
      title: 'Brushed Cashmere Blanket Fringe Scarf',
      category: 'accessories',
      materialKey: 'cashmere',
      material: '460 GSM Mongolian Cashmere',
      price: 280,
      weightGsm: 460,
      image: 'assets/images/garment-scarf-oatmeal.jpg',
      colorName: 'Oatmeal Cream',
      badge: 'PURE CASHMERE // 460 GSM',
      colors: [
        { name: 'Oatmeal Cream', hex: '#cfc5b4' },
        { name: 'Slate Aegean', hex: '#506e8e' }
      ],
      sizes: ['One Size (210cm x 75cm)'],
      composition: '100% Grade A Mongolian Cashmere (460 GSM)',
      provenance: 'Combed by nomadic herders in Inner Mongolia. Spun and brushed with organic teasels in Elgin, Scotland.',
      silhouette: 'Generous oversized architectural blanket proportions with hand-twisted fringed ends and whisper-soft brushed ripple fleece finish.',
      occasion: 'Trans-seasonal layering, high-altitude travel, cool-weather architectural strolls, and evening warmth.',
      pairing: 'Styled harmoniously over the Double-Breasted Wool Overcoat or Washed Canvas Flight Bomber.',
      dispatchEstimate: 'In stock. Hand-wrapped in cedar tissue within our bespoke hard-shell luxury presentation box.',
      care: 'Specialist dry clean or delicate hand wash with organic cashmere wash. Dry flat in shade.',
      fitAdvice: 'Substantial 210cm length engineered for double wrap or loose architectural drape.',
      measurements: [
        { size: 'One Size', chest: '75.0 cm', length: '210.0 cm', shoulder: '-', sleeve: '10cm Fringe' }
      ],
      specs: [
        { label: 'CASHMERE GRADE', value: 'Grade A 100% White Mongolian Cashmere' },
        { label: 'FINISH TECHNIQUE', value: 'Natural Teasel Ripple Brushed' },
        { label: 'DIMENSIONS', value: '210 cm x 75 cm / 82" x 30"' },
        { label: 'MILL ATELIER', value: 'Elgin, Highlands of Scotland' },
        { label: 'WEIGHT DENSITY', value: '460 GSM Pure Cashmere' }
      ],
      has3DPreview: false
    },
    {
      id: 'denim-10',
      title: '14.5oz Architectural Raw Selvedge Denim',
      category: 'trousers',
      materialKey: 'denim',
      material: '14.5oz Okayama Selvedge Denim',
      price: 340,
      weightGsm: 490,
      image: 'assets/images/garment-denim-obsidian.jpg',
      colorName: 'Washed Obsidian',
      badge: 'RAW SELVEDGE // 14.5 OZ',
      colors: [
        { name: 'Washed Obsidian', hex: '#202022' },
        { name: 'Kurashiki Indigo', hex: '#1b263b' }
      ],
      sizes: ['30 (S)', '32 (M)', '34 (L)', '36 (XL)'],
      composition: '100% Long-Staple Zimbabwe Cotton (14.5oz / 490 GSM), Solid Iron Button Fly',
      provenance: 'Shuttle-loomed in Kojima, Kurashiki, Okayama Prefecture, Japan on vintage 1950s Toyoda shuttle looms.',
      silhouette: 'Curved architectural 3D ergonomic cut with twisted side seams, custom front utility jet pockets, and clean pink selvedge ID at the outseam cuff.',
      occasion: 'Everyday architectural uniform, studio design sessions, trans-seasonal rotation, and rugged high-fashion styling.',
      pairing: 'Anchors perfectly with the 280 GSM Boxy Drop-Shoulder Tee and Hand-Burnished Suede Chelsea Boots.',
      dispatchEstimate: 'Dispatches within 24 hours. Includes custom selvedge cotton tote and Japanese denim care guide.',
      care: 'Soak inside out in cold water with low agitation. Hang dry in shade. Avoid machine tumble drying.',
      fitAdvice: 'Mid-rise with articulated ergonomic leg. True to size; will conform and mold to patron anatomy over wears.',
      measurements: [
        { size: '30 (S)', waist: '30.5 in', rise: '11.5 in', inseam: '32.0 in', legOpening: '18.0 in' },
        { size: '32 (M)', waist: '32.5 in', rise: '12.0 in', inseam: '32.5 in', legOpening: '18.5 in' },
        { size: '34 (L)', waist: '34.5 in', rise: '12.5 in', inseam: '33.0 in', legOpening: '19.0 in' },
        { size: '36 (XL)', waist: '36.5 in', rise: '13.0 in', inseam: '33.5 in', legOpening: '19.5 in' }
      ],
      specs: [
        { label: 'DENIM WEIGHT', value: '14.5 oz / 490 GSM Rigid Selvedge' },
        { label: 'LOOM SPEC', value: 'Vintage 1950s Toyoda Shuttle Loom' },
        { label: 'COTTON YARN', value: '100% Zimbabwe Long-Staple Cotton' },
        { label: 'ORIGIN', value: 'Kojima, Okayama Prefecture, Japan' },
        { label: 'HARDWARE', value: 'Blackened Solid Iron Atelier Button Fly' },
        { label: 'SELVEDGE ID', value: 'Signature Pink & White Ticking' }
      ],
      has3DPreview: false
    },
    {
      id: 'shirt-11',
      title: 'Raw Silk Camp-Collar Boxy Overshirt',
      category: 'tees',
      materialKey: 'silk-noil',
      material: '220 GSM Raw Silk Noil',
      price: 290,
      weightGsm: 220,
      image: 'assets/images/garment-shirt-silk.jpg',
      colorName: 'Raw Silk Cream',
      badge: 'RAW SILK NOIL // 220 GSM',
      colors: [
        { name: 'Raw Silk Cream', hex: '#fae8dc' },
        { name: 'Charcoal Noir', hex: '#3b3d40' }
      ],
      sizes: ['S (US 36)', 'M (US 38)', 'L (US 40)', 'XL (US 42)'],
      composition: '100% Mulberry Silk Noil Raw Weave (220 GSM), Mother-of-Pearl Button Closures',
      provenance: 'Spun from pure mulberry silk noil in Kyoto, Japan. Tailored with French flat-felled seams in Como, Italy.',
      silhouette: 'Relaxed boxy silhouette with relaxed camp/cuban collar, cuffed elbow sleeves, hidden placket option, and curved architectural split hem.',
      occasion: 'High-summer editorial styling, coastal evenings, gallery receptions, and lightweight trans-seasonal layering.',
      pairing: 'Wears open over the 280 GSM Boxy Tee or closed with the Wide-Leg Pleated Tailored Trouser.',
      dispatchEstimate: 'In stock. Dispatches in 24 hours in breathable organic cotton travel envelope.',
      care: 'Hand wash cold or gentle machine silk cycle at 30°C. Dry flat in shade. Low steam iron on reverse.',
      fitAdvice: 'Relaxed boxy chest drape. Select regular size for signature casual luxury volume.',
      measurements: [
        { size: 'S (US 36)', chest: '43.0 in', length: '27.0 in', shoulder: '20.5 in', sleeve: '11.0 in' },
        { size: 'M (US 38)', chest: '45.0 in', length: '28.0 in', shoulder: '21.5 in', sleeve: '11.5 in' },
        { size: 'L (US 40)', chest: '47.0 in', length: '29.0 in', shoulder: '22.5 in', sleeve: '12.0 in' },
        { size: 'XL (US 42)', chest: '49.0 in', length: '30.0 in', shoulder: '23.5 in', sleeve: '12.5 in' }
      ],
      specs: [
        { label: 'FABRIC YARN', value: '100% Mulberry Silk Noil Slub' },
        { label: 'WEIGHT', value: '220 GSM Textured Breathable Silk' },
        { label: 'COLLAR CUT', value: 'Cuban / Camp Architectural Open Collar' },
        { label: 'BUTTONS', value: 'Hand-Cut Smoked Mother-of-Pearl' },
        { label: 'SEAM FINISH', value: 'Single-Needle French Flat-Felled' },
        { label: 'WEAVE ATELIER', value: 'Kyoto, Japan & Lake Como, Italy' }
      ],
      has3DPreview: false
    },
    {
      id: 'knit-12',
      title: 'Heavyweight Shetland Wool Shooting Sweater',
      category: 'sweats',
      materialKey: 'tweed',
      material: '680 GSM Shetland Wool Tweed',
      price: 460,
      weightGsm: 680,
      image: 'assets/images/garment-knit-espresso.jpg',
      colorName: 'Espresso Earth Tweed',
      badge: 'SHETLAND TWEED // CALFSKIN PATCHES',
      colors: [
        { name: 'Espresso Earth Tweed', hex: '#48342e' },
        { name: 'Charcoal Heather Tweed', hex: '#2f3235' }
      ],
      sizes: ['M (US 38)', 'L (US 40)', 'XL (US 42)'],
      composition: '100% Pure Virgin Shetland Wool (680 GSM) with Tuscan Vegetable-Tanned Calfskin Patches',
      provenance: 'Yarn spun and knitted in the Scottish Highlands. Shoulder and elbow calfskin patches hand-stitched in Civitanova Marche, Italy.',
      silhouette: 'Substantial chunky crewneck silhouette with reinforced asymmetrical calfskin gun patch at the right shoulder, matched elbow patches, and heavy 2x2 rib collar and cuffs.',
      occasion: 'Winter field expeditions, Highland architecture retreats, cold-weather fireside evenings, and rustic luxury tailoring.',
      pairing: 'Complements the 14.5oz Architectural Raw Selvedge Denim or Wide-Leg Tailored Trousers.',
      dispatchEstimate: 'In stock. Hand-finished and dispatched within 24 hours with custom cedarwood moth-protection blocks.',
      care: 'Hand wash cold using wool shampoo or specialist dry clean. Reshape damp and dry flat away from direct heat.',
      fitAdvice: 'Substantial heavyweight fit with room for a collared shirt underneath. Choose your normal knitwear size.',
      measurements: [
        { size: 'M (US 38)', chest: '44.0 in', length: '27.0 in', shoulder: '21.0 in', sleeve: '25.0 in' },
        { size: 'L (US 40)', chest: '46.0 in', length: '28.0 in', shoulder: '22.0 in', sleeve: '25.5 in' },
        { size: 'XL (US 42)', chest: '48.0 in', length: '29.0 in', shoulder: '23.0 in', sleeve: '26.0 in' }
      ],
      specs: [
        { label: 'KNIT DENSITY', value: '680 GSM 5-Gauge Heavyweight' },
        { label: 'YARN ORIGIN', value: '100% Shetland Isles Virgin Wool' },
        { label: 'LEATHER ACCENTS', value: 'Full-Grain Tuscan Calfskin Patches' },
        { label: 'WEAVE PATTERN', value: 'Subtle Broken Herringbone Check' },
        { label: 'HAND FEEL', value: 'Dry, Robust, Extremely Insulative' },
        { label: 'KNIT ATELIER', value: 'Highlands, Scotland & Marche, Italy' }
      ],
      has3DPreview: false
    }
  ];

  // DOM Elements
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const checkoutBtn = document.getElementById('btn-checkout');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutModalClose = document.getElementById('checkout-modal-close');

  // New Modals DOM
  const productModal = document.getElementById('product-detail-modal');
  const productModalBody = document.getElementById('product-modal-body');
  const accountModal = document.getElementById('account-portal-modal');
  const headerAccountBtn = document.getElementById('header-account-btn');
  const mobileDockAccountBtn = document.getElementById('mobile-dock-account-btn');
  const demoDisclaimerModal = document.getElementById('demo-disclaimer-modal');

  // Filters DOM
  const categoryPills = document.querySelectorAll('.cat-filter-btn');
  const materialSelect = document.getElementById('filter-material');
  const priceSelect = document.getElementById('filter-price');
  const sortSelect = document.getElementById('filter-sort');
  const catalogCountBadge = document.getElementById('catalog-count-badge');
  const productCards = document.querySelectorAll('.garment-card');

  let currentModalProductId = null;
  let activeModalSelectedColor = null;

  // Load Saved Cart
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {}
    updateCartUI();
  }

  function updateCartUI() {
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    cartCountBadges.forEach(b => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = '$' + subtotal.toLocaleString('en-US');
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state font-mono">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p>YOUR APPAREL BAG IS EMPTY</p>
          <span>Select garments from the collection or configure in 3D studio.</span>
        </div>
      `;
      return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item-row" data-id="${item.id}" data-size="${item.size}">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-head">
            <h4 class="cart-item-title font-display">${item.title}</h4>
            <span class="cart-item-price font-mono">$${(item.price * item.quantity).toLocaleString('en-US')}</span>
          </div>
          <div class="cart-item-meta font-mono">
            <span>SIZE: ${item.size}</span>
            <span>&bull;</span>
            <span>COLOR: ${item.colorName || 'ORIGINAL'}</span>
          </div>
          <div class="cart-item-actions font-mono">
            <div class="qty-stepper">
              <button type="button" class="btn-qty-dec" data-id="${item.id}" data-size="${item.size}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="btn-qty-inc" data-id="${item.id}" data-size="${item.size}">+</button>
            </div>
            <button type="button" class="btn-remove-item" data-id="${item.id}" data-size="${item.size}">REMOVE</button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach qty listeners
    cartItemsContainer.querySelectorAll('.btn-qty-dec').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        const item = cart.find(i => i.id === id && i.size === size);
        if (item) {
          if (item.quantity > 1) {
            item.quantity--;
          } else {
            cart = cart.filter(i => !(i.id === id && i.size === size));
          }
          saveCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.btn-qty-inc').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        const item = cart.find(i => i.id === id && i.size === size);
        if (item) {
          item.quantity++;
          saveCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        cart = cart.filter(i => !(i.id === id && i.size === size));
        saveCart();
      });
    });
  }

  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartToggleBtns.forEach(b => b.addEventListener('click', openCart));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Add Product from Catalog Card
  window.addToCart = function (productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const sizeSelect = document.getElementById(`size-${productId}`);
    const chosenSize = sizeSelect ? sizeSelect.value : (product.sizes[0] || 'M');

    const existing = cart.find(item => item.id === productId && item.size === chosenSize);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        colorName: product.colorName,
        size: chosenSize,
        quantity: 1
      });
    }

    saveCart();
    openCart();
  };

  // Add Configured 3D Garment from 3D Studio (reads live studio selection)
  window.addConfigured3DGarment = function () {
    const studio = window.__studioModel || { id: 'hoodie', title: '500 GSM Heavyweight Boxy Hoodie', price: 260, image: 'assets/images/garment-hoodie-oatmeal.jpg', colorId: 'oatmeal', colorLabels: { oatmeal: 'Oatmeal Heather' } };
    const ctaBtn = document.getElementById('btn-add-3d-garment');
    const color = (ctaBtn ? ctaBtn.getAttribute('data-color') : studio.colorId) || studio.colorId;
    const sizeSelect = document.getElementById('select-3d-size');
    const chosenSize = sizeSelect && sizeSelect.value ? sizeSelect.value : 'L (US 40)';

    const configId = `3d-${studio.id}-${color}`;
    const existing = cart.find(item => item.id === configId && item.size === chosenSize);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: configId,
        title: `3D Custom ${studio.title} (${(studio.colorLabels || {})[color] || color})`,
        price: studio.price,
        image: studio.image,
        colorName: (studio.colorLabels || {})[color] || color,
        size: chosenSize,
        quantity: 1
      });
    }

    saveCart();
    openCart();
  };

  // =========================================================================
  // DETAILED PRODUCT SPECIFICATION MODAL LOGIC
  // =========================================================================
  window.openProductModal = function (productId) {
    window.location.href = 'product.html?id=' + encodeURIComponent(productId);
    return;
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !productModal || !productModalBody) return;

    currentModalProductId = productId;
    activeModalSelectedColor = product.colorName;

    // Generate color swatches HTML
    const colorSwatchesHtml = product.colors.map((c, idx) => `
      <button type="button" class="modal-swatch-btn ${idx === 0 ? 'active' : ''}" 
        data-color-name="${c.name}" 
        style="background: ${c.hex};" 
        title="${c.name}"
        onclick="window.selectModalColor('${c.name}', this)">
      </button>
    `).join('');

    // Generate measurements rows
    const measurementRowsHtml = product.measurements.map(m => `
      <tr>
        <td><strong>${m.size}</strong></td>
        <td>${m.chest || m.waist || m.insole || '-'}</td>
        <td>${m.length || m.rise || m.width || '-'}</td>
        <td>${m.shoulder || m.inseam || m.shaftHeight || '-'}</td>
        <td>${m.sleeve || m.legOpening || '-'}</td>
      </tr>
    `).join('');

    // Generate specs rows
    const specsHtml = product.specs.map(s => `
      <div class="modal-spec-item font-mono">
        <span class="spec-k">${s.label}</span>
        <span class="spec-v">${s.value}</span>
      </div>
    `).join('');

    // Build modal content
    productModalBody.innerHTML = `
      <!-- Left Column: Visual Stage -->
      <div class="product-modal-visual">
        <div class="product-modal-badge font-mono">${product.badge}</div>
        <img src="${product.image}" alt="${product.title}" class="product-modal-img">
        ${product.has3DPreview ? `
          <div class="modal-3d-callout font-mono">
            <span>REAL-TIME 3D THREE.JS SIMULATION AVAILABLE</span>
            <button type="button" class="btn-link-3d" onclick="window.jumpTo3DStudio()">
              OPEN IN 3D STUDIO
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Right Column: Rich Specifications & Tabs -->
      <div class="product-modal-info">
        <div class="product-modal-header">
          <span class="section-kicker font-mono">${product.category.toUpperCase()} &bull; ${product.material.toUpperCase()}</span>
          <h2 class="product-modal-title font-display">${product.title}</h2>
          <div class="product-modal-price-row font-mono">
            <span class="product-modal-price">$${product.price} USD</span>
            <span class="product-tax-chip">COMPLIMENTARY AIRFREIGHT INCLUDED</span>
          </div>
        </div>

        <!-- Color Selection Row -->
        <div class="modal-swatches-section font-mono">
          <div class="swatches-label-row">
            <span>COLORWAY:</span>
            <strong id="modal-selected-color-label">${product.colorName}</strong>
          </div>
          <div class="modal-swatches-bar">
            ${colorSwatchesHtml}
          </div>
        </div>

        <!-- Specification Tabs -->
        <div class="modal-tabs-strip font-mono">
          <button type="button" class="modal-tab-btn active" data-tab="tab-fabric" onclick="window.switchModalTab('tab-fabric')">FABRIC &amp; PROVENANCE</button>
          <button type="button" class="modal-tab-btn" data-tab="tab-fit" onclick="window.switchModalTab('tab-fit')">SILHOUETTE &amp; SIZING</button>
          <button type="button" class="modal-tab-btn" data-tab="tab-occasion" onclick="window.switchModalTab('tab-occasion')">OCCASION &amp; STYLING</button>
          <button type="button" class="modal-tab-btn" data-tab="tab-delivery" onclick="window.switchModalTab('tab-delivery')">DISPATCH &amp; CARE</button>
        </div>

        <!-- Tab 1: Fabric & Provenance -->
        <div id="tab-fabric" class="modal-tab-pane active">
          <p class="tab-lead font-body">${product.composition}</p>
          <div class="provenance-quote font-mono">
            <span class="provenance-origin-tag">ORIGIN CERTIFICATION</span>
            <p>${product.provenance}</p>
          </div>
          <div class="modal-specs-grid">
            ${specsHtml}
          </div>
        </div>

        <!-- Tab 2: Fit & Sizing Table -->
        <div id="tab-fit" class="modal-tab-pane">
          <div class="fit-lead-box font-mono">
            <span class="fit-tag">FIT ARCHITECTURE</span>
            <p>${product.silhouette}</p>
            <div class="fit-advice-line">
              <strong>ADVICE:</strong> ${product.fitAdvice}
            </div>
          </div>
          <div class="modal-measurements-table-wrap font-mono">
            <table class="modal-measurements-table">
              <thead>
                <tr>
                  <th>SIZE</th>
                  <th>${product.category === 'footwear' ? 'INSOLE' : product.category === 'trousers' ? 'WAIST' : 'CHEST'}</th>
                  <th>${product.category === 'footwear' ? 'WIDTH' : product.category === 'trousers' ? 'RISE' : 'LENGTH'}</th>
                  <th>${product.category === 'footwear' ? 'SHAFT' : product.category === 'trousers' ? 'INSEAM' : 'SHOULDER'}</th>
                  <th>${product.category === 'trousers' ? 'LEG OPENING' : product.category === 'footwear' ? '-' : 'SLEEVE'}</th>
                </tr>
              </thead>
              <tbody>
                ${measurementRowsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 3: Occasion & Styling Notes -->
        <div id="tab-occasion" class="modal-tab-pane">
          <div class="styling-card font-body">
            <span class="font-mono styling-kicker">OCCASION PROFILE</span>
            <p class="styling-text">${product.occasion}</p>
          </div>
          <div class="pairing-card font-mono">
            <span class="pairing-kicker">SUGGESTED ENSEMBLE PAIRING</span>
            <p class="pairing-text">${product.pairing}</p>
          </div>
        </div>

        <!-- Tab 4: Dispatch & Care -->
        <div id="tab-delivery" class="modal-tab-pane">
          <div class="dispatch-telemetry-box font-mono">
            <div class="dispatch-head">
              <span class="live-dot" style="background: #25d366;"></span>
              <span>24-HOUR WHITE-GLOVE DISPATCH</span>
            </div>
            <p class="dispatch-text font-body">${product.dispatchEstimate}</p>
          </div>
          <div class="care-instructions-box font-mono">
            <span class="care-title">GARMENT LONGEVITY &amp; CARE GUIDE</span>
            <p class="care-text font-body">${product.care}</p>
          </div>
        </div>

        <!-- Purchase Action Row -->
        <div class="modal-purchase-footer">
          <div class="size-selector-wrap font-mono" style="flex: 1;">
            <label for="modal-size-select">SELECT SIZE:</label>
            <select id="modal-size-select" class="select-clean font-mono">
              ${product.sizes.map((s, idx) => `<option value="${s}" ${idx === 1 ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>

          <button type="button" class="btn-modal-add font-mono" onclick="window.addModalProductToCart()">
            <span>ADD TO BAG &bull; $${product.price}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;

    productModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeProductModal = function () {
    if (productModal) productModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.selectModalColor = function (colorName, btnEl) {
    activeModalSelectedColor = colorName;
    const label = document.getElementById('modal-selected-color-label');
    if (label) label.textContent = colorName;

    const allSwatches = document.querySelectorAll('.modal-swatch-btn');
    allSwatches.forEach(s => s.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  };

  window.switchModalTab = function (tabId) {
    const tabBtns = document.querySelectorAll('.modal-tab-btn');
    const tabPanes = document.querySelectorAll('.modal-tab-pane');

    tabBtns.forEach(b => {
      if (b.getAttribute('data-tab') === tabId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    tabPanes.forEach(p => {
      if (p.id === tabId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  };

  window.addModalProductToCart = function () {
    if (!currentModalProductId) return;
    const product = PRODUCTS.find(p => p.id === currentModalProductId);
    if (!product) return;

    const sizeSelect = document.getElementById('modal-size-select');
    const chosenSize = sizeSelect ? sizeSelect.value : (product.sizes[0] || 'M');
    const chosenColor = activeModalSelectedColor || product.colorName;

    const existing = cart.find(item => item.id === product.id && item.size === chosenSize && item.colorName === chosenColor);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        colorName: chosenColor,
        size: chosenSize,
        quantity: 1
      });
    }

    saveCart();
    closeProductModal();
    openCart();
  };

  window.jumpTo3DStudio = function () {
    closeProductModal();
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close modal on background click
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }

  // =========================================================================
  // ACCOUNT & PATRON PROFILE PORTAL MODAL
  // =========================================================================
  window.openAccountModal = function (targetTab) {
    if (!accountModal) return;
    accountModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (targetTab) {
      window.switchAccountTab(targetTab);
    }
  };

  window.closeAccountModal = function () {
    if (!accountModal) return;
    accountModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.switchAccountTab = function (tabId) {
    const tabBtns = document.querySelectorAll('.acc-tab-btn');
    const tabPanes = document.querySelectorAll('.acc-tab-pane');

    tabBtns.forEach(b => {
      if (b.getAttribute('data-tab') === tabId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    tabPanes.forEach(p => {
      if (p.id === tabId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  };

  if (headerAccountBtn) headerAccountBtn.addEventListener('click', () => openAccountModal('acc-orders'));
  if (mobileDockAccountBtn) mobileDockAccountBtn.addEventListener('click', () => openAccountModal('acc-orders'));

  if (accountModal) {
    accountModal.addEventListener('click', (e) => {
      if (e.target === accountModal) {
        closeAccountModal();
      }
    });
  }

  // =========================================================================
  // MULTI-FACETED PARAMETRIC FILTERING & SORTING
  // =========================================================================
  function applyFacetedFilters() {
    let activeCat = 'all';
    const activePill = document.querySelector('.cat-filter-btn.active');
    if (activePill) activeCat = activePill.getAttribute('data-category') || 'all';

    const materialFilter = materialSelect ? materialSelect.value : 'all';
    const priceFilter = priceSelect ? priceSelect.value : 'all';
    const sortOrder = sortSelect ? sortSelect.value : 'curated';

    let visibleCount = 0;
    const cardsArray = Array.from(document.querySelectorAll('.garment-card'));

    cardsArray.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const cardMat = card.getAttribute('data-material');
      const cardPrice = parseFloat(card.getAttribute('data-price') || '0');

      let matchesCat = (activeCat === 'all' || cardCat === activeCat);
      let matchesMat = (materialFilter === 'all' || cardMat === materialFilter);
      let matchesPrice = true;

      if (priceFilter === 'under300') matchesPrice = cardPrice < 300;
      else if (priceFilter === '300to500') matchesPrice = (cardPrice >= 300 && cardPrice <= 500);
      else if (priceFilter === 'over500') matchesPrice = cardPrice > 500;

      if (matchesCat && matchesMat && matchesPrice) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle sorting
    const grid = document.querySelector('.garments-grid');
    if (grid && sortOrder !== 'curated') {
      const sortedCards = cardsArray.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price') || '0');
        const priceB = parseFloat(b.getAttribute('data-price') || '0');
        const weightA = parseFloat(a.getAttribute('data-weight') || '0');
        const weightB = parseFloat(b.getAttribute('data-weight') || '0');

        if (sortOrder === 'price-asc') return priceA - priceB;
        if (sortOrder === 'price-desc') return priceB - priceA;
        if (sortOrder === 'weight') return weightB - weightA;
        return 0;
      });

      sortedCards.forEach(c => grid.appendChild(c));
    }

    if (catalogCountBadge) {
      catalogCountBadge.textContent = `SHOWING ${visibleCount} OF ${cardsArray.length} PIECES`;
    }
  }

  // Bind filter events
  categoryPills.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFacetedFilters();
    });
  });

  if (materialSelect) materialSelect.addEventListener('change', applyFacetedFilters);
  if (priceSelect) priceSelect.addEventListener('change', applyFacetedFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFacetedFilters);

  // =========================================================================
  // CONCEPT DEMO DISCLAIMER MODAL LOGIC (TRAVERTINE LUXURY PALETTE)
  // =========================================================================
  window.dismissFashionDisclaimer = function () {
    if (demoDisclaimerModal) {
      demoDisclaimerModal.classList.remove('open');
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem(DISCLAIMER_KEY, '1');
      } catch (e) {}
    }
  };

  function initFashionDisclaimer() {
    if (!demoDisclaimerModal) return;

    let isDismissed = false;
    try {
      isDismissed = sessionStorage.getItem(DISCLAIMER_KEY) === '1';
    } catch (e) {}

    if (!isDismissed) {
      setTimeout(() => {
        demoDisclaimerModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }, 400);
    }
  }

  if (demoDisclaimerModal) {
    demoDisclaimerModal.addEventListener('click', (e) => {
      if (e.target === demoDisclaimerModal) {
        window.dismissFashionDisclaimer();
      }
    });
  }

  // =========================================================================
  // CHECKOUT MODAL LOGIC
  // =========================================================================
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      closeCart();
      if (checkoutModal) {
        checkoutModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (checkoutModalClose) {
    checkoutModalClose.addEventListener('click', () => {
      if (checkoutModal) checkoutModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  const ORDERS_KEY = 'atelier_orders';
  function recordOrderToERP(items, subtotal) {
    try {
      const existing = localStorage.getItem(ORDERS_KEY);
      const orders = existing ? JSON.parse(existing) : [];
      const newOrder = {
        id: 'AO-' + Math.floor(1000 + Math.random() * 9000),
        customer: 'Julian Vance',
        email: 'j.vance@oberoigroup.com',
        items: items.map(i => `${i.title} (${i.size}) x${i.quantity}`).join(', '),
        total: subtotal,
        destination: 'New Delhi, India',
        status: 'processing',
        date: 'Just now'
      };
      orders.unshift(newOrder);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {}
  }

  const btnCheckoutWA = document.getElementById('btn-checkout-wa');
  if (btnCheckoutWA) {
    btnCheckoutWA.addEventListener('click', () => {
      const orderSummary = cart.map(i => `• ${i.title} (${i.size}) x${i.quantity} = $${(i.price * i.quantity).toLocaleString('en-US')}`).join('\n');
      const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
      recordOrderToERP(cart, subtotal);
      const text = encodeURIComponent(
        `Hello Atelier Ora Concierge! I would like to order:\n\n${orderSummary}\n\nSubtotal: $${subtotal.toLocaleString('en-US')} USD\n\nPlease confirm delivery routing.`
      );
      window.open(`https://wa.me/918957420306?text=${text}`, '_blank');
    });
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (demoDisclaimerModal && demoDisclaimerModal.classList.contains('open')) {
        window.dismissFashionDisclaimer();
        return;
      }
      closeCart();
      closeProductModal();
      closeAccountModal();
      if (checkoutModal) checkoutModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Attach click listeners to catalog cards to open Product Modal
  function bindCardListeners() {
    document.querySelectorAll('.garment-card').forEach(card => {
      const id = card.getAttribute('data-id');
      const clickableArea = card.querySelector('.garment-img-frame');
      const titleEl = card.querySelector('.garment-title');
      const specBtn = card.querySelector('.btn-view-specs');

      const openHandler = (e) => {
        // Don't open if clicked inside select or add to bag button
        if (e.target.closest('.garment-buy-row') || e.target.closest('.select-clean') || e.target.closest('.btn-add-bag')) {
          return;
        }
        if (id) window.openProductModal(id);
      };

      if (clickableArea) clickableArea.addEventListener('click', openHandler);
      if (titleEl) titleEl.addEventListener('click', openHandler);
      if (specBtn) specBtn.addEventListener('click', () => window.openProductModal(id));
    });
  }

  // Mobile Navigation Drawer Controller
  const mobileMenuBtn = document.getElementById('fashion-mobile-menu-btn');
  const mobileDrawer = document.getElementById('fashion-mobile-drawer');
  const drawerOverlay = document.getElementById('fashion-drawer-overlay');
  const drawerCloseBtn = document.getElementById('fashion-drawer-close');
  const drawerAccountBtn = document.getElementById('drawer-account-btn');

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileDrawer);

  if (drawerAccountBtn) {
    drawerAccountBtn.addEventListener('click', () => {
      closeMobileDrawer();
      if (window.openAccountModal) window.openAccountModal('acc-tab-patron');
    });
  }

  document.querySelectorAll('.fashion-drawer-link').forEach(link => {
    if (link !== drawerAccountBtn) {
      link.addEventListener('click', () => {
        closeMobileDrawer();
      });
    }
  });

  // Initial Run
  updateCartUI();
  applyFacetedFilters();
  bindCardListeners();
  initFashionDisclaimer();

})();
