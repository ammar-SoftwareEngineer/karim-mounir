import { Metadata } from "next";
import ContactPage from "./ContactPage";
import { ContactResponse } from "@/types/contactApiTypes";
import { fetchContactData } from "@/api/contactService";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const contactApiData: ContactResponse = await fetchContactData(locale);

  return buildPageMetadata(contactApiData?.data?.seo, { title: "Contact" });
}

export default async function page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const contactApiData: ContactResponse = await fetchContactData(locale);
  if (!contactApiData || !contactApiData.data) {
    return <ContactPage contactApiData={contactApiData} />;
  }

  const schema = contactApiData.data.seo?.schema;

  return (
    <>
      {schema?.map((schemaItem, index) => (
        <script
          key={`schema-${schemaItem["@type"]}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaItem),
          }}
        />
      ))}
      <ContactPage contactApiData={contactApiData} />
    </>
  );
}
