import * as Popover from "@radix-ui/react-popover";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";

export function AccountMenu() {
  const { user, isPending } = useCurrentUserState();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isPending) {
    return <div className="size-10 shrink-0 animate-pulse rounded-sm bg-secondary" aria-hidden />;
  }
  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link to="/login">Entrar</Link>
      </Button>
    );
  }

  const label = user.displayName || user.primaryEmail || "Conta";
  const initial = label.charAt(0).toUpperCase();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-brand text-sm font-medium text-accent-fg"
          aria-label={`Conta de ${label}`}
        >
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="" className="size-10 object-cover" />
          ) : (
            initial
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-64 rounded-md border border-border bg-surface p-3 shadow-card outline-none"
        >
          <p className="truncate text-sm font-medium">{label}</p>
          {user.primaryEmail ? <p className="truncate text-help text-muted">{user.primaryEmail}</p> : null}
          <button
            type="button"
            disabled={signingOut}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-secondary text-sm hover:bg-border disabled:opacity-50"
            onClick={() => {
              setError(null);
              setSigningOut(true);
              void signOut("/login").catch(() => {
                setSigningOut(false);
                setError("Não foi possível sair. Tente de novo.");
              });
            }}
          >
            <LogOut className="size-4" strokeWidth={1.75} />
            {signingOut ? "Saindo…" : "Sair"}
          </button>
          {error ? <p className="mt-2 text-help text-danger">{error}</p> : null}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
