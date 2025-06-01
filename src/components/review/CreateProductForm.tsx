
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

interface DuplicateProduct {
  id: string;
  name: string;
  brand_name: string;
  image_url: string | null;
}

interface ProductFormData {
  name: string;
  brand_name: string;
  category_id: string;
  price: string;
  external_purchase_link: string;
  description: string;
  image_file: File | null;
}

interface CreateProductFormProps {
  onNext: (productData: ProductFormData & { image_url?: string }) => void;
  onCancel: () => void;
  onSelectExistingProduct: (product: DuplicateProduct) => void;
}

export const CreateProductForm = ({ onNext, onCancel, onSelectExistingProduct }: CreateProductFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    brand_name: "",
    category_id: "",
    price: "",
    external_purchase_link: "",
    description: "",
    image_file: null,
  });
  const [duplicates, setDuplicates] = useState<DuplicateProduct[]>([]);
  const [showDuplicatesDialog, setShowDuplicatesDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const { toast } = useToast();

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Error loading categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
        return;
      }

      setCategories(data || []);
    };

    loadCategories();
  }, [toast]);

  // Check for duplicates when brand and category are both filled
  useEffect(() => {
    const checkDuplicates = async () => {
      if (!formData.brand_name.trim() || !formData.category_id) return;

      setIsCheckingDuplicates(true);
      try {
        const { data, error } = await supabase.functions.invoke('check_potential_product_duplicates', {
          body: { 
            brand_name: formData.brand_name.trim(), 
            category_id: formData.category_id 
          }
        });

        if (error) throw error;

        if (data?.products && data.products.length > 0) {
          setDuplicates(data.products);
          setShowDuplicatesDialog(true);
        }
      } catch (error) {
        console.error("Error checking duplicates:", error);
      } finally {
        setIsCheckingDuplicates(false);
      }
    };

    const timeoutId = setTimeout(checkDuplicates, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.brand_name, formData.category_id]);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image_file: file }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.brand_name.trim() || !formData.category_id || 
        !formData.price.trim() || !formData.image_file) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const image_url = await uploadImage(formData.image_file);
      onNext({ ...formData, image_url });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinueWithNew = () => {
    setShowDuplicatesDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Create New Product
        </h2>
        <p className="text-gray-600">
          Step 1: Enter product information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Image *</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Product Name *</label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Brand Name *</label>
          <Input
            value={formData.brand_name}
            onChange={(e) => handleInputChange("brand_name", e.target.value)}
            placeholder="Enter brand name"
            required
          />
          {isCheckingDuplicates && (
            <p className="text-xs text-gray-500 mt-1">Checking for similar products...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <Select 
            value={formData.category_id} 
            onValueChange={(value) => handleInputChange("category_id", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (USD) *</label>
          <Input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Purchase Link</label>
          <Input
            type="url"
            value={formData.external_purchase_link}
            onChange={(e) => handleInputChange("external_purchase_link", e.target.value)}
            placeholder="https://example.com/product"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe the product..."
            rows={3}
          />
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading}
            className="flex-1 bg-purple-500 hover:bg-purple-600"
          >
            {isUploading ? "Uploading..." : "Next: Add Review"}
          </Button>
        </div>
      </form>

      <Dialog open={showDuplicatesDialog} onOpenChange={setShowDuplicatesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Is this your product?</DialogTitle>
            <DialogDescription>
              Please check before creating a new one.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-60 overflow-y-auto space-y-3">
            {duplicates.map((product) => (
              <div key={product.id} className="flex items-center p-3 border rounded-lg">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover mr-3"
                  />
                )}
                <div className="flex-grow">
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.brand_name}</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onSelectExistingProduct(product)}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Review This
                </Button>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 mt-4">
            <Button
              variant="outline"
              onClick={handleContinueWithNew}
              className="flex-1"
            >
              No, My Product is New
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
