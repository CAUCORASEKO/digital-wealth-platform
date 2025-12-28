import { useWallet } from '@web3-ai-copilot/wallet';
import { AppLogo } from '../header/AppLogo';
import { Typography } from '@e-burgos/tucu-ui';

export function WalletGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-full max-w-sm rounded-lg border bg-white p-8 text-center">
          <AppLogo className="mx-auto mb-4 h-20 w-20" />

          <Typography tag="h3" className="mb-2 font-semibold">
            Sign in to continue
          </Typography>

          <Typography className="text-sm text-slate-500">
            Connect your account to access your portfolio dashboard.
          </Typography>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}