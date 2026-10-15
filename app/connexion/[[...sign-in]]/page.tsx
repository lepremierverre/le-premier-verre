import { SignIn } from "@clerk/nextjs";

export default function ConnexionPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-none border-0 bg-transparent",
          },
        }}
      />
    </main>
  );
}
