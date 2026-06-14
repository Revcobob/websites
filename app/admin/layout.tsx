import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from '@/components/admin/Toast';
import { clerkConfigured } from '@/lib/env';

export const metadata = { title: 'Foundation CMS · Memory Health Life Center' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!clerkConfigured()) {
    return <ToastProvider>{children}</ToastProvider>;
  }
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#0F4C4A',
          colorText: '#1F2421',
          colorBackground: '#F7F2EA',
          colorInputBackground: '#FFFFFF',
          colorInputText: '#1F2421',
          borderRadius: '0.75rem',
          fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
        },
        elements: {
          card: 'shadow-soft border border-sand-deep rounded-2xl',
          formButtonPrimary: 'bg-teal hover:bg-teal-deep text-sand normal-case font-semibold rounded-full',
          headerTitle: 'font-serif font-semibold',
          headerSubtitle: 'text-ink-mute'
        }
      }}
    >
      <ToastProvider>{children}</ToastProvider>
    </ClerkProvider>
  );
}
