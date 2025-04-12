import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

interface CheckTokenProps {
  token: string;
  passwordChangedAt: Date | null;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

export const checkToken = ({
  token,
  passwordChangedAt,
}: CheckTokenProps): { valid: boolean; userId?: string; message?: string } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    if (passwordChangedAt) {
      const changedAtTimestamp = Math.floor(passwordChangedAt.getTime() / 1000);
      if (decoded.iat < changedAtTimestamp) {
        return {
          valid: false,
          message: "Token no longer valid",
        };
      }
    }

    return { valid: true, userId: decoded.userId };
  } catch (error) {
    return { valid: false, message: "Invalid or expired token." };
  }
};
