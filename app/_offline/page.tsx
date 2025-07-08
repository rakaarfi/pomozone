// app/_offline/page.tsx
export default function OfflinePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-[--accent]">
                    You are offline
                </h1>
                <p className="mt-2 text-[--comment]">
                    Please check your internet connection to use PomoZone.
                </p>
            </div>
        </main>
    );
}