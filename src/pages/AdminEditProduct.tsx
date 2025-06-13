import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminProduct } from '@/hooks/useAdminProduct';
import { useAdminProductMutations } from '@/hooks/admin/useAdminProductMutations';
import { useAdminProductReviews } from '@/hooks/admin/useAdminProductReviews';
import { ProductEditHeader } from '@/components/admin/products/ProductEditHeader';
import { ProductDetailsForm } from '@/components/admin/products/ProductDetailsForm';
import { ProductReviewsCard } from '@/components/admin/products/ProductReviewsCard';
import { ProductMergeCard } from '@/components/admin/products/ProductMergeCard';
import { ProductDeleteCard } from '@/components/admin/products/ProductDeleteCard';

const AdminEditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  
  const { product, isLoading: isLoadingProduct, error: productError } = useAdminProduct(productId || '');
  const { updateProduct, setVerifiedStatus, deleteProduct, isUpdating, isDeleting } = useAdminProductMutations();
  const { 
    reviews, 
    deleteReview, 
    isDeleting: isDeletingReview, 
    isLoading: isLoadingReviews, 
    error: reviewsError 
  } = useAdminProductReviews(productId || '');
  
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    category: '',
    description: '',
    imageUrl: '',
    price: '',
    externalPurchaseLink: '',
    isVerified: false,
  });

  const [mergeData, setMergeData] = useState({
    targetProductId: '',
    reason: '',
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brandName: product.brand_name || '',
        category: product.category || '',
        description: product.description || '',
        imageUrl: product.image_url || '',
        price: product.price?.toString() || '',
        externalPurchaseLink: product.external_purchase_link || '',
        isVerified: product.is_verified,
      });
    }
  }, [product]);

  const handleSave = async () => {
    if (!productId) return;

    updateProduct({
      productId,
      name: formData.name,
      brandName: formData.brandName,
      category: formData.category || undefined,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      externalPurchaseLink: formData.externalPurchaseLink || undefined,
    });
  };

  const handleVerificationToggle = () => {
    if (!productId) return;
    setVerifiedStatus({ productId, verified: !formData.isVerified });
    setFormData(prev => ({ ...prev, isVerified: !prev.isVerified }));
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      deleteReview({ reviewId, reason: 'Admin deletion' });
    }
  };

  const handleDeleteProduct = () => {
    if (!productId || !product) return;
    
    deleteProduct({ 
      productId, 
      reason: `Admin deletion of product "${product.name}" from edit form` 
    });
    
    // Navigate back to products list after successful deletion
    // The mutation success handler will show the toast
    setTimeout(() => {
      navigate('/admin/products');
    }, 1000);
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <ProductEditHeader onSave={handleSave} isUpdating={isUpdating} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductDetailsForm 
            formData={formData}
            setFormData={setFormData}
            onVerificationToggle={handleVerificationToggle}
          />

          <div className="space-y-6">
            <ProductReviewsCard 
              reviews={reviews}
              onDeleteReview={handleDeleteReview}
              isDeletingReview={isDeletingReview}
              isLoading={isLoadingReviews}
              error={reviewsError}
            />

            <ProductMergeCard 
              mergeData={mergeData}
              setMergeData={setMergeData}
            />

            <ProductDeleteCard 
              product={product}
              onDeleteProduct={handleDeleteProduct}
              isDeleting={isDeleting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProduct;
