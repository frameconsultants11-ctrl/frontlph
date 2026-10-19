const base = {
  categoryCollection: "categories",
  subCategoryCollection: "subCategories",
  filters: { skills: true, tools: false, level: true, duration: false, price: true },
};

export const LISTING_TYPES = {
  courses: {
    ...base,
    key: "courses",
    collection: "courses",
    label: "Course",
    labelPlural: "Courses",
    listPath: "/courses",
    slugPrefix: "top-courses-",
    itemPath: "/learning/course",
    filters: { skills: true, tools: true, level: true, duration: true, price: true },
  },
  certifications: {
    ...base,
    key: "certifications",
    collection: "certificationLearn",
    label: "Certification",
    labelPlural: "Certifications",
    listPath: "/certifications",
    slugPrefix: "top-certifications-",
    itemPath: "/learning/certification",
  },
  tools: {
    ...base,
    key: "tools",
    collection: "toolsLearn",
    label: "Tool",
    labelPlural: "Tools",
    listPath: "/tools",
    slugPrefix: "top-tools-",
    itemPath: "/learning/tool",
  },
  topics: {
    ...base,
    key: "topics",
    collection: "topicLearn",
    label: "Topic",
    labelPlural: "Topics",
    listPath: "/topics",
    slugPrefix: "top-topics-",
    itemPath: "/learning/topic",
  },
};

export const getListingConfig = (type) => LISTING_TYPES[type] || null;

// with category -> /tools/top-tools-cloud-computing ; without -> /tools/top-tools
export const listingBasePath = (cfg, catSlug = "") =>
  catSlug
    ? `${cfg.listPath}/${cfg.slugPrefix}${catSlug}`
    : `${cfg.listPath}/${cfg.slugPrefix.replace(/-$/, "")}`;