/**
 * ATELIER ORA // DEDICATED LUXURY PRODUCT DETAIL PAGE (PDP) ENGINE
 * 
 * Supports:
 * - Dynamic URL parameter parsing (?id=...)
 * - Real-time colorway switching (immediately swaps cloth photo)
 * - Multiple angles: Studio Flatlay, Editorial Model Shot, Interactive 3D WebGL, Textile Macro
 * - Interactive Three.js 3D Garment Studio integration
 * - Complete Fabric & Provenance, Sizing Measurements Table, Occasion & Styling
 * - Cart Drawer & LocalStorage synchronization
 * - Patron Account Portal
 */

(function () {
  'use strict';

  const CART_KEY = 'atelier_ora_cart';
  const DISCLAIMER_KEY = 'atelier_ora_disclaimer_dismissed';
  let cart = [];

  const PRODUCTS_DB = {
    'hoodie-01': {
      id: 'hoodie-01',
      title: '500 GSM Heavyweight Boxy Hoodie',
      category: 'Sweats & Loungewear',
      categorySlug: 'sweats',
      material: '500 GSM Loopback Cotton Fleece',
      materialSlug: 'fleece',
      price: 260,
      weightGsm: 500,
      badge: 'BESTSELLER // 500 GSM FLEECE',
      summary: 'Engineered from custom-knitted 500 GSM unbrushed loopback cotton fleece. Features architectural dropped shoulders, seamless cuffs, double-layer upright hood without drawstrings, and deep kangaroo pocket.',
      colorways: [
        {
          name: 'Oatmeal Heather',
          hex: '#d8d1c5',
          flatlayImg: 'assets/images/garment-hoodie-oatmeal.jpg',
          colorKey: 'oatmeal'
        },
        {
          name: 'Vintage Washed Olive',
          hex: '#5b5f49',
          flatlayImg: 'assets/images/garment-hoodie-olive.jpg',
          colorKey: 'olive'
        },
        {
          name: 'Deep Espresso',
          hex: '#231f1d',
          flatlayImg: 'assets/images/garment-hoodie-espresso.jpg',
          colorKey: 'espresso'
        },
        {
          name: 'Terracotta Clay',
          hex: '#9d5d47',
          flatlayImg: 'assets/images/garment-hoodie-terracotta.jpg',
          colorKey: 'terracotta'
        },
        {
          name: 'Warm Camel',
          hex: '#b8946e',
          flatlayImg: 'assets/images/garment-hoodie-camel.jpg',
          colorKey: 'camel'
        }
      ],
      angles: [
        {
          key: 'flatlay',
          label: 'STUDIO FLATLAY',
          type: 'image',
          desc: 'High-res studio flatlay with travertine stone background'
        },
        {
          key: 'model',
          label: 'MODEL LOOKBOOK',
          type: 'image',
          src: 'assets/images/garment-hoodie-model-real.jpg',
          desc: 'Worn on model (6ft 1in / 185cm wearing Size L)'
        },
        {
          key: 'editorial',
          label: 'EDITORIAL STRIDE',
          type: 'image',
          src: 'assets/images/garment-hoodie-editorial-man.jpg',
          desc: 'High-fashion editorial street lookbook'
        },
        {
          key: 'back',
          label: 'BACK SILHOUETTE',
          type: 'image',
          src: 'assets/images/garment-hoodie-back.jpg',
          desc: 'Architectural back drape & seamless double hood'
        },
        {
          key: '3d',
          label: '360° 3D STUDIO',
          type: '3d',
          desc: 'Interactive Three.js WebGL simulation with 360° orbit'
        },
        {
          key: 'texture',
          label: 'TEXTILE MACRO',
          type: 'image',
          src: 'assets/images/garment-hoodie-texture.jpg',
          desc: 'Macro closeup of 500 GSM loopback cotton fleece grain'
        }
      ],
      sizes: [
        { name: 'S (US 36)', chest: '42.0 in', length: '26.5 in', fitNote: 'True to size for standard relaxed cut' },
        { name: 'M (US 38)', chest: '44.0 in', length: '27.5 in', fitNote: 'Ideal for chest 38-40"' },
        { name: 'L (US 40)', chest: '46.0 in', length: '28.5 in', fitNote: 'Signature boxy drape (Recommended)' },
        { name: 'XL (US 42)', chest: '48.0 in', length: '29.5 in', fitNote: 'Maximum slouch and layering volume' }
      ],
      measurementsTable: [
        { size: 'S (US 36)', chest: '42.0 in (106.7 cm)', length: '26.5 in (67.3 cm)', shoulder: '21.0 in (53.3 cm)', sleeve: '24.5 in (62.2 cm)' },
        { size: 'M (US 38)', chest: '44.0 in (111.8 cm)', length: '27.5 in (69.8 cm)', shoulder: '22.0 in (55.9 cm)', sleeve: '25.0 in (63.5 cm)' },
        { size: 'L (US 40)', chest: '46.0 in (116.8 cm)', length: '28.5 in (72.4 cm)', shoulder: '23.0 in (58.4 cm)', sleeve: '25.5 in (64.8 cm)' },
        { size: 'XL (US 42)', chest: '48.0 in (121.9 cm)', length: '29.5 in (74.9 cm)', shoulder: '24.0 in (61.0 cm)', sleeve: '26.0 in (66.0 cm)' }
      ],
      composition: '100% Combed Long-Staple Organic Cotton Fleece (500 GSM)',
      provenance: 'Milled & knit in Guimarães, Northern Portugal. Garment-dyed with low-impact botanical reactive pigments.',
      silhouette: 'Architectural boxy cut with relaxed dropped shoulders, seamless 2x2 rib cuffs, and a self-lined double-layer structured hood that stays upright without drawstrings.',
      occasion: 'Essential everyday architectural uniform, gallery exhibitions, trans-continental travel, and relaxed cool-weather layering.',
      pairing: 'Pairs effortlessly with the Wide-Leg Pleated Tailored Trouser and Hand-Burnished Suede Chelsea Boots.',
      dispatchEstimate: 'In stock. Hand-inspected and dispatched within 24 hours via white-glove insured airfreight. Estimated worldwide delivery: 2-3 business days.',
      care: 'Machine wash cold at 30°C inside out with mild neutral detergent. Reshape while damp and dry flat in shade. Do not tumble dry. Low iron if required.',
      fitAdvice: 'True to size for the signature architectural boxy drape. Size down if you prefer a traditional tailored fit.',
      specs: [
        { label: 'FABRIC WEIGHT', value: '500 GSM Loopback Fleece' },
        { label: 'YARN PROVENANCE', value: 'Guimarães, Northern Portugal' },
        { label: 'HOOD ARCHITECTURE', value: 'Double-Ply Self-Fabric Structured' },
        { label: 'SHRINK RESISTANCE', value: 'Pre-washed at 60°C (0% Dimensional Shift)' },
        { label: 'HARDWARE', value: 'Seamless Drawstring-Free Neckline' },
        { label: 'COURIER PACKAGING', value: 'Custom Atelier Canvas Garment Bag' }
      ],
      companionIds: ['trouser-05', 'bomber-02', 'boots-06']
    },

    'bomber-02': {
      id: 'bomber-02',
      title: 'Washed Canvas Flight Bomber Jacket',
      category: 'Tailored Outerwear',
      categorySlug: 'outerwear',
      material: 'Enzyme Washed Duck Canvas',
      materialSlug: 'canvas',
      price: 420,
      weightGsm: 440,
      badge: 'LIMITED EDITION // ENZYME PATINA',
      summary: 'Heavyweight cotton duck canvas enzyme-washed for a subtle, broken-in patina. Solid brushed silver two-way zipper, ribbed wool hem and storm cuffs, with diamond-quilted Japanese cupro lining.',
      colorways: [
        {
          name: 'Vintage Olive',
          hex: '#545942',
          flatlayImg: 'assets/images/garment-bomber-olive.jpg',
          colorKey: 'olive'
        },
        {
          name: 'Washed Obsidian',
          hex: '#222224',
          flatlayImg: 'assets/images/garment-bomber-obsidian.jpg',
          colorKey: 'obsidian'
        },
        {
          name: 'Desert Sand Khaki',
          hex: '#c5b79d',
          flatlayImg: 'assets/images/garment-bomber-sand.jpg',
          colorKey: 'sand'
        }
      ],
      angles: [
        {
          key: 'flatlay',
          label: 'STUDIO FLATLAY',
          type: 'image',
          desc: 'High-res studio flatlay with travertine stone background'
        },
        {
          key: 'model',
          label: 'MODEL LOOKBOOK',
          type: 'image',
          src: 'assets/images/garment-bomber-model.jpg',
          desc: 'Worn on model (6ft 0in / 183cm wearing Size L)'
        },
        {
          key: 'editorial',
          label: 'EDITORIAL STRIDE',
          type: 'image',
          src: 'assets/images/garment-bomber-editorial-man.jpg',
          desc: 'High-fashion tailored street lookbook'
        },
        {
          key: 'back',
          label: 'BACK PROFILE',
          type: 'image',
          src: 'assets/images/garment-bomber-back.jpg',
          desc: 'Rear architectural profile showing pleated storm shoulders'
        },
        {
          key: 'texture',
          label: 'CANVAS WEAVE',
          type: 'image',
          src: 'assets/images/garment-bomber-texture.jpg',
          desc: 'Macro texture of 440 GSM enzyme-washed duck canvas'
        }
      ],
      sizes: [
        { name: 'M (US 38)', chest: '45.0 in', length: '25.5 in', fitNote: 'Regular waist-length crop' },
        { name: 'L (US 40)', chest: '47.0 in', length: '26.5 in', fitNote: 'Ideal for layering over hoodies (Recommended)' },
        { name: 'XL (US 42)', chest: '49.0 in', length: '27.5 in', fitNote: 'Oversized volume' }
      ],
      measurementsTable: [
        { size: 'M (US 38)', chest: '45.0 in (114.3 cm)', length: '25.5 in (64.8 cm)', shoulder: '21.5 in (54.6 cm)', sleeve: '25.0 in (63.5 cm)' },
        { size: 'L (US 40)', chest: '47.0 in (119.4 cm)', length: '26.5 in (67.3 cm)', shoulder: '22.5 in (57.1 cm)', sleeve: '25.5 in (64.8 cm)' },
        { size: 'XL (US 42)', chest: '49.0 in (124.5 cm)', length: '27.5 in (69.8 cm)', shoulder: '23.5 in (59.7 cm)', sleeve: '26.0 in (66.0 cm)' }
      ],
      composition: '100% Heavyweight Cotton Duck Canvas (440 GSM) with Quilted Japanese Cupro Lining',
      provenance: 'Woven in Okayama, Japan. Hand-assembled and enzyme-washed in Porto, Portugal for a subtle broken-in patina.',
      silhouette: 'Classic MA-1 tactical flight silhouette with dropped shoulders, slightly cropped waist ribbing, and heavy 2x2 wool-blend ribbed collar.',
      occasion: 'Autumn / Winter statement outerwear, transitional weather, gallery openings, and urban evening travel.',
      pairing: 'Layers cleanly over the 280 GSM Boxy Drop-Shoulder Tee with double-pleated trousers.',
      dispatchEstimate: 'In stock. Hand-inspected and dispatched within 24 hours via express priority airfreight.',
      care: 'Specialist dry clean only to maintain the enzyme-washed canvas patina and quilted cupro lining.',
      fitAdvice: 'Boxy chest with high-hip cropped finish. Order your regular jacket size for intended outerwear fit.',
      specs: [
        { label: 'CANVAS DENSITY', value: '440 GSM Duck Canvas' },
        { label: 'INTERIOR LINING', value: '100% Japanese Bemberg Cupro' },
        { label: 'MAIN CLOSURE', value: 'Solid Brushed Silver Riri 2-Way Zip' },
        { label: 'STORM COLLAR', value: '100% Merino Wool 2x2 Rib' },
        { label: 'POCKETS', value: '2 Exterior Welt Pockets, 2 Concealed Interior' },
        { label: 'WASH TREATMENT', value: 'Subtle Stone & Enzyme Bath' }
      ],
      companionIds: ['tee-04', 'trouser-05', 'boots-06']
    },

    'trench-03': {
      id: 'trench-03',
      title: 'Double-Breasted Heavy Wool Overcoat',
      category: 'Tailored Outerwear',
      categorySlug: 'outerwear',
      material: '850 GSM Italian Virgin Wool',
      materialSlug: 'wool',
      price: 780,
      weightGsm: 850,
      badge: 'ITALIAN VIRGIN WOOL // 850 GSM',
      summary: '850 GSM Italian virgin wool melton with architectural wide peaked lapels, self-fabric belt with hand-carved horn buckle, and deep slanted storm pockets.',
      colorways: [
        {
          name: 'Warm Camel',
          hex: '#b6926b',
          flatlayImg: 'assets/images/garment-trench-camel.jpg',
          colorKey: 'camel'
        },
        {
          name: 'Deep Espresso',
          hex: '#26201a',
          flatlayImg: 'assets/images/garment-trench-espresso.jpg',
          colorKey: 'espresso'
        },
        {
          name: 'Midnight Charcoal',
          hex: '#1c1e22',
          flatlayImg: 'assets/images/garment-trench-charcoal.jpg',
          colorKey: 'charcoal'
        }
      ],
      angles: [
        {
          key: 'flatlay',
          label: 'STUDIO FLATLAY',
          type: 'image',
          desc: 'High-res studio flatlay with travertine stone background'
        },
        {
          key: 'model',
          label: 'MODEL LOOKBOOK',
          type: 'image',
          src: 'assets/images/garment-trench-model.jpg',
          desc: 'Worn on model (6ft 2in / 188cm wearing Size 50 / L)'
        },
        {
          key: 'editorial',
          label: 'EDITORIAL STRIDE',
          type: 'image',
          src: 'assets/images/garment-trench-editorial-man.jpg',
          desc: 'High-fashion tailored overcoat lookbook'
        },
        {
          key: 'back',
          label: 'BACK VIEW',
          type: 'image',
          src: 'assets/images/garment-trench-back.jpg',
          desc: 'Full back drape showing inverted box pleat'
        },
        {
          key: 'texture',
          label: 'WOOL MELTON',
          type: 'image',
          src: 'assets/images/garment-trench-texture.jpg',
          desc: 'Macro texture of 850 GSM Italian virgin wool melton'
        }
      ],
      sizes: [
        { name: '48 / M', chest: '46.0 in', length: '46.0 in', fitNote: 'Fits chest 38-40"' },
        { name: '50 / L', chest: '48.0 in', length: '47.0 in', fitNote: 'Standard overcoat drape (Recommended)' },
        { name: '52 / XL', chest: '50.0 in', length: '48.0 in', fitNote: 'Generous grand architectural volume' }
      ],
      measurementsTable: [
        { size: '48 / M', chest: '46.0 in (116.8 cm)', length: '46.0 in (116.8 cm)', shoulder: '20.5 in (52.1 cm)', sleeve: '26.0 in (66.0 cm)' },
        { size: '50 / L', chest: '48.0 in (121.9 cm)', length: '47.0 in (119.4 cm)', shoulder: '21.5 in (54.6 cm)', sleeve: '26.5 in (67.3 cm)' },
        { size: '52 / XL', chest: '50.0 in (127.0 cm)', length: '48.0 in (121.9 cm)', shoulder: '22.5 in (57.1 cm)', sleeve: '27.0 in (68.6 cm)' }
      ],
      composition: '100% Italian Virgin Wool Melton (850 GSM) with Bemberg Cupro Full Lining',
      provenance: 'Woven by Lanificio di Pray in Biella, Northern Italy. Tailored with hand-sewn floating canvas interlining in Tuscany.',
      silhouette: 'Grand double-breasted overcoat silhouette with broad peaked lapels, deep angled hand-warmer welt pockets, and a full self-fabric waist belt with horn buckle.',
      occasion: 'Formal architectural occasions, winter travel, client presentations, and evening dining.',
      pairing: 'Engineered to layer seamlessly over our 500 GSM Boxy Hoodie or tailored suiting.',
      dispatchEstimate: 'Dispatches within 24 hours. Includes complimentary engraved solid wood hangar and heavy breathable cotton garment travel bag.',
      care: 'Specialist dry clean only. Steam refresh recommended between wears.',
      fitAdvice: 'Cut with generous outerwear ease to comfortably fit heavy loopback hoodies or blazers underneath.',
      specs: [
        { label: 'FABRIC WEIGHT', value: '850 GSM Wool Melton' },
        { label: 'MILL PROVENANCE', value: 'Lanificio di Pray, Biella, Italy' },
        { label: 'BUTTONS', value: 'Hand-Carved Genuine Buffalo Horn' },
        { label: 'CONSTRUCTION', value: 'Full Floating Horsehair Canvas' },
        { label: 'LAPEL SPEC', value: '11.5cm Architectural Peak' },
        { label: 'TRAVEL ACCESSORY', value: 'Custom Canvas Garment Bag' }
      ],
      companionIds: ['hoodie-01', 'trouser-05', 'boots-06']
    },

    'tee-04': {
      id: 'tee-04',
      title: '280 GSM Boxy Drop-Shoulder Tee',
      category: 'Tees & Tops',
      categorySlug: 'tees',
      material: '280 GSM Single Jersey',
      materialSlug: 'jersey',
      price: 110,
      weightGsm: 280,
      badge: 'EVERYDAY UNIFORM // 280 GSM',
      summary: 'Sun-faded pigment washed heavy cotton single jersey with reinforced 32mm ribbed collar that retains its shape indefinitely. Relaxed boxy drape with elongated sleeves.',
      colorways: [
        {
          name: 'Vintage Washed Black',
          hex: '#2c2b29',
          flatlayImg: 'assets/images/garment-tee-charcoal.jpg',
          colorKey: 'black'
        },
        {
          name: 'Oatmeal Milk',
          hex: '#d9d3c7',
          flatlayImg: 'assets/images/garment-tee-oatmeal.jpg',
          colorKey: 'oatmeal'
        }
      ],
      angles: [
        {
          key: 'flatlay',
          label: 'STUDIO FLATLAY',
          type: 'image',
          desc: 'High-res studio flatlay with travertine stone background'
        },
        {
          key: 'model',
          label: 'MODEL LOOKBOOK',
          type: 'image',
          src: 'assets/images/garment-tee-model.jpg',
          desc: 'Worn on model (6ft 0in / 183cm wearing Size L)'
        },
        {
          key: 'editorial',
          label: 'EDITORIAL STRIDE',
          type: 'image',
          src: 'assets/images/garment-tee-editorial-man.jpg',
          desc: 'High-fashion relaxed summer street lookbook'
        },
        {
          key: 'back',
          label: 'BACK DRAPE',
          type: 'image',
          src: 'assets/images/garment-tee-back.jpg',
          desc: 'Rear view showing drop-shoulder seamless yoke'
        },
        {
          key: 'texture',
          label: 'JERSEY WEAVE',
          type: 'image',
          src: 'assets/images/garment-tee-texture.jpg',
          desc: 'Macro texture of 280 GSM combed single jersey'
        }
      ],
      sizes: [
        { name: 'S', chest: '43.0 in', length: '28.0 in', fitNote: 'Relaxed standard fit' },
        { name: 'M', chest: '45.0 in', length: '29.0 in', fitNote: 'True to size for relaxed boxy drape' },
        { name: 'L', chest: '47.0 in', length: '30.0 in', fitNote: 'Recommended signature boxy fit' },
        { name: 'XL', chest: '49.0 in', length: '31.0 in', fitNote: 'Oversized streetwear drape' }
      ],
      measurementsTable: [
        { size: 'S', chest: '43.0 in (109.2 cm)', length: '28.0 in (71.1 cm)', shoulder: '21.0 in (53.3 cm)', sleeve: '9.5 in (24.1 cm)' },
        { size: 'M', chest: '45.0 in (114.3 cm)', length: '29.0 in (73.7 cm)', shoulder: '22.0 in (55.9 cm)', sleeve: '10.0 in (25.4 cm)' },
        { size: 'L', chest: '47.0 in (119.4 cm)', length: '30.0 in (76.2 cm)', shoulder: '23.0 in (58.4 cm)', sleeve: '10.5 in (26.7 cm)' },
        { size: 'XL', chest: '49.0 in (124.5 cm)', length: '31.0 in (78.7 cm)', shoulder: '24.0 in (61.0 cm)', sleeve: '11.0 in (27.9 cm)' }
      ],
      composition: '100% Long-Staple Combed Organic Cotton (280 GSM)',
      provenance: 'Knit and pigment-washed in Barcelos, Portugal using natural botanical dyes.',
      silhouette: 'Relaxed boxy silhouette with elongated short sleeves, dropped shoulders, and a heavy 32mm reinforced double-needle ribbed collar that never sags.',
      occasion: 'Essential year-round foundational uniform, casual studio work, and understated warm-weather wear.',
      pairing: 'Pairs directly beneath the Washed Canvas Flight Bomber or tucks neatly into Wide-Leg Tailored Trousers.',
      dispatchEstimate: 'In stock. Shipped within 24 hours in biodegradable glassine packaging.',
      care: 'Machine wash cold at 30°C. Hang dry in shade. Pre-shrunk to retain its boxy proportions wash after wash.',
      fitAdvice: 'Relaxed oversized boxy cut. Select your standard size for the intended drape.',
      specs: [
        { label: 'FABRIC WEIGHT', value: '280 GSM Heavy Jersey' },
        { label: 'COLLAR PROFILE', value: '32mm Reinforced 1x1 Rib' },
        { label: 'STITCHING', value: 'Twin-Needle Flatlock Throughout' },
        { label: 'DYE PROCESS', value: 'Sun-Faded Vintage Pigment Wash' },
        { label: 'SHRINKAGE', value: 'Zero (Industrial Pre-Washed)' }
      ],
      companionIds: ['bomber-02', 'trouser-05', 'boots-06']
    },

    'trouser-05': {
      id: 'trouser-05',
      title: 'Wide-Leg Pleated Tailored Trouser',
      category: 'Tailored Trousers',
      categorySlug: 'trousers',
      material: 'High-Twist Tropical Wool',
      materialSlug: 'tropical',
      price: 320,
      weightGsm: 310,
      badge: 'RAW ARCHITECTURE // DOUBLE PLEATS',
      summary: 'Heavyweight high-twist wool with deep forward double pleats and straight architectural drape. High-rise cut with concealed waistband extension.',
      colorways: [
        {
          name: 'Deep Espresso',
          hex: '#211d1a',
          flatlayImg: 'assets/images/garment-trouser-espresso.jpg',
          colorKey: 'espresso'
        },
        {
          name: 'Travertine Chalk',
          hex: '#d6cfc3',
          flatlayImg: 'assets/images/garment-trouser-chalk.jpg',
          colorKey: 'chalk'
        },
        {
          name: 'Midnight Charcoal',
          hex: '#1e2023',
          flatlayImg: 'assets/images/garment-trouser-charcoal.jpg',
          colorKey: 'charcoal'
        }
      ],
      angles: [
        {
          key: 'flatlay',
          label: 'STUDIO FLATLAY',
          type: 'image',
          desc: 'High-res studio flatlay with travertine stone background'
        },
        {
          key: 'model',
          label: 'MODEL LOOKBOOK',
          type: 'image',
          src: 'assets/images/garment-trouser-model.jpg',
          desc: 'Worn on model (6ft 1in / 185cm wearing Size 32)'
        },
        {
          key: 'editorial',
          label: 'EDITORIAL STRIDE',
          type: 'image',
          src: 'assets/images/garment-trouser-editorial-man.jpg',
          desc: 'Styled editorial lookbook with deep pleats'
        },
        {
          key: 'texture',
          label: 'WOOL WEAVE',
          type: 'image',
          src: 'assets/images/garment-trouser-texture.jpg',
          desc: 'Macro texture of 310 GSM high-twist tropical wool'
        }
      ],
      sizes: [
        { name: '30 (S)', waist: '30.5 in', inseam: '31.0 in', fitNote: 'Fits natural waist 29-30"' },
        { name: '32 (M)', waist: '32.5 in', inseam: '31.5 in', fitNote: 'Standard tailored fit (Recommended)' },
        { name: '34 (L)', waist: '34.5 in', inseam: '32.0 in', fitNote: 'Relaxed waist with generous leg drape' },
        { name: '36 (XL)', waist: '36.5 in', inseam: '32.5 in', fitNote: 'Full wide silhouette' }
      ],
      measurementsTable: [
        { size: '30 (S)', waist: '30.5 in (77.5 cm)', rise: '13.0 in (33.0 cm)', inseam: '31.0 in (78.7 cm)', legOpening: '21.0 in (53.3 cm)' },
        { size: '32 (M)', waist: '32.5 in (82.6 cm)', rise: '13.5 in (34.3 cm)', inseam: '31.5 in (80.0 cm)', legOpening: '21.5 in (54.6 cm)' },
        { size: '34 (L)', waist: '34.5 in (87.6 cm)', rise: '14.0 in (35.6 cm)', inseam: '32.0 in (81.3 cm)', legOpening: '22.0 in (55.9 cm)' },
        { size: '36 (XL)', waist: '36.5 in (92.7 cm)', rise: '14.5 in (36.8 cm)', inseam: '32.5 in (82.6 cm)', legOpening: '22.5 in (57.1 cm)' }
      ],
      composition: '100% High-Twist Tropical Wool (310 GSM)',
      provenance: 'Tailored in Varese, Northern Italy with internal curtain waistband construction.',
      silhouette: 'High-rise architectural waist, deep double forward pleats, extended tab waistband with concealed closure, and a straight, generous wide-leg drape.',
      occasion: 'Tailored architectural uniform, fine dining, international travel, creative office environments.',
      pairing: 'Coordinates with the 500 GSM Boxy Hoodie or Double-Breasted Wool Overcoat and Suede Chelsea Boots.',
      dispatchEstimate: 'Dispatched within 24 hours. Includes 2 inches of internal hem let-out allowance for custom tailoring.',
      care: 'Specialist dry clean or light hand steaming only.',
      fitAdvice: 'High-rise fit through the natural waist, opening into a relaxed wide straight leg.',
      specs: [
        { label: 'FABRIC WEIGHT', value: '310 GSM High-Twist Wool' },
        { label: 'PLEAT DESIGN', value: 'Double Forward Architectural Pleats' },
        { label: 'WAISTBAND', value: 'Concealed Hook-and-Bar with Side Tabs' },
        { label: 'POCKETS', value: 'Deep Slanted Pockets, 2 Rear Jet Pockets' },
        { label: 'HEM ALLOWANCE', value: '5cm / 2-inch Internal Let-Out' }
      ],
      companionIds: ['hoodie-01', 'trench-03', 'boots-06']
    },

    'boots-06': {
      id: 'boots-06',
      title: 'Hand-Burnished Suede Chelsea Boots',
      category: 'Handcrafted Footwear',
      categorySlug: 'footwear',
      material: 'Italian Hydro Calf Suede',
      materialSlug: 'suede',
      price: 450,
      weightGsm: 900,
      badge: 'HANDCRAFTED IN ITALY // CREPE SOLE',
      summary: 'Water-repellent Tuscan calf suede with natural plantation crepe soles, double grosgrain pull-tabs, and tonally matched elastic side gussets. Blake-stitched for full resolability.',
      colorways: [
        {
          name: 'Sand Almond',
          hex: '#c5b196',
          flatlayImg: 'assets/images/garment-boots-suede.jpg',
          colorKey: 'almond'
        }
      ],
      angles: [
        {
          key: 'flatlay',
          label: 'STUDIO FLATLAY',
          type: 'image',
          desc: 'High-res studio flatlay with travertine stone background'
        },
        {
          key: 'model',
          label: 'MODEL LOOKBOOK',
          type: 'image',
          src: 'assets/images/garment-boots-model.jpg',
          desc: 'Footwear on model styled with tailored trousers'
        },
        {
          key: 'texture',
          label: 'CALF SUEDE GRAIN',
          type: 'image',
          src: 'assets/images/garment-boots-texture.jpg',
          desc: 'Macro closeup of water-repellent hydro calf suede'
        }
      ],
      sizes: [
        { name: 'EU 41 / US 8', insole: '26.8 cm', fitNote: 'Fits true to US 8' },
        { name: 'EU 42 / US 9', insole: '27.5 cm', fitNote: 'Standard dress fit (Recommended)' },
        { name: 'EU 43 / US 10', insole: '28.2 cm', fitNote: 'Fits true to US 10' },
        { name: 'EU 44 / US 11', insole: '29.0 cm', fitNote: 'Fits true to US 11' }
      ],
      measurementsTable: [
        { size: 'EU 41 / US 8', insole: '26.8 cm', width: 'Medium D', shaftHeight: '14.5 cm', soleHeight: '2.5 cm' },
        { size: 'EU 42 / US 9', insole: '27.5 cm', width: 'Medium D', shaftHeight: '15.0 cm', soleHeight: '2.5 cm' },
        { size: 'EU 43 / US 10', insole: '28.2 cm', width: 'Medium D', shaftHeight: '15.5 cm', soleHeight: '2.5 cm' },
        { size: 'EU 44 / US 11', insole: '29.0 cm', width: 'Medium D', shaftHeight: '16.0 cm', soleHeight: '2.5 cm' }
      ],
      composition: '100% Water-Repellent Tuscan Calf Suede, Full Calfskin Lining, 100% Natural Plantation Crepe Sole',
      provenance: 'Hand-lasted and bench-made in Civitanova Marche, Italy.',
      silhouette: 'Clean architectural almond toe silhouette with tonally matched heavy elastic side gussets, blake-stitched construction, and reinforced double grosgrain pull tabs.',
      occasion: 'All-season footwear rotation, urban walking, long-haul travel, and casual tailored evenings.',
      pairing: 'The natural foundation for the Wide-Leg Pleated Tailored Trouser.',
      dispatchEstimate: 'In stock. Ships in custom debossed collector box with individual cotton flannel shoe bags.',
      care: 'Treated with water-repellent protection. Maintain with brass suede brush and natural crepe eraser.',
      fitAdvice: 'True to standard European dress shoe sizing. If between sizes, choose the smaller size.',
      specs: [
        { label: 'UPPER LEATHER', value: 'Tuscan Hydro Calf Suede' },
        { label: 'OUTSOLE', value: '100% Natural Plantation Crepe' },
        { label: 'CONSTRUCTION', value: 'Blake Stitched (Fully Recraftable)' },
        { label: 'LINING', value: 'Vegetable-Tanned Italian Calfskin' },
        { label: 'ORIGIN', value: 'Civitanova Marche, Italy' }
      ],
      companionIds: ['trouser-05', 'hoodie-01', 'trench-03']
    },

    'dress-07': {
      id: 'dress-07',
      title: 'Bias-Cut Pleated Silk Evening Maxi Dress',
      category: 'Haute Couture Dresses',
      categorySlug: 'dresses',
      material: '32 Momme Mulberry Silk',
      materialSlug: 'silk',
      price: 640,
      weightGsm: 140,
      badge: 'HAUTE COUTURE // 32 MOMME SILK',
      summary: 'Woven in Como, Italy and hand-pleated in Lyon. High halter neckline with micro-pleated bodice cascading into an asymmetrical bias-cut handkerchief maxi hem with undulating fluid movement.',
      colorways: [
        {
          name: 'Obsidian Black Silk',
          hex: '#161618',
          flatlayImg: 'assets/images/garment-dress-silk.jpg',
          colorKey: 'obsidian'
        }
      ],
      angles: [
        {
          key: 'flatlay',
          label: 'STUDIO FLATLAY',
          type: 'image',
          desc: 'High-res studio flatlay on travertine stone background'
        },
        {
          key: 'texture',
          label: 'SILK PLEAT MACRO',
          type: 'image',
          src: 'assets/images/garment-dress-silk.jpg',
          desc: 'Macro view of 32 Momme Mulberry crepe de chine pleating'
        }
      ],
      sizes: [
        { name: 'FR 36 / US 4', chest: '33.0 in', length: '53.0 in', fitNote: 'Fits bust 32-33"' },
        { name: 'FR 38 / US 6', chest: '35.0 in', length: '54.0 in', fitNote: 'True to French size 38 (Recommended)' },
        { name: 'FR 40 / US 8', chest: '37.0 in', length: '55.0 in', fitNote: 'Fits bust 36-37"' },
        { name: 'FR 42 / US 10', chest: '39.0 in', length: '56.0 in', fitNote: 'Relaxed fluid bias contour' }
      ],
      measurementsTable: [
        { size: 'FR 36 / US 4', chest: '33.0 in (83.8 cm)', length: '53.0 in (134.6 cm)', shoulder: '14.0 in (35.6 cm)', sleeve: 'Sleeveless' },
        { size: 'FR 38 / US 6', chest: '35.0 in (88.9 cm)', length: '54.0 in (137.2 cm)', shoulder: '14.5 in (36.8 cm)', sleeve: 'Sleeveless' },
        { size: 'FR 40 / US 8', chest: '37.0 in (94.0 cm)', length: '55.0 in (139.7 cm)', shoulder: '15.0 in (38.1 cm)', sleeve: 'Sleeveless' },
        { size: 'FR 42 / US 10', chest: '39.0 in (99.1 cm)', length: '56.0 in (142.2 cm)', shoulder: '15.5 in (39.4 cm)', sleeve: 'Sleeveless' }
      ],
      composition: '100% Grade 6A Mulberry Crepe de Chine Silk (32 Momme)',
      provenance: 'Woven in Como, Italy. Hand-pleated and finished with rolled edges in Lyon, France.',
      silhouette: 'High halter neckline with architectural micro-pleating through the bodice, cascading into an asymmetrical bias-cut handkerchief maxi hem with undulating fluid movement.',
      occasion: 'Black-tie architectural galas, opera evenings, high-summer private receptions, and trans-seasonal couture styling.',
      pairing: 'Styled in harmony with our Double-Breasted Wool Overcoat and Handcrafted Leather Derby.',
      dispatchEstimate: 'Dispatched within 24 hours in archival garment box with acid-free tissue and scented cedar sachet.',
      care: 'Specialist dry clean only. Cool reverse iron under silk press cloth.',
      fitAdvice: 'Cut on the true 45-degree bias for a body-skimming contour. Order your standard French / US dress size.',
      specs: [
        { label: 'SILK GRADE', value: 'Grade 6A 100% Mulberry Silk' },
        { label: 'FABRIC DENSITY', value: '32 Momme Crepe de Chine' },
        { label: 'HEM CONSTRUCTION', value: 'Hand-Rolled French Edge' },
        { label: 'WEAVE PROVENANCE', value: 'Lake Como, Northern Italy' },
        { label: 'PLEATING ATELIER', value: 'Lyon, France' },
        { label: 'CLOSURE', value: 'Concealed Hand-Sewn Riri Zip' }
      ],
      companionIds: ['trench-03', 'derby-08', 'boots-06']
    },

    'derby-08': {
      id: 'derby-08',
      title: 'Hand-Welted Goodyear Leather Derby',
      category: 'Benchmade Footwear',
      categorySlug: 'footwear',
      material: 'French Box Calf Leather',
      materialSlug: 'leather',
      price: 520,
      weightGsm: 880,
      badge: 'GOODYEAR WELTED // DAINITE SOLE',
      summary: 'Hand-lasted and Goodyear-welted in Northamptonshire, England from French full-grain box calf leather. Equipped with British studded rubber Dainite sole and 360-degree storm welt.',
      colorways: [
        {
          name: 'Polished Black Noir',
          hex: '#111112',
          flatlayImg: 'assets/images/garment-derby-leather.jpg',
          colorKey: 'black'
        }
      ],
      angles: [
        {
          key: 'flatlay',
          label: 'STUDIO FLATLAY',
          type: 'image',
          desc: 'Studio capture with brass shoe tree on travertine stone'
        },
        {
          key: 'texture',
          label: 'BOX CALF GRAIN',
          type: 'image',
          src: 'assets/images/garment-derby-leather.jpg',
          desc: 'Macro surface of aniline-dyed French box calf leather'
        }
      ],
      sizes: [
        { name: 'EU 41 / US 8', insole: '26.8 cm', fitNote: 'Fits true to US 8' },
        { name: 'EU 42 / US 9', insole: '27.5 cm', fitNote: 'Standard dress fit (Recommended)' },
        { name: 'EU 43 / US 10', insole: '28.2 cm', fitNote: 'Fits true to US 10' },
        { name: 'EU 44 / US 11', insole: '29.0 cm', fitNote: 'Fits true to US 11' }
      ],
      measurementsTable: [
        { size: 'EU 41 / US 8', insole: '26.8 cm', width: 'Medium E', shaftHeight: '9.0 cm', soleHeight: '2.8 cm' },
        { size: 'EU 42 / US 9', insole: '27.5 cm', width: 'Medium E', shaftHeight: '9.2 cm', soleHeight: '2.8 cm' },
        { size: 'EU 43 / US 10', insole: '28.2 cm', width: 'Medium E', shaftHeight: '9.4 cm', soleHeight: '2.8 cm' },
        { size: 'EU 44 / US 11', insole: '29.0 cm', width: 'Medium E', shaftHeight: '9.6 cm', soleHeight: '2.8 cm' }
      ],
      composition: '100% French Box Calf Full-Grain Leather, Vegetable-Tanned Lining, British Studded Rubber Dainite Outsole',
      provenance: 'Hand-lasted and Goodyear-welted in Northamptonshire, England.',
      silhouette: 'Classic 5-eyelet plain-toe derby with 360-degree storm welt, double-stitched perimeter, custom brass-turned shoe tree, and high-density British studded rubber sole.',
      occasion: 'All-weather formal occasions, architectural practice, international business, and sharp evening dining.',
      pairing: 'Complements both the Wide-Leg Pleated Tailored Trouser and the Double-Breasted Wool Overcoat.',
      dispatchEstimate: 'In stock. Includes handcrafted cedar shoe trees, cotton flannel dust covers, and spare waxed laces.',
      care: 'Condition regularly with beeswax leather balm and buff with horsehair brush.',
      fitAdvice: 'True to English dress shoe sizing (Medium F width). If between sizes, size down by half size.',
      specs: [
        { label: 'UPPER LEATHER', value: 'French Full-Grain Box Calf' },
        { label: 'CONSTRUCTION', value: '360° Goodyear Storm Welt' },
        { label: 'OUTSOLE', value: 'British Studded Dainite Rubber' },
        { label: 'ORIGIN', value: 'Northamptonshire, England' },
        { label: 'HARDWARE', value: 'Solid Brass Last Turn' },
        { label: 'RESOLABILITY', value: 'Unlimited Recrafting Life' }
      ],
      companionIds: ['trouser-05', 'trench-03', 'dress-07']
    }
  };

  // State
  let activeProductId = 'hoodie-01';
  let activeProduct = null;
  let activeColorIndex = 0;
  let activeAngleIndex = 0;
  let selectedSize = '';
  let threeLoaded = false;

  // DOM Elements
  const pdpBreadcrumbCategory = document.getElementById('pdp-breadcrumb-category');
  const pdpBreadcrumbTitle = document.getElementById('pdp-breadcrumb-title');
  const pdpBadge = document.getElementById('pdp-badge');
  const pdpTitle = document.getElementById('pdp-title');
  const pdpCategoryKicker = document.getElementById('pdp-category-kicker');
  const pdpPrice = document.getElementById('pdp-price');
  const pdpSummary = document.getElementById('pdp-summary');
  
  const pdpMainImage = document.getElementById('pdp-main-image');
  const pdp3DContainer = document.getElementById('pdp-3d-container');
  const pdpAngleTabs = document.getElementById('pdp-angle-tabs');
  const pdpAngleThumbnails = document.getElementById('pdp-angle-thumbnails');
  
  const pdpColorwayLabel = document.getElementById('pdp-colorway-label');
  const pdpColorwaySwatches = document.getElementById('pdp-colorway-swatches');
  
  const pdpSizeSelect = document.getElementById('pdp-size-select');
  const pdpBtnAddBag = document.getElementById('pdp-btn-add-bag');
  const pdpBtnAddBagPrice = document.getElementById('pdp-btn-add-bag-price');
  
  const pdpSpecsGrid = document.getElementById('pdp-specs-grid');
  const pdpMeasurementsTableBody = document.getElementById('pdp-measurements-table-body');
  const pdpProvenanceText = document.getElementById('pdp-provenance-text');
  const pdpSilhouetteText = document.getElementById('pdp-silhouette-text');
  const pdpFitAdviceText = document.getElementById('pdp-fit-advice-text');
  const pdpOccasionText = document.getElementById('pdp-occasion-text');
  const pdpPairingText = document.getElementById('pdp-pairing-text');
  const pdpDispatchText = document.getElementById('pdp-dispatch-text');
  const pdpCareText = document.getElementById('pdp-care-text');
  const pdpRelatedGrid = document.getElementById('pdp-related-grid');

  // Cart DOM
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');

  // Account Modal DOM
  const accountModal = document.getElementById('account-portal-modal');
  const headerAccountBtn = document.getElementById('header-account-btn');
  const mobileDockAccountBtn = document.getElementById('mobile-dock-account-btn');
  const accountModalClose = document.getElementById('account-modal-close');

  // Disclaimer Modal DOM
  const demoDisclaimerModal = document.getElementById('demo-disclaimer-modal');

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

    // Quantity events
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

  const btnCheckout = document.getElementById('btn-checkout');
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) return;
      const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
      try {
        const existing = localStorage.getItem('atelier_orders');
        const orders = existing ? JSON.parse(existing) : [];
        const newOrder = {
          id: 'AO-' + Math.floor(1000 + Math.random() * 9000),
          customer: 'Julian Vance',
          email: 'j.vance@oberoigroup.com',
          items: cart.map(i => `${i.title} (${i.size}) x${i.quantity}`).join(', '),
          total: subtotal,
          destination: 'New Delhi, India',
          status: 'processing',
          date: 'Just now'
        };
        orders.unshift(newOrder);
        localStorage.setItem('atelier_orders', JSON.stringify(orders));
      } catch (e) {}
    });
  }

  // Parse ID from URL
  function initProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id && PRODUCTS_DB[id]) {
      activeProductId = id;
    } else {
      activeProductId = 'hoodie-01';
    }
    activeProduct = PRODUCTS_DB[activeProductId];
    activeColorIndex = 0;
    activeAngleIndex = 0;
    selectedSize = activeProduct.sizes[1] ? activeProduct.sizes[1].name : activeProduct.sizes[0].name;

    renderProduct();
  }

  function renderProduct() {
    const p = activeProduct;
    document.title = `${p.title} // ATELIER ORA APPAREL`;

    // Breadcrumbs
    if (pdpBreadcrumbCategory) pdpBreadcrumbCategory.textContent = p.category.toUpperCase();
    if (pdpBreadcrumbTitle) pdpBreadcrumbTitle.textContent = p.title.toUpperCase();

    // Headers
    if (pdpBadge) pdpBadge.textContent = p.badge;
    if (pdpCategoryKicker) pdpCategoryKicker.textContent = `${p.category.toUpperCase()} • ${p.material.toUpperCase()}`;
    if (pdpTitle) pdpTitle.textContent = p.title;
    if (pdpPrice) pdpPrice.textContent = `$${p.price} USD`;
    if (pdpBtnAddBagPrice) pdpBtnAddBagPrice.textContent = `$${p.price}`;
    if (pdpSummary) pdpSummary.textContent = p.summary;

    // Mobile Quick Header Elements
    const mobileBadge = document.getElementById('pdp-mobile-badge');
    const mobileCategory = document.getElementById('pdp-mobile-category-kicker');
    const mobileTitle = document.getElementById('pdp-mobile-title');
    const mobilePrice = document.getElementById('pdp-mobile-price');
    const stickyPrice = document.getElementById('pdp-sticky-price-val');

    if (mobileBadge) mobileBadge.textContent = p.badge;
    if (mobileCategory) mobileCategory.textContent = `${p.category.toUpperCase()} • ${p.material.toUpperCase()}`;
    if (mobileTitle) mobileTitle.textContent = p.title;
    if (mobilePrice) mobilePrice.textContent = `$${p.price} USD`;
    if (stickyPrice) stickyPrice.textContent = `$${p.price}`;

    // Render Colorway Swatches
    renderColorways();

    // Render Angle Selector
    renderAngles();

    // Render Sizes Dropdown
    renderSizes();

    // Render Specs Grid
    if (pdpSpecsGrid) {
      pdpSpecsGrid.innerHTML = p.specs.map(s => `
        <div class="pdp-spec-card font-mono">
          <span class="pdp-spec-lbl">${s.label}</span>
          <span class="pdp-spec-val">${s.value}</span>
        </div>
      `).join('');
    }

    // Render Measurements Table
    if (pdpMeasurementsTableBody) {
      pdpMeasurementsTableBody.innerHTML = p.measurementsTable.map(m => `
        <tr>
          <td><strong>${m.size}</strong></td>
          <td>${m.chest || m.waist || m.insole}</td>
          <td>${m.length || m.rise || m.width}</td>
          <td>${m.shoulder || m.inseam || m.shaftHeight}</td>
          <td>${m.sleeve || m.legOpening || m.soleHeight || '-'}</td>
        </tr>
      `).join('');
    }

    // Details Texts
    if (pdpProvenanceText) pdpProvenanceText.textContent = p.provenance;
    if (pdpSilhouetteText) pdpSilhouetteText.textContent = p.silhouette;
    if (pdpFitAdviceText) pdpFitAdviceText.textContent = p.fitAdvice;
    if (pdpOccasionText) pdpOccasionText.textContent = p.occasion;
    if (pdpPairingText) pdpPairingText.textContent = p.pairing;
    if (pdpDispatchText) pdpDispatchText.textContent = p.dispatchEstimate;
    if (pdpCareText) pdpCareText.textContent = p.care;

    // Render Related Companion Pieces
    renderCompanionPieces();

    // Update Stage
    updateMainStage();
  }

  function renderColorways() {
    if (!pdpColorwaySwatches) return;
    const colors = activeProduct.colorways;
    const activeColor = colors[activeColorIndex];

    if (pdpColorwayLabel) {
      pdpColorwayLabel.textContent = activeColor.name;
    }

    pdpColorwaySwatches.innerHTML = colors.map((c, idx) => `
      <button type="button" class="pdp-color-swatch-btn ${idx === activeColorIndex ? 'active' : ''}"
        data-index="${idx}"
        style="background: ${c.hex};"
        title="${c.name}"
        aria-label="${c.name}">
        <span class="swatch-check"></span>
      </button>
    `).join('');

    pdpColorwaySwatches.querySelectorAll('.pdp-color-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        selectColorway(idx);
      });
    });
  }

  function selectColorway(idx) {
    activeColorIndex = idx;
    const chosenColor = activeProduct.colorways[activeColorIndex];
    if (pdpColorwayLabel) pdpColorwayLabel.textContent = chosenColor.name;

    pdpColorwaySwatches.querySelectorAll('.pdp-color-swatch-btn').forEach((b, i) => {
      b.classList.toggle('active', i === idx);
    });

    const activeAngle = activeProduct.angles[activeAngleIndex];

    // If 3D is active, update 3D model color
    if (activeAngle && activeAngle.type === '3d') {
      if (window.update3DHoodieColor) window.update3DHoodieColor(chosenColor.colorKey);
      if (window.set3DGarmentColor) window.set3DGarmentColor(chosenColor.colorKey);
    } else {
      // Photo mode: switch immediately to flatlay of this colorway so the user sees it in full detail!
      activeAngleIndex = 0; // Flatlay
      if (pdpMainImage && chosenColor.flatlayImg) {
        pdpMainImage.classList.add('img-switching');
        pdpMainImage.src = chosenColor.flatlayImg;
        setTimeout(() => {
          pdpMainImage.classList.remove('img-switching');
        }, 120);
      }
    }

    // Always update 3D color hook in background for when user taps 3D
    if (window.update3DHoodieColor) window.update3DHoodieColor(chosenColor.colorKey);
    if (window.set3DGarmentColor) window.set3DGarmentColor(chosenColor.colorKey);

    // Re-render angle thumbnails so the flatlay thumbnail preview updates to the new color!
    renderAngles();

    // Update CTA button labels and sticky mobile dock
    if (pdpBtnAddBag) {
      pdpBtnAddBag.setAttribute('data-color', chosenColor.name);
    }
    const stickyBtn = document.getElementById('pdp-mobile-quick-add-btn');
    if (stickyBtn) {
      stickyBtn.setAttribute('data-color', chosenColor.name);
    }
  }

  function renderAngles() {
    if (!pdpAngleThumbnails) return;
    const angles = activeProduct.angles;

    pdpAngleThumbnails.innerHTML = angles.map((a, idx) => {
      let thumbImg = a.src;
      if (a.key === 'flatlay') {
        thumbImg = activeProduct.colorways[activeColorIndex].flatlayImg;
      } else if (a.key === '3d') {
        thumbImg = 'assets/images/garment-hoodie-oatmeal.jpg';
      }

      return `
        <button type="button" class="pdp-thumb-card ${idx === activeAngleIndex ? 'active' : ''}" data-index="${idx}">
          <div class="thumb-img-frame">
            <img src="${thumbImg}" alt="${a.label}">
            ${a.type === '3d' ? '<span class="thumb-3d-tag font-mono">3D</span>' : ''}
          </div>
          <span class="thumb-title font-mono">${a.label}</span>
        </button>
      `;
    }).join('');

    pdpAngleThumbnails.querySelectorAll('.pdp-thumb-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        selectAngle(idx);
      });
    });
  }

  function selectAngle(idx) {
    activeAngleIndex = idx;
    pdpAngleThumbnails.querySelectorAll('.pdp-thumb-card').forEach((c, i) => {
      c.classList.toggle('active', i === idx);
    });

    if (pdpMainImage) {
      pdpMainImage.classList.add('img-switching');
      setTimeout(() => {
        pdpMainImage.classList.remove('img-switching');
      }, 120);
    }

    updateMainStage();
  }

  function updateMainStage() {
    const angle = activeProduct.angles[activeAngleIndex];
    const chosenColor = activeProduct.colorways[activeColorIndex];

    if (angle.type === '3d') {
      if (pdpMainImage) pdpMainImage.style.display = 'none';
      if (pdp3DContainer) {
        pdp3DContainer.style.display = 'block';
        init3DViewer(chosenColor.colorKey);
      }
    } else {
      if (pdp3DContainer) pdp3DContainer.style.display = 'none';
      if (pdpMainImage) {
        pdpMainImage.style.display = 'block';
        if (angle.key === 'flatlay') {
          pdpMainImage.src = chosenColor.flatlayImg;
        } else {
          pdpMainImage.src = angle.src;
        }
      }
    }
  }

  function renderSizes() {
    const mobileSizeSelect = document.getElementById('pdp-mobile-size-quick');

    if (pdpSizeSelect) {
      pdpSizeSelect.innerHTML = activeProduct.sizes.map(s => `
        <option value="${s.name}" ${s.name === selectedSize ? 'selected' : ''}>
          ${s.name} &bull; ${s.fitNote}
        </option>
      `).join('');

      pdpSizeSelect.addEventListener('change', () => {
        selectedSize = pdpSizeSelect.value;
        if (mobileSizeSelect) mobileSizeSelect.value = selectedSize;
      });
    }

    if (mobileSizeSelect) {
      mobileSizeSelect.innerHTML = activeProduct.sizes.map(s => `
        <option value="${s.name}" ${s.name === selectedSize ? 'selected' : ''}>
          SIZE: ${s.name}
        </option>
      `).join('');

      mobileSizeSelect.addEventListener('change', () => {
        selectedSize = mobileSizeSelect.value;
        if (pdpSizeSelect) pdpSizeSelect.value = selectedSize;
      });
    }
  }

  function renderCompanionPieces() {
    if (!pdpRelatedGrid) return;
    const companionIds = activeProduct.companionIds || ['hoodie-01', 'trouser-05', 'boots-06'];
    const companions = companionIds.map(id => PRODUCTS_DB[id]).filter(Boolean);

    pdpRelatedGrid.innerHTML = companions.map(comp => `
      <a href="product.html?id=${comp.id}" class="related-garment-card">
        <div class="related-img-frame">
          <span class="related-badge font-mono">${comp.badge}</span>
          <img src="${comp.colorways[0].flatlayImg}" alt="${comp.title}">
        </div>
        <div class="related-info-box font-mono">
          <span class="related-kicker">${comp.category.toUpperCase()}</span>
          <h4 class="related-title font-display">${comp.title}</h4>
          <span class="related-price">$${comp.price} USD</span>
        </div>
      </a>
    `).join('');
  }

  // Three.js PDP 3D Viewer
  function init3DViewer(initialColorKey) {
    if (threeLoaded) {
      if (window.update3DHoodieColor) {
        window.update3DHoodieColor(initialColorKey);
      }
      return;
    }

    const container = document.getElementById('three-pdp-viewport');
    if (!container || typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') return;

    threeLoaded = true;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f5f0);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbe6f0, 1.3);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    const colorHexMap = {
      oatmeal: 0xD7D1C5,
      olive: 0x5B5F49,
      espresso: 0x231F1D,
      terracotta: 0x9D5D47,
      camel: 0xB8946E
    };

    let garmentModel = null;
    let garmentMaterial = null;
    let targetColorKey = initialColorKey;

    const loader = new THREE.GLTFLoader();
    loader.load('assets/models/hoodie.glb', (gltf) => {
      garmentModel = gltf.scene;

      garmentMaterial = new THREE.MeshStandardMaterial({
        color: colorHexMap[targetColorKey] || colorHexMap[initialColorKey] || 0xD7D1C5,
        roughness: 0.88,
        metalness: 0.04
      });

      garmentModel.traverse((child) => {
        if (child.isMesh) {
          child.material = garmentMaterial;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Auto scale & center
      const box = new THREE.Box3().setFromObject(garmentModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.6 / (maxDim || 1);
      garmentModel.scale.set(scale, scale, scale);
      garmentModel.position.x = -center.x * scale;
      garmentModel.position.y = -center.y * scale - 0.2;
      garmentModel.position.z = -center.z * scale;

      scene.add(garmentModel);
      threeLoaded = true;
    });

    window.update3DHoodieColor = window.set3DGarmentColor = function (colorKey) {
      targetColorKey = colorKey;
      if (garmentMaterial && colorHexMap[colorKey]) {
        garmentMaterial.color.setHex(colorHexMap[colorKey]);
      }
    };

    // Orbit Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !garmentModel) return;
      const deltaX = e.clientX - prevMouseX;
      garmentModel.rotation.y += deltaX * 0.01;
      prevMouseX = e.clientX;
    });

    // Touch interaction
    renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !garmentModel || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      garmentModel.rotation.y += deltaX * 0.015;
      prevMouseX = e.touches[0].clientX;
    }, { passive: true });

    // Render loop
    function animate() {
      requestAnimationFrame(animate);
      if (garmentModel && !isDragging) {
        garmentModel.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  // Add to Bag Action
  if (pdpBtnAddBag) {
    pdpBtnAddBag.addEventListener('click', () => {
      const chosenColor = activeProduct.colorways[activeColorIndex];
      const sizeToUse = selectedSize || (activeProduct.sizes[0] ? activeProduct.sizes[0].name : 'M');

      const existing = cart.find(item => item.id === activeProduct.id && item.size === sizeToUse && item.colorName === chosenColor.name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: activeProduct.id,
          title: activeProduct.title,
          price: activeProduct.price,
          image: chosenColor.flatlayImg,
          colorName: chosenColor.name,
          size: sizeToUse,
          quantity: 1
        });
      }

      saveCart();
      openCart();
    });
  }

  // Mobile Sticky Quick-Add Button Action
  const pdpMobileQuickAddBtn = document.getElementById('pdp-mobile-quick-add-btn');
  if (pdpMobileQuickAddBtn) {
    pdpMobileQuickAddBtn.addEventListener('click', () => {
      if (pdpBtnAddBag) {
        pdpBtnAddBag.click();
      }
    });
  }

  // Mobile Navigation Drawer on PDP
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

  // Account Modal
  window.openAccountModal = function (tabId) {
    if (!accountModal) return;
    accountModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (tabId) switchAccountTab(tabId);
  };

  window.closeAccountModal = function () {
    if (!accountModal) return;
    accountModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.switchAccountTab = function (tabId) {
    document.querySelectorAll('.acc-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.acc-tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });
  };

  if (headerAccountBtn) headerAccountBtn.addEventListener('click', () => window.openAccountModal('acc-orders'));
  if (mobileDockAccountBtn) mobileDockAccountBtn.addEventListener('click', () => window.openAccountModal('acc-orders'));
  if (accountModalClose) accountModalClose.addEventListener('click', window.closeAccountModal);
  if (accountModal) {
    accountModal.addEventListener('click', (e) => {
      if (e.target === accountModal) window.closeAccountModal();
    });
  }

  // Disclaimer Modal
  window.dismissFashionDisclaimer = function () {
    if (demoDisclaimerModal) {
      demoDisclaimerModal.classList.remove('open');
      document.body.style.overflow = '';
      try { sessionStorage.setItem(DISCLAIMER_KEY, '1'); } catch (e) {}
    }
  };

  // Keyboard shortcut
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      window.closeAccountModal();
      window.dismissFashionDisclaimer();
    }
  });

  // Init
  initProduct();
  updateCartUI();

})();
