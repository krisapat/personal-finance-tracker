import { Mitr } from "next/font/google";
import "./globals.css";
import Providers from "./Provider";
import { ClerkProvider } from "@clerk/nextjs";

const mitr = Mitr({
  subsets: ["thai", "latin"], // โหลดทั้งไทยและอังกฤษ
  weight: ["300", "400", "500", "600", "700"], // เลือกน้ำหนักที่ต้องการ
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <html lang="en" suppressHydrationWarning className={`${mitr.className}`}>
          <body className="overflow-x-hidden ">
            <Providers>
              <main className="my-15 sm:my-20 mx-5">
                {children}
              </main>
            </Providers>
          </body>
        </html>
    </ClerkProvider>
  );
}
