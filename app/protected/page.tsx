import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { UserCircle } from "lucide-react";
import { Suspense } from "react";

async function AccountDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const email = data.claims.email as string | undefined;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Signed in as</p>
      <p className="text-lg font-medium">{email}</p>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12 max-w-2xl mx-auto p-6">
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center gap-2">
          <UserCircle size={24} />
          <h1 className="font-bold text-2xl">My Account</h1>
        </div>
        <Suspense>
          <AccountDetails />
        </Suspense>
      </div>
    </div>
  );
}
