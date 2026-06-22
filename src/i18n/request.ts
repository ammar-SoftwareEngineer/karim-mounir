import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

const locales = ["en", "ar"] as const;
const namespaces = ["home", "header"] as const;

export default getRequestConfig(async () => {
  const h = await headers();
  const raw = h.get("x-next-intl-locale") ?? "en";
  const locale = raw.toLowerCase() as (typeof locales)[number];

  if (!locales.includes(locale as "en" | "ar")) notFound();

  const messages = Object.fromEntries(
    await Promise.all(
      namespaces.map(async (ns) => {
        const mod = await import(`../../messages/${locale}/${ns}.json`);
        return [ns, mod.default] as const;
      })
    )
  );

  return { locale, messages };
});
