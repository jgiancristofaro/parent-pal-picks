
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useValidateReferralCode } from '@/hooks/useReferralSystem';
import { CheckCircle, AlertCircle, UserPlus } from 'lucide-react';

interface ReferralCodeStepProps {
  referralCode: string;
  setReferralCode: (code: string) => void;
  onNext: () => void;
  onSkip: () => void;
}

export const ReferralCodeStep = ({ 
  referralCode, 
  setReferralCode, 
  onNext, 
  onSkip 
}: ReferralCodeStepProps) => {
  const [validationResult, setValidationResult] = useState<{ valid: boolean; referrerName?: string } | null>(null);
  const validateMutation = useValidateReferralCode();

  const handleValidateCode = async () => {
    if (!referralCode.trim()) return;

    try {
      const result = await validateMutation.mutateAsync(referralCode.trim());
      setValidationResult({ valid: true, referrerName: result.full_name });
    } catch (error) {
      setValidationResult({ valid: false });
    }
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <UserPlus className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <CardTitle>Do you have a referral code?</CardTitle>
          <CardDescription>
            If a friend invited you to ParentPal, enter their referral code here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter referral code (optional)"
              value={referralCode}
              onChange={(e) => {
                setReferralCode(e.target.value.toUpperCase());
                setValidationResult(null);
              }}
              className="text-center font-mono text-lg"
              maxLength={8}
            />
            
            {referralCode.trim() && !validationResult && (
              <Button
                variant="outline"
                onClick={handleValidateCode}
                disabled={validateMutation.isPending}
                className="w-full"
              >
                {validateMutation.isPending ? 'Validating...' : 'Validate Code'}
              </Button>
            )}

            {validationResult && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                validationResult.valid 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {validationResult.valid ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">
                      Great! You were referred by <strong>{validationResult.referrerName}</strong>
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">
                      Invalid referral code. Please check and try again.
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleContinue}
              className="flex-1"
              disabled={referralCode.trim() && !validationResult?.valid}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
