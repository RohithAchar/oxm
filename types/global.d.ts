export {};

declare global {
  interface Window {
    sendOtp?: (
      identifier: string,
      success?: (data: any) => void,
      failure?: (err: any) => void
    ) => void;

    verifyOtp?: (
      otp: string | number,
      success?: (data: any) => void,
      failure?: (err: any) => void,
      reqId?: string
    ) => void;

    retryOtp?: (
      channel: string | null,
      success?: (data: any) => void,
      failure?: (err: any) => void,
      reqId?: string
    ) => void;

    getWidgetData?: () => any;
    isCaptchaVerified?: () => boolean;

    /** 👇 this is the missing one */
    initSendOTP?: (config: Record<string, any>) => void;
  }
}
