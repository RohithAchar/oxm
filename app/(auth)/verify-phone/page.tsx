import OTPForm from "@/components/otp-form";
import OTPProvider from "@/components/otp-provider";


export default function Home() {
  return (
    <main className="p-8">
      <OTPProvider />
      <h1 className="text-xl font-bold mb-4">MSG91 OTP Example</h1>
      <OTPForm />
    </main>
  );
}
