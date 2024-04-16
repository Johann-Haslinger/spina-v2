export const formatNavLinkAsPath = (link: string) =>
  "/" + link.toLowerCase().replace("ü", "ue");
