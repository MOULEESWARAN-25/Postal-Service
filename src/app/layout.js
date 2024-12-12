import "./globals.css";
import { Inter } from "next/font/google";
import FloatingChatbot from "./query-resolver/page";
import ClientHeader from "./clientHeader";
import PostOfficeSchemesBotUI from "./rag/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PostalService",
  description:
    "PostalService is a web application that helps postal offices to suggest shipping schemes based on the user's location/region and package details. It uses AI to generate responses based on the input provided by the user.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className={inter.className}>
        <main className="flex h-screen bg-white text-gray-100 overflow-hidden">
          <div className="flex flex-col flex-1 h-full overflow-y-auto">
            <ClientHeader />
            {children}
            <PostOfficeSchemesBotUI />
          </div>
        </main>
      </body>
    </html>
  );
}


