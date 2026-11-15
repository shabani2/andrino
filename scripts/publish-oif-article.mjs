import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("Configuration Supabase absente.");
const client = createClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } });

const slug = "oif-que-l-afrique-ne-perde-pas-sa-place";
const title = "OIF : que l’Afrique ne perde pas sa place là où se décident les choses";
const summary = "À Phnom Penh, la rivalité entre Kinshasa et Kigali risque de coûter à l’Afrique un poste d’influence dans la Francophonie.";
const body = `Dans la parabole du roi Salomon, deux femmes se disputent un enfant. Le roi propose de le couper en deux. L’une accepte, l’autre renonce à son droit pour que l’enfant vive. Elle est la vraie mère, car elle préfère le voir vivre sans elle que mourir pour elle. À l’approche de l’élection de la personne qui dirigera l’OIF, à Phnom Penh, cette image s’impose.

## Une rivalité qui dépasse l’OIF

Le 16 novembre 2026, les chefs d’État et de gouvernement désigneront la personne qui dirigera l’Organisation internationale de la Francophonie pour la période 2027-2030. Louise Mushikiwabo, en poste depuis 2019, brigue un troisième mandat. Quatre candidatures ont été présentées : la sienne, celles de la Congolaise Juliana Amato Lumumba et de la Mauritanienne Coumba Ba, ainsi que celle du Roumain Dacian Cioloș. La situation peut encore évoluer avant le scrutin.

Il ne faut pas se leurrer : cette course prolonge aussi le conflit entre Kinshasa et Kigali. Depuis trente ans, l’est de la RDC vit une crise sécuritaire dont les conséquences sont lourdes. Des rapports d’experts de l’ONU ont documenté le soutien des forces rwandaises au M23, ce que Kigali conteste. Le Rwanda porte l’histoire du génocide de 1994. La RDC porte les conséquences humaines de décennies de violence à l’est. Chacun a ses blessures et ses raisons. Mais à qui profite ce bras de fer porté sur la scène internationale ? Pas à l’Afrique.

## Un début de campagne discutable

Soyons honnêtes : la candidature de Mme Lumumba, fille de Patrice Emery Lumumba, premier chef de gouvernement du Congo indépendant, assassiné en 1961, porte une charge symbolique forte. Mais elle était peu connue à l’international. Face à une sortante dotée d’un bilan, il fallait une personnalité capable de faire bouger les lignes. À titre personnel, je pense que le Dr Denis Mukwege aurait eu cette stature.

## Le consensus : quelle règle ?

Les communications congolaises du 14 novembre ont présenté une ouverture en faveur de M. Cioloș, puis annoncé le retrait de la candidature de Mme Lumumba pour favoriser une candidature de rassemblement. Selon des informations rapportées par Jeune Afrique, Emmanuel Macron aurait également demandé à Kigali de retirer la candidature de Mme Mushikiwabo. Cette dernière information reste une affirmation de presse.

Je ne conteste pas l’esprit d’apaisement. Mais je pose une question de méthode. Depuis la réforme de 2022, une élection formelle est prévue. Le règlement de l’OIF privilégie le consensus ; si aucun consensus ne se dégage, il prévoit un vote à bulletin secret à la majorité simple. La règle existe donc. Reste à savoir comment les États chercheront un accord sans priver le scrutin de son sens.

## Ce que chacun a à perdre

La RDC est le pays le plus peuplé où le français est langue officielle. Si elle quittait l’OIF, l’organisation perdrait une part considérable de son poids démographique. Mais Kinshasa perdrait aussi des programmes, des appuis et une tribune. Existe-t-il un plan pour pérenniser ces acquis après un retrait ? Je n’en vois pas.

## Des égos aux intérêts de l’Afrique

L’Union africaine réclame depuis longtemps une représentation permanente de l’Afrique au Conseil de sécurité de l’ONU. Le président William Ruto a repris cet appel à New York. Le message est clair : l’Afrique doit être présente là où les décisions se prennent. Comment réclamer cela à l’ONU et laisser la direction d’une grande organisation internationale lui échapper à Phnom Penh ?

Ne laissons pas une rivalité entre deux capitales coûter à l’Afrique un poste d’influence dans l’espace francophone. Mettons les égos de côté, comme la vraie mère devant Salomon. Ce qui compte, c’est que l’Afrique reste dans les lieux où se décide son avenir.

Andrino Akuda

## Sources

OIF, dossier de presse du Sommet de la Francophonie 2026, page 8 : https://www.francophonie.org/sites/default/files/2026-11/Dossier_presse_Sommet_Francophonie_2026.pdf

OIF, réforme de la procédure de désignation : https://www.francophonie.org/pour-la-premiere-fois-la-francophonie-auditionne-les-candidats-a-sa-direction-8573

ONU, rapport du Groupe d’experts sur la RDC : https://digitallibrary.un.org/record/4085466/files/S_2025_446-FR.pdf

Union africaine, position sur la réforme du Conseil de sécurité : https://au.int/en/pressreleases/20260126/auc-chairperson-un-security-council-debate

Présidence du Kenya, déclaration de William Ruto : https://www.president.go.ke/president-ruto-calls-for-reforms-of-the-un/

Communiqués congolais du 14 novembre, rapportés par Actualite.cd et Topdirect : https://actualite.cd/index.php/2026/11/14/francophonie-la-rdc-envisage-de-retirer-sa-candidate-et-de-soutenir-le-roumain-dacian

https://topdirect.cd/publications/6781-oif-la-rdc-annonce-le-retrait-de-la-candidature-de-juliana-lumumba`;

const imagePath = "entries/oif-afrique-place/rdc-rwanda.jpeg";
const imageBytes = await readFile(new URL("../public/images/articles/oif-rdc-rwanda.jpeg", import.meta.url));
const uploaded = await client.storage.from("site-media").upload(imagePath, imageBytes, {
  contentType: "image/jpeg", upsert: true,
});
if (uploaded.error) throw uploaded.error;
const imageUrl = client.storage.from("site-media").getPublicUrl(imagePath).data.publicUrl;

const existing = await client.from("entries").select("id").eq("kind", "article").eq("slug", slug).maybeSingle();
if (existing.error) throw existing.error;
let entryId = existing.data?.id;
if (entryId) {
  const updated = await client.from("entries").update({ cover_path: imageUrl, category_code: "opinion",
    tags: ["Francophonie", "Afrique", "OIF"], featured: true }).eq("id", entryId);
  if (updated.error) throw updated.error;
} else {
  const inserted = await client.from("entries").insert({ kind: "article", slug, cover_path: imageUrl,
    category_code: "opinion", tags: ["Francophonie", "Afrique", "OIF"], featured: true }).select("id").single();
  if (inserted.error) throw inserted.error;
  entryId = inserted.data.id;
}
const oldTranslation = await client.from("entry_translations").select("published_at")
  .eq("entry_id", entryId).eq("locale", "fr").maybeSingle();
if (oldTranslation.error) throw oldTranslation.error;
const saved = await client.from("entry_translations").upsert({
  entry_id: entryId, locale: "fr", title, summary, body, category_label: "Opinion",
  cover_alt: "Cartes de la RDC et du Rwanda aux couleurs de leurs drapeaux",
  state: "published", published_at: oldTranslation.data?.published_at ?? new Date().toISOString(),
  seo_title: title, seo_description: summary,
}, { onConflict: "entry_id,locale" });
if (saved.error) throw saved.error;
console.log(`Publié : /fr/writing/${slug}`);
