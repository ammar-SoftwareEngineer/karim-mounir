"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Linkedin,
  X,
  Send,
  Instagram,
  Youtube
} from "lucide-react";
import { FaWhatsapp as Whatsapp } from "react-icons/fa";
import { sendContactData } from "@/api/contactService";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormSchema } from "../../lib/createFormSchema";
import type { z } from "zod";
import { ContactResponse } from "@/types/contactApiTypes";
import { Link } from "@/navigations";

gsap.registerPlugin(ScrollTrigger);

const ContactPage: React.FC<{ contactApiData: ContactResponse }> = ({
  contactApiData,
}) => {
  const locale = useLocale();
  const schema = createFormSchema(locale);
  type FormValues = z.infer<typeof schema>;

  // console.log("Contact API Data:", contactApiData );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [submitStatus, setSubmitStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const socialRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("home");

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const form = formRef.current;
    const button = submitButtonRef.current;
    const social = socialRef.current;

    const headerEls = section.querySelectorAll(
      ".contact-header h2, .contact-header p",
    );
    const formInputs = [...(form?.querySelectorAll(".form-input") || [])];
    const responseNote = form?.querySelector(".response-time");
    if (button) formInputs.push(button);
    if (responseNote) formInputs.push(responseNote);
    const contactItems = section.querySelectorAll(".contact-item");
    const socialIcons = social?.querySelectorAll(".social-icon") || [];

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(headerEls, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        filter: "blur(4px)",
      });
      gsap.set(formInputs, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        filter: "blur(4px)",
      });
      gsap.set(contactItems, { opacity: 0, y: 20, scale: 0.95 });
      gsap.set(socialIcons, { opacity: 0, y: 20, scale: 0.9 });

      // Animate all together
      const scrollTriggerSettings = {
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none none",
      };

      gsap.to(headerEls, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        delay: 1,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: scrollTriggerSettings,
      });

      gsap.to(formInputs, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        delay: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: scrollTriggerSettings,
      });

      gsap.to(contactItems, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: scrollTriggerSettings,
      });

      gsap.to(socialIcons, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        delay: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: scrollTriggerSettings,
      });
    }, section);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (submitButtonRef.current) {
      const button = submitButtonRef.current;
      const originalText = button.innerHTML;

      try {
        setSubmitStatus(null);
        button.disabled = true;
        button.innerHTML = locale === "en" ? "Sending..." : "جاري الإرسال...";

        const result = await sendContactData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
        });

        if (result.success) {
          button.innerHTML = locale === "en" ? "Sent!" : "تم الإرسال!";
          setSubmitStatus({
            message:
              result.data.message ||
              (locale === "en"
                ? "Message sent successfully"
                : "تم إرسال الرسالة بنجاح"),
            isError: false,
          });
          reset();
          // Snappy click animation
          button.animate(
            [
              { transform: "scale(1)" },
              { transform: "scale(0.9)" },
              { transform: "scale(1)" },
            ],
            { duration: 150, easing: "ease-in-out" },
          );
        } else {
          button.innerHTML = locale === "en" ? "Error!" : "خطأ!";
          setSubmitStatus({
            message:
              result.message ||
              (locale === "en" ? "Something went wrong" : "حدث خطأ ما"),
            isError: true,
          });
          console.error("Submission failed:", result.message);
        }
      } catch (err) {
        button.innerHTML = locale === "en" ? "Error!" : "خطأ!";
        setSubmitStatus({
          message: locale === "en" ? "Something went wrong" : "حدث خطأ ما",
          isError: true,
        });
        console.error("Submission error:", err);
      } finally {
        setTimeout(() => {
          button.innerHTML = originalText;
          button.disabled = false;
        }, 2000);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any) =>
    console.log("Form validation errors:", errors);

  return (
    <div
      className="min-h-screen bg-gradient-to-b py-24 from-[var(--color-dark-gray)] via-[color-mix(in_srgb,var(--color-dark-gray)_70%,var(--color-primary))] to-[var(--color-primary)] flex flex-col items-center justify-start md:justify-center px-4 lg:pb-0 lg:pt-32 lg:pb-10"
      style={
        {
          "--color-primary": "#1a1a1a",
          "--color-dark-gray": "#0e0e0e",
          "--color-deep-gray": "#7a7a7a",
          "--color-mid-gray": "#c8c8c8",
          "--color-main-white": "#ffffff",
        } as React.CSSProperties
      }
    >
      <div ref={sectionRef} className="max-w-6xl w-full">
        {/* Header */}
        <div className="contact-header text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[var(--color-main-white)] mb-4">
            {contactApiData.data.contact_section.title}
          </h2>
          <p className="text-[var(--color-mid-gray)] text-lg capitalize">
            {contactApiData.data.contact_section.short_desc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div ref={formRef}>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              {[
                { id: "name", label: t("name"), type: "text" },
                { id: "email", label: t("email"), type: "email" },
                { id: "phone", label: t("phone"), type: "text" },
                { id: "message", label: t("message"), type: "textarea" },
              ].map(({ id, label, type }) => {
                const error = errors[id as keyof FormValues]?.message;
                const isTextArea = type === "textarea";
                return (
                  <div key={id} className="form-input">
                    <label
                      htmlFor={id}
                      className="block text-[var(--color-mid-gray)] text-sm font-medium mb-2"
                    >
                      {label}
                    </label>
                    {isTextArea ? (
                      <textarea
                        id={id}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        {...register(id as any)}
                        rows={6}
                        className="w-full bg-[color-mix(in_srgb,var(--color-primary)_50%,transparent)] border-1 border-white/15 rounded-lg px-4 py-3 text-[var(--color-main-white)] focus:border-[var(--color-mid-gray)] focus:outline-none transition-all duration-300 resize-none"
                      />
                    ) : (
                      <input
                        type={type}
                        id={id}
                        {...register(id as any)}
                        className="w-full bg-[color-mix(in_srgb,var(--color-primary)_50%,transparent)] border-1 border-white/15 rounded-lg px-4 py-3 text-[var(--color-main-white)] focus:border-[var(--color-mid-gray)] focus:outline-none transition-all duration-300"
                      />
                    )}
                    {error && (
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    )}
                  </div>
                );
              })}

              <button
                ref={submitButtonRef}
                type="submit"
                className="w-full bg-[var(--color-main-white)] text-[var(--color-primary)] font-semibold py-3 rounded-lg hover:bg-[var(--color-mid-gray)] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {t("Send Message")}
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <p className="response-time text-center text-[var(--color-deep-gray)] text-sm mt-4">
                {locale === "en"
                  ? "We Typically Respond Within 24-48 Hours"
                  : "عادةً ما نرد خلال 24-48 ساعة"}
              </p>

              {submitStatus && (
                <div
                  className={`p-4 rounded-lg text-sm font-medium transition-all duration-500 ${
                    submitStatus.isError
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : "bg-green-500/10 text-green-400 border border-green-500/20"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-8 xl:pt-[15px]">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                {
                  Icon: Mail,
                  title: locale === "en" ? "Email" : "البريد الإلكتروني",
                  info: contactApiData.data.contact_data.email,
                  href: `mailto:${contactApiData.data.contact_data.email}`,
                },
                ...(contactApiData.data.contact_data.phone.length > 0
                  ? [
                      {
                        Icon: Phone,
                        title: locale === "en" ? "Phone" : "الهاتف",
                        code: contactApiData.data.contact_data.phone[0].code,
                        info: contactApiData.data.contact_data.phone[0].phone,
                        href: `tel:${contactApiData.data.contact_data.phone[0].phone}`,
                      },
                    ]
                  : []),
                ...(contactApiData.data.contact_data.address.length > 0
                  ? [
                      {
                        Icon: MapPin,
                        title: locale === "en" ? "Location" : "الموقع",
                        info: contactApiData.data.contact_data.address[0]
                          .address,
                        href: `https://maps.google.com/?q=${encodeURIComponent(contactApiData.data.contact_data.address[0].address)}`,
                      },
                    ]
                  : []),
              ].map(({ Icon, title, info, href, code }) => (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith("https") ? "_blank" : undefined}
                  rel={href.startsWith("https") ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 group contact-item cursor-pointer"
                >
                  <div className="w-12 h-12 bg-[color-mix(in_srgb,var(--color-main-white)_10%,transparent)] rounded-lg flex items-center justify-center group-hover:bg-[color-mix(in_srgb,var(--color-main-white)_20%,transparent)] transition-all duration-300">
                    <Icon className="w-5 h-5 text-[var(--color-mid-gray)]" />
                  </div>
                  <div>
                    <h3 className="text-[var(--color-main-white)] font-semibold mb-1">
                      {title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {title === "Phone" && <p className="text-[var(--color-deep-gray)] group-hover:text-[var(--color-mid-gray)] transition-colors duration-300">{code}</p>}
                      <p className="text-[var(--color-deep-gray)] group-hover:text-[var(--color-mid-gray)] transition-colors duration-300">{info}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Media Icons */}
            <div
              ref={socialRef}
              className="pt-8 border-t border-[var(--color-deep-gray)]"
            >
              <h3 className="text-[var(--color-main-white)] font-semibold mb-6">
                {locale === "en" ? "Connect" : "تابعنا"}
              </h3>
              <div className="flex gap-4">
                {[
                  {
                    Icon: Facebook,
                    href: contactApiData.data.social_media.facebook,
                  },
                  {
                    Icon: Linkedin,
                    href: contactApiData.data.social_media.linkedin,
                  },
                  { Icon: X, href: contactApiData.data.social_media.twitter },
                  {
                    Icon: Instagram,
                    href: contactApiData.data.social_media.instagram,
                  },
                  {
                    Icon: Whatsapp,
                    href: `https://wa.me/${contactApiData.data.contact_data.phone[0].code}${contactApiData.data.contact_data.phone[0].phone}`,
                  },
                ]
                  .filter((social) => social.href)
                  .map(({ Icon, href }, i) => (
                    <Link
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon w-12 h-12 bg-[color-mix(in_srgb,var(--color-main-white)_10%,transparent)] rounded-lg flex items-center justify-center hover:bg-[var(--color-main-white)] hover:text-[var(--color-primary)] text-[var(--color-mid-gray)] transition-all duration-300 group"
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
