import { z } from "zod";

type Lang = string;

export const createFormSchema = (lang: Lang) => {
  const t = {
    nameMin:
      lang === "en"
        ? "Name Must Be At Least 4 Characters"
        : "الاسم يجب أن يكون 4 أحرف على الأقل",

    nameMax: lang === "en" ? "Name Is Too Long" : "الاسم طويل جدًا",

    email:
      lang === "en"
        ? "Please Enter A Valid Email Address"
        : "يرجى إدخال بريد إلكتروني صحيح",

    phoneShort:
      lang === "en" ? "Phone Number Is Too Short" : "رقم الهاتف قصير جدًا",

    phoneLong:
      lang === "en" ? "Phone Number Is Too Long" : "رقم الهاتف طويل جدًا",

    phoneInvalid:
      lang === "en"
        ? "Invalid Phone Number Format"
        : "صيغة رقم الهاتف غير صحيحة",

    messageMin:
      lang === "en"
        ? "Message Must Be At Least 10 Characters"
        : "الرسالة يجب أن تكون 10 أحرف على الأقل",

    messageMax: lang === "en" ? "Message Is Too Long" : "الرسالة طويلة جدًا",
  };

  return z
    .object({
      name: z.string().min(4, t.nameMin).max(50, t.nameMax),
      email: z.string().email(t.email),
      phone: z
        .string()
        .min(10, t.phoneShort)
        .max(15, t.phoneLong)
        .regex(/^\+?[0-9\s-]+$/, t.phoneInvalid),
      message: z.string().min(10, t.messageMin).max(500, t.messageMax),
    });
};
