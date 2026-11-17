import { getCollection } from "astro:content";
export type Lang = "ru" | "en";
export const name = { ru: "Тимур Надршин", en: "Timur Nadrshin" };
export const role = { ru: "Системный аналитик", en: "System analyst" };
export const resume =
  "https://novosibirsk.hh.ru/resume/3d158ee5ff0fda9bdd0039ed1f645444436542";
export const telegram = "https://t.me/nadrshin_t";
export const github = "https://github.com/bivaettttt";
export const categories = {
  academic: {
    title: { ru: "Учебные проекты", en: "Academic projects" },
    desc: {
      ru: "Модели, SQL и прототипы, подготовленные в НГТУ НЭТИ.",
      en: "Models, SQL and prototypes from NSTU NETI coursework.",
    },
  },
  personal: {
    title: { ru: "Личные проекты", en: "Independent projects" },
    desc: {
      ru: "Девять инженерных систем с открытым кодом и проверками.",
      en: "Nine engineering systems with public source code and verification.",
    },
  },
  practice: {
    title: { ru: "Практика", en: "Applied experience" },
    desc: {
      ru: "Производственная практика и командный хакатон.",
      en: "A practical placement and a team hackathon.",
    },
  },
} as const;
export type Category = keyof typeof categories;
export const order = [
  "traceon",
  "nexora",
  "flowent",
  "vaultix",
  "credence",
  "sentrix",
  "wayline",
  "quantara",
  "veridion",
  "bks-architecture",
  "bks-processes",
  "bank",
  "finance",
  "merch",
  "credit-cabinet",
  "bks-technical",
  "erp",
];
export const entries = (await getCollection("projects"))
  .map((entry) => entry.data)
  .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
export type Project = (typeof entries)[number];
export const base = import.meta.env.BASE_URL.replace(/\/$/, "");
export const url = (route: string, lang: Lang = "ru") =>
  [base, ...(lang === "en" ? ["en"] : []), route.replace(/^\/|\/$/g, "")]
    .filter(Boolean)
    .join("/") + "/";
export const asset = (path: string) => base + "/" + path;
export const projectRoute = (project: Project) =>
  `projects/${project.category}/${project.id}`;
export const mediaLink = (path: string) =>
  path.startsWith("https://") ? path : asset(path);
