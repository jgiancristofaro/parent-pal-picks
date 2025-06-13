
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface FormData {
  name: string;
  brandName: string;
  category: string;
  description: string;
  imageUrl: string;
  price: string;
  externalPurchaseLink: string;
  isVerified: boolean;
}

interface ProductDetailsFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onVerificationToggle: () => void;
}

export const ProductDetailsForm = ({ formData, setFormData, onVerificationToggle }: ProductDetailsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandName">Brand Name</Label>
          <Input
            id="brandName"
            value={formData.brandName}
            onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="externalPurchaseLink">Purchase Link</Label>
          <Input
            id="externalPurchaseLink"
            value={formData.externalPurchaseLink}
            onChange={(e) => setFormData({ ...formData, externalPurchaseLink: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="isVerified">Verified Status</Label>
            <p className="text-sm text-gray-500">Mark this product as verified</p>
          </div>
          <Switch
            id="isVerified"
            checked={formData.isVerified}
            onCheckedChange={onVerificationToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};
