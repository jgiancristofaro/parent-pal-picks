
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface FormData {
  full_name: string;
  identity_tag: string;
  bio: string;
  username: string;
  avatar_url: string;
}

interface ProfileFormFieldsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  setValue: (name: keyof FormData, value: string) => void;
  watchedUsername: string;
  watchedIdentityTag: string;
  isAvailable: boolean | null;
  isChecking: boolean;
}

export const ProfileFormFields = ({
  register,
  errors,
  setValue,
  watchedUsername,
  watchedIdentityTag,
  isAvailable,
  isChecking
}: ProfileFormFieldsProps) => {
  const getUsernameStatus = () => {
    if (!watchedUsername || watchedUsername.length < 3) return null;
    if (isChecking) return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    if (isAvailable === true) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (isAvailable === false) return <XCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <>
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
        <Select 
          value={watchedIdentityTag} 
          onValueChange={(value) => setValue('identity_tag', value)}
        >
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
    </>
  );
};
