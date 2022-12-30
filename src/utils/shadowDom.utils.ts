export const attatchShadowDom = ({
  host,
  manager,
  styleUrl,
}: {
  host: HTMLElement;
  manager: HTMLElement;
  styleUrl: string;
}) => {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = styleUrl;

  // Fonts only work when added in host document head

  const linkNode = document.createElement("link");
  linkNode.type = "text/css";
  linkNode.rel = "stylesheet";
  linkNode.href =
    "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap";
  document.head.appendChild(linkNode);

  // Add font for material icons

  const linkNode2 = document.createElement("link");
  linkNode2.type = "text/css";
  linkNode2.rel = "stylesheet";
  linkNode2.href =
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,1,-50..200";
  document.head.appendChild(linkNode2);

  const shadow = host.attachShadow({ mode: "open" });
  shadow.appendChild(manager);
  shadow.appendChild(link);
};
