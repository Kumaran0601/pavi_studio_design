export const demoImages = {
  detail: "/images/embroidery-detail_3cb9f969.jpg",
  crimson: "/images/crimson-gold-thread_38de9166.jpg",
  backwork: "/images/bridal-backwork_1bb9fe4a.jpg",
  blouse: "/images/bridal-blouse_3987d927.jpg",
  floral: "/images/maroon-floral_6329b811.jpg",
  bridal: "/images/bridal-work_e9b0c7e2.jpg",
  training: "/images/training-community_e0f4b184.jpg",
};

export const defaultSettings = {
  businessName: "Pavi Designer Studio & Training Center",
  tagline: "Your Satisfaction is our Needness",
  addressLines: [
    "20/1, 1st Floor,",
    "Padavattamman Koil Street,",
    "Padi, Chennai - 600 050,",
    "Tamil Nadu, India.",
  ],
  phones: ["+91 73584 61060", "+91 96001 60340"],
  whatsappNumber: "917358461060",
  instagramHandle: "@pavi_designer_studio",
  instagramUrl: "https://www.instagram.com/pavi_designer_studio/",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pavi+Designer+Studio+Training+Center+Padi+Chennai",
  heroImageUrl: demoImages.blouse,
};

export const seedCategories = [
  { slug: "bridal", name: "Bridal", sortOrder: 1 },
  { slug: "aari-work", name: "Aari Work", sortOrder: 2 },
  { slug: "customized", name: "Customized", sortOrder: 3 },
  { slug: "blouse", name: "Blouse", sortOrder: 4 },
  { slug: "brooches", name: "Brooches", sortOrder: 5 },
  { slug: "training", name: "Training", sortOrder: 6 },
];

export const seedServices = [
  {
    slug: "aari-embroidery",
    title: "Aari Embroidery Works",
    shortDescription: "Detailed handwork with traditional motifs, floral details, stones and borders.",
    longDescription: "Traditional Aari embroidery, detailed handwork and personalized motifs for blouses, bridal pieces and creative projects.",
    imageUrl: demoImages.detail,
    ctaLabel: "Explore Aari Work",
    sortOrder: 1,
  },
  {
    slug: "bridal-blouse",
    title: "Full Bridal Blouse Works",
    shortDescription: "Thoughtful bridal blouse embroidery with attention to sleeves, backs, necklines and finishing.",
    longDescription: "Discuss bridal blouse requirements, traditional motifs, neckline ideas and the level of detailing you have in mind.",
    imageUrl: demoImages.bridal,
    ctaLabel: "Enquire About Bridal Work",
    sortOrder: 2,
  },
  {
    slug: "customized-works",
    title: "Customized Works",
    shortDescription: "Bring your colours, motifs and occasion to a design conversation shaped around your idea.",
    longDescription: "Share a reference, motif, colour direction or blouse idea and discuss how the embroidery can be customized.",
    imageUrl: demoImages.floral,
    ctaLabel: "Discuss Your Design",
    sortOrder: 3,
  },
  {
    slug: "aari-classes",
    title: "Aari Embroidery Classes",
    shortDescription: "A one-month course with practical guidance and certificate information.",
    longDescription: "Learn the fundamentals of Aari embroidery through guided practice and practical instruction.",
    imageUrl: demoImages.training,
    ctaLabel: "Join Aari Classes",
    sortOrder: 4,
  },
  {
    slug: "aari-materials",
    title: "Aari Materials",
    shortDescription: "Basic Aari embroidery materials are available for sale at the studio.",
    longDescription: "Ask about available needles, threads, beads, stones and other basic embroidery accessories.",
    imageUrl: demoImages.detail,
    ctaLabel: "Ask About Materials",
    sortOrder: 5,
  },
  {
    slug: "brooches",
    title: "Brooches",
    shortDescription: "Decorative brooch options to complement blouse and saree styling.",
    longDescription: "Discuss brooch requirements for bridal, festive and traditional styling.",
    imageUrl: demoImages.backwork,
    ctaLabel: "Enquire About Brooches",
    sortOrder: 6,
  },
  {
    slug: "saree-drape",
    title: "Saree Drape",
    shortDescription: "Saree draping support for wedding and function styling conversations.",
    longDescription: "Ask about saree draping availability for your occasion and styling requirements.",
    imageUrl: demoImages.blouse,
    ctaLabel: "Enquire About Saree Drape",
    sortOrder: 7,
  },
  {
    slug: "fabric-painting",
    title: "Fabric Painting",
    shortDescription: "Creative fabric painting work for personalized textile details.",
    longDescription: "Discuss your fabric painting idea, colours and intended use with the studio.",
    imageUrl: demoImages.floral,
    ctaLabel: "Discuss Fabric Painting",
    sortOrder: 8,
  },
];

