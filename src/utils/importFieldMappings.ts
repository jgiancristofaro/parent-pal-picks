
export const getRequiredFields = (importType: 'sitters' | 'products') => {
  if (importType === 'sitters') {
    return {
      name: 'Name (required)',
      bio: 'Bio',
      experience: 'Experience',
      hourly_rate: 'Hourly Rate',
      phone_number: 'Phone Number',
      email: 'Email',
      profile_image_url: 'Profile Image URL',
      certifications: 'Certifications (comma-separated)'
    };
  } else {
    return {
      name: 'Name (required)',
      description: 'Description',
      brand_name: 'Brand Name (required)',
      category: 'Category',
      price: 'Price',
      image_url: 'Image URL',
      external_purchase_link: 'Purchase Link'
    };
  }
};
