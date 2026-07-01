import { Metadata } from "next";
import ServicesPage from "./ServicesPage";
import { ServicesResponse } from "@/types/servicesApiTypes";
import { fetchServicesData } from "@/api/ServicesService";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const servicesApiData: ServicesResponse = await fetchServicesData(locale);

  return buildPageMetadata(servicesApiData?.data?.seo, { title: "Services" });
}

export default async function page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const servicesApiData: ServicesResponse = await fetchServicesData(locale);
  const schema = servicesApiData?.data?.seo?.schema;

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
      <ServicesPage servicesApiData={servicesApiData} />
    </>
  );
}
