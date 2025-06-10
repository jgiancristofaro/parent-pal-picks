
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useEditProfile } from '@/hooks/useEditProfile';
import { useUsernameAvailability } from '@/hooks/useUsernameAvailability';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileImageUpload } from '@/components/profile/ProfileImageUpload';
import { ProfileFormFields } from '@/components/profile/ProfileFormFields';

interface FormData {
  full_name: string;
  identity_tag: string;
  bio: string;
  username: string;
  avatar_url: string;
}

const EditProfile = () => {
  const { data: profile, isLoading } = useProfile();
  const { updateProfile, isUpdating, uploadAvatar, isUploading } = useEditProfile();
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      full_name: '',
      identity_tag: 'Parent',
      bio: '',
      username: '',
      avatar_url: '',
    }
  });
  
  const watchedUsername = watch('username') || '';
  const watchedIdentityTag = watch('identity_tag') || 'Parent';
  const { isAvailable, isChecking } = useUsernameAvailability(watchedUsername);

  // Initialize form with profile data when it loads
  useEffect(() => {
    if (profile) {
      const formData = {
        full_name: profile.full_name || '',
        identity_tag: profile.identity_tag || 'Parent',
        bio: profile.bio || '',
        username: profile.username || '',
        avatar_url: profile.avatar_url || '',
      };
      
      reset(formData);
      setPreviewUrl(profile.avatar_url || '');
    }
  }, [profile, reset]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Edit Profile" showBack={true} />
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
      <Header title="Edit Profile" showBack={true} />
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Profile Picture Section */}
        <ProfileImageUpload
          previewUrl={previewUrl}
          profileName={profile?.full_name || ''}
          isUploading={isUploading}
          onFileSelect={handleFileSelect}
        />

        {/* Form Fields */}
        <ProfileFormFields
          register={register}
          errors={errors}
          setValue={setValue}
          watchedUsername={watchedUsername}
          watchedIdentityTag={watchedIdentityTag}
          isAvailable={isAvailable}
          isChecking={isChecking}
        />

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
