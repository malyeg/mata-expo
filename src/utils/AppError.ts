import errors from "@/locales/en/errors";
export class AppError extends Error {
  constructor(public code: keyof typeof errors, message?: string) {
    super(message);
  }
}
