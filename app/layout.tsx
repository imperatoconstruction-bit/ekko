import './globals.css';

export const metadata = {
  title: 'EKKO | A Place to Belong',
  description: 'A Jesus-centered community movement for prayer, community, Scripture, groups, events, and belonging.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
