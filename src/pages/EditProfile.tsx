
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useEditProfile } from '@/hooks/useEditProfile';
import { useUsernameAvailability } from '@/hooks/useUsernameAvailability';
import { Skeleton } from '@/components/ui/skeleton';

interface FormData {
  full_name: string;
  identity_tag: string;
  bio: string;
  username: string;
  avatar_url: string;
}

const EditProfile = () => {
  const { profile, isLoading } = useProfile();
  const { updateProfile, isUpdating, uploadAvatar, isUploading } = useEditProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>();
  
  const watchedUsername = watch('username') || '';
  const { isAvailable, isChecking } = useUsernameAvailability(watchedUsername);

  // Initialize form with profile data
  useState(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        identity_tag: profile.identity_tag || 'Parent',
        bio: profile.bio || '',
        username: profile.username || '',
        avatar_url: profile.avatar_url || '',
      });
      setPreviewUrl(profile.avatar_url || '');
    }
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const avatarUrl = await uploadAvatar(file);
      setValue('avatar_url', avatarUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const onSubmit = (data: FormData) => {
    updateProfile(data);
  };

  const getUsernameStatus = () => {
    if (!watchedUsername || watchedUsername.length < 3) return null;
    if (isChecking) return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    if (isAvailable === true) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (isAvailable === false) return <XCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Edit Profile" showBack={true} backTo="/profile" />
        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <Skeleton className="w-24 h-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Edit Profile" showBack={true} backTo="/profile" />
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={previewUrl || profile?.avatar_url || ''} 
                alt="Profile" 
                className="object-cover"
              />
              <AvatarFallback>
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-purple-500 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="full_name">Name</Label>
          <Input
            id="full_name"
            {...register('full_name', { required: 'Name is required' })}
            placeholder="Enter your full name"
          />
          {errors.full_name && (
            <p className="text-sm text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        {/* Identity Tag Field */}
        <div className="space-y-2">
          <Label htmlFor="identity_tag">Identity Tag</Label>
          <Select onValueChange={(value) => setValue('identity_tag', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your identity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Mom">Mom</SelectItem>
              <SelectItem value="Dad">Dad</SelectItem>
              <SelectItem value="Guardian">Guardian</SelectItem>
              <SelectItem value="Grandparent">Grandparent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input
              id="username"
              {...register('username', { 
                minLength: { value: 3, message: 'Username must be at least 3 characters' }
              })}
              placeholder="Enter your username"
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {getUsernameStatus()}
            </div>
          </div>
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
          {watchedUsername.length >= 3 && isAvailable === false && (
            <p className="text-sm text-red-500">Username is already taken</p>
          )}
          {watchedUsername.length >= 3 && isAvailable === true && (
            <p className="text-sm text-green-500">Username is available</p>
          )}
        </div>

        {/* Bio Field */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            {...register('bio')}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isUpdating || isUploading || (watchedUsername.length >= 3 && isAvailable === false)}
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating Profile...
            </>
          ) : (
            'Update Profile'
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;
