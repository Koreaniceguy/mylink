import { ProfileInfo, ContactInfo } from "@/types";

export function generateVCard(profile: ProfileInfo, contact: ContactInfo): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN;CHARSET=UTF-8:${profile.name || "MyLink User"}`,
    `N;CHARSET=UTF-8:${profile.name || "User"};;;;`,
  ];

  if (profile.role) {
    lines.push(`TITLE;CHARSET=UTF-8:${profile.role}`);
  }

  if (profile.bio) {
    lines.push(`NOTE;CHARSET=UTF-8:${profile.bio.replace(/\n/g, "\\n")}`);
  }

  if (contact.email) {
    lines.push(`EMAIL;TYPE=INTERNET,PREF:${contact.email}`);
  }

  if (contact.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${contact.phone}`);
  }

  if (contact.linkedin) {
    lines.push(`URL;TYPE=LinkedIn:${contact.linkedin}`);
  }

  if (contact.github) {
    lines.push(`URL;TYPE=GitHub:${contact.github}`);
  }

  lines.push("REV:" + new Date().toISOString());
  lines.push("END:VCARD");

  return lines.join("\r\n");
}

export function downloadVCard(profile: ProfileInfo, contact: ContactInfo): void {
  const vcardData = generateVCard(profile, contact);
  const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const fileName = `${(profile.name || "contact").replace(/\s+/g, "_")}.vcf`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
