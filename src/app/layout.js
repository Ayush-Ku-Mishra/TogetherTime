import "./globals.css";

export const metadata = {
  title: "TogetherTime",
  description: "Spend real moments together, from anywhere",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
