declare module "express-xss-sanitizer" {
  import { RequestHandler } from "express";

  interface SanitizeOptions {
    [key: string]: any;
  }

  export function xss(options?: SanitizeOptions): RequestHandler;

  export function sanitize<T = any>(input: T, options?: SanitizeOptions): T;
}
