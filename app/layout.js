import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata = {
  title: "ملتقى — منصة وظائف السودان",
  description: "وين الشغل يلقى صاحبه. منصة وظائف تغطي التاكسي، العمال، المهندسين، الدكاترة — بشهادة أو بدون.",
  manifest: "/manifest.json",
  themeColor: "#0E3B4D",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0E3B4D",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" href="/icons/icon-192.png" />
      </head>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
