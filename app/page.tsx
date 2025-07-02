// app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[--accent]">
          Pomozone
        </h1>
        <p className="mt-2 text-[--comment]">
          // status: system is booting... =/= {/* debugging ligature */}
        </p>
      </div>
    </main>
  );
}
