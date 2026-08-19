export type VisitorPass = {
  id: string;
  visitorName: string;
  visitorMobile: string;
  houseNumber: string;
  visitType: string;
  purpose?: string;
  vehicleNumber?: string;
  visitDate: string;
  arrivalTime: string;
  departureTime: string;
  otp: string;
  otpExpiresAt: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'REVOKED';
};

// Fixture state (in-memory for development only)
const passes: VisitorPass[] = [];

export const VisitorPassService = {
  createPass(data: Omit<VisitorPass, 'id' | 'otp' | 'otpExpiresAt' | 'status'>): VisitorPass {
    const newPass: VisitorPass = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      otp: Math.floor(1000 + Math.random() * 9000).toString(), // 4 digit OTP
      otpExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
    };
    passes.push(newPass);
    return newPass;
  },

  getPasses(houseNumber: string): VisitorPass[] {
    return passes.filter(p => p.houseNumber === houseNumber);
  },

  revokePass(id: string): void {
    const p = passes.find(p => p.id === id);
    if (p) p.status = 'REVOKED';
  },

  verifyPass(otp: string, houseNumber: string): boolean {
    const p = passes.find(p => p.otp === otp && p.houseNumber === houseNumber);
    if (!p) return false;
    if (p.status !== 'ACTIVE') return false;
    if (new Date(p.otpExpiresAt) < new Date()) return false;
    return true;
  }
};
