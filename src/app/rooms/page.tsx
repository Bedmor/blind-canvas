import { createRoom } from "~/app/actions";
import { auth } from "~/server/auth";

export default async function RoomsPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Kör Kolektif Tuval</h1>
      <p className="text-xl">Draw together without seeing the full picture.</p>
      {session?.user ? (
        <form action={createRoom}>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Yeni Oda Oluştur
          </button>
        </form>
      ) : (
          <p>Oynamak için lütfen giriş yapın.</p>
      )}
    </div>
  );
}
