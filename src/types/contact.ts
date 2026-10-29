export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
};
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;
export type ContactResult = {
  status: "idle" | "error" | "success";
  message: string;
  errors?: ContactErrors;
};
