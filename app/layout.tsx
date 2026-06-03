import './globals.css';
import AuthNav from './components/AuthNav';

export const metadata = {
  title: 'EKKO | A Place to Belong',
  description: 'A Jesus-centered community movement for prayer, praise, Scripture, groups, events, and belonging.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthNav />
        {children}
      </body>
    </html>
  );
}
