import { Metadata } from "next";
import AboutPage from "./AboutPage";
import { fetchAboutData } from "@/api/aboutService";
import { AboutResponse } from "@/types/aboutApiTypes";
import { buildPageSeoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const aboutApiData: AboutResponse = await fetchAboutData(locale);

  return buildPageSeoMetadata(aboutApiData?.data?.seo, "About Us");
}

export default async function page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const aboutApiData: AboutResponse = await fetchAboutData(locale);
  const schema = aboutApiData?.data?.seo?.schema;

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
      <AboutPage aboutApiData={aboutApiData}/>
    </>
  );
}