export const seedGallery = [
  { id: 1, imageUrl: demoImages.blouse, category: "Bridal", caption: "Bridal blouse design with traditional motifs", altText: "Embroidered red bridal blouse with gold detailing", isFeatured: 1, sortOrder: 1 },
  { id: 2, imageUrl: demoImages.detail, category: "Aari Work", caption: "Detailed Aari handwork on sleeve border", altText: "Gold embroidery details on deep maroon textile", isFeatured: 1, sortOrder: 2 },
  { id: 3, imageUrl: demoImages.crimson, category: "Aari Work", caption: "Golden thread and zari embellishment", altText: "Golden thread and motifs on crimson textile", isFeatured: 1, sortOrder: 3 },
  { id: 4, imageUrl: demoImages.backwork, category: "Bridal", caption: "Intricate bridal cutwork back design", altText: "Red bridal blouse back with intricate embroidery", isFeatured: 1, sortOrder: 4 },
  { id: 5, imageUrl: demoImages.floral, category: "Customized", caption: "Custom floral spray embroidery", altText: "Gold floral embroidery on maroon textile", isFeatured: 0, sortOrder: 5 },
  { id: 6, imageUrl: demoImages.bridal, category: "Blouse", caption: "Traditional neckline detailing", altText: "Embroidered bridal blouse detail", isFeatured: 0, sortOrder: 6 },
  { id: 7, imageUrl: demoImages.detail, category: "Brooches", caption: "Handmade embroidery accessory brooch", altText: "Decorative gold embroidery trim close-up", isFeatured: 0, sortOrder: 7 },
  { id: 8, imageUrl: demoImages.training, category: "Training", caption: "Class training and community session", altText: "Aari-inspired gold threadwork close-up", isFeatured: 0, sortOrder: 8 },
];

export const seedMaterials = [
  { id: 1, slug: "basic-aari-materials", name: "Basic Aari Materials", category: "Basic Aari Materials", shortDescription: "Ask about the basic tools and supplies needed to begin Aari embroidery.", imageUrl: demoImages.detail, whatsappLabel: "Ask about basic Aari materials", sortOrder: 1, isActive: 1 },
  { id: 2, slug: "aari-needles", name: "Aari Needles", category: "Needles", shortDescription: "Aari needles and related essentials for embroidery practice.", imageUrl: demoImages.crimson, whatsappLabel: "Ask about Aari needles", sortOrder: 2, isActive: 1 },
  { id: 3, slug: "embroidery-threads", name: "Embroidery Threads", category: "Threads", shortDescription: "Ask about thread options for your embroidery requirements.", imageUrl: demoImages.floral, whatsappLabel: "Ask about embroidery threads", sortOrder: 3, isActive: 1 },
  { id: 4, slug: "beads-and-stones", name: "Beads & Stones", category: "Beads", shortDescription: "Decorative beads and stones for detailed textile work.", imageUrl: demoImages.backwork, whatsappLabel: "Ask about beads and stones", sortOrder: 4, isActive: 1 },
  { id: 5, slug: "embroidery-accessories", name: "Embroidery Accessories", category: "Embroidery Accessories", shortDescription: "Other basic accessories for Aari embroidery and guided practice.", imageUrl: demoImages.blouse, whatsappLabel: "Ask about embroidery accessories", sortOrder: 5, isActive: 1 },
];

export const seedCourse = {
  id: 1,
  slug: "one-month-aari-embroidery-course",
  title: "1 Month Aari Embroidery Course",
  subtitle: "Learn Aari Embroidery with Practical Guidance and Certificate",
  durationText: "1 Month",
  certificateText: "Certificate Provided",
  description: "Join our 1-month Aari embroidery course and learn the fundamentals of Aari embroidery with practical guidance.",
  learningPoints: ["Beginner-friendly learning", "Practical training", "Embroidery techniques", "Design understanding", "Guided practice"],
  audiencePoints: ["Beginners exploring Aari embroidery", "Learners looking for guided practice", "Anyone interested in building embroidery skills"],
  faqItems: [
    { question: "What is the course duration?", answer: "The course duration is 1 month." },
    { question: "Is a certificate provided?", answer: "Certificate information is available for the course." },
    { question: "How can I know the current fee and batch details?", answer: "Contact us for current course fee and batch details." },
  ],
  ctaLabel: "Enquire About the Next Batch",
  isActive: 1,
};

export const memoryStore = {
  settings: { ...defaultSettings },
  services: seedServices.map((item, index) => ({ id: index + 1, ...item, isActive: 1 })),
  gallery: seedGallery.map((item, index) => ({ id: index + 1, ...item, isPublished: 1 })),
  materials: seedMaterials.map((item, index) => ({ id: index + 1, ...item, isActive: 1 })),
  course: { ...seedCourse },
  enquiries: [],
};

export function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
