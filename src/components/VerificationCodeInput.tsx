import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VerificationCodeInputProps {
  email: string;
  onVerified: () => void;
}

export const VerificationCodeInput = ({ email, onVerified }: VerificationCodeInputProps) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const verifyCode = async () => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('email', email)
        .eq('code', code)
        .gt('expires_at', new Date().toISOString())
        .is('used_at', null)
        .single();

      if (error || !data) {
        toast.error("Invalid or expired verification code");
        return;
      }

      // Mark code as used
      await supabase
        .from('verification_codes')
        .update({ used_at: new Date().toISOString() })
        .eq('id', data.id);

      toast.success("Email verified successfully!");
      onVerified();
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Failed to verify code");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCode = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.functions.invoke('send-verification', {
        body: { email }
      });

      if (error) throw error;
      toast.success("New verification code sent!");
    } catch (error) {
      console.error("Error resending code:", error);
      toast.error("Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground text-center">
          Enter the verification code sent to {email}
        </p>
        <InputOTP
          value={code}
          onChange={setCode}
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup className="gap-2">
              {slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <Button
          onClick={verifyCode}
          disabled={code.length !== 6 || isVerifying}
          className="w-full"
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </Button>
        
        <Button
          variant="ghost"
          onClick={resendCode}
          disabled={isResending}
          className="w-full"
        >
          {isResending ? "Sending..." : "Resend Code"}
        </Button>
      </div>
    </div>
  );
};