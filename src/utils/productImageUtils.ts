
export const getCategoryImage = (categoryName: string | null): string => {
  if (!categoryName) {
    return '/assets/other.jpg';
  }

  // Normalize category name for case-insensitive matching
  const normalizedCategory = categoryName.trim().toLowerCase();

  const categoryImageMap: { [key: string]: string } = {
    'baby care': '/assets/babycare.jpg',
    'baby food': '/assets/babyfood.jpg',
    'baby monitors': '/assets/babymonitor.jpg',
    'bedding': '/assets/bedding.jpg',
    'bottles': '/assets/bottles.jpg',
    'car seats': '/assets/carseats.jpg',
    'clothing': '/assets/clothing.jpg',
    'diapers': '/assets/diapers.jpg',
    'other': '/assets/other.jpg',
    'parenting books': '/assets/parentingbooks.jpg',
    'strollers': '/assets/strollers.jpg',
    'toys': '/assets/toys.jpg'
  };

  return categoryImageMap[normalizedCategory] || '/assets/other.jpg';
};

export const getProductImageWithFallback = (imageUrl: string | null, categoryName: string | null): string => {
  // If we have a valid image URL, return it (the component will handle load errors)
  if (imageUrl) {
    return imageUrl;
  }
  
  // If no image URL provided, return category fallback immediately
  return getCategoryImage(categoryName);
};
