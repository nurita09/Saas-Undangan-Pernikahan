interface InvitationNotFoundProps {
  message?: string;
}

export default function InvitationNotFound({ message }: InvitationNotFoundProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFBF2] px-6 text-center">
      <p className="text-5xl">💔</p>
      <h1 className="mt-6 font-serif text-2xl text-neutral-800">
        {message || 'Maaf, undangan tidak ditemukan atau belum terdaftar'}
      </h1>
      <p className="mt-3 max-w-sm text-sm text-neutral-500">
        Periksa kembali tautan undangan yang kamu terima, atau hubungi mempelai untuk memastikan
        tautannya sudah benar.
      </p>
    </div>
  );
}
