import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cruzandoelcharco.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl.replace(/\/$/, "");

  const routes = [
    "",
    "/guia",
    "/articulos",
    "/recursos",
    "/actividades",
    "/barcelona",
    "/chat",
  ];

  const articles = [
    "asilo-espana-2024",
    "empadronamiento-sin-papeles",
    "arraigo-social-requisitos",
    "salud-mental-migrantes-lgbt",
    "prep-pep-acceso-espana",
    "vivienda-barcelona-migrantes",
    "trabajo-derechos-basicos",
    "comunidad-lgbt-barcelona",
    "emergencias-violencia-genero",
    "traduccion-documentos",
  ];

  const resources = [
    "acnur-espana",
    "cruz-roja-migrantes",
    "cesida-vih",
    "obsida-barcelona",
    "sap-barcelona",
    "acathia-lgbt",
    "observatorio-odio",
    "sjd-barcelona",
    "casip-cajamar",
    "mes-dona-barcelona",
  ];

  const events = [
    "formacion-empoderamiento",
    "grupo-apoyo-semanal",
    "taller-derechos",
    "cultura-lgbt",
    "formacion-empleo",
  ];

  const urls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    })),
    ...articles.map((slug) => ({
      url: `${baseUrl}/articulos/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    ...resources.map((slug) => ({
      url: `${baseUrl}/recursos/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...events.map((slug) => ({
      url: `${baseUrl}/actividades/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];

  return urls;
}