export default function ComingSoon() {
  return (
    <div
      className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4"
      dir="rtl"
    >
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-yellow-400/30 bg-yellow-500/10 mb-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-10 h-10 text-yellow-400"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">تم تعطيل الموقع مؤقتاً</h1>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4" />
        <p className="text-white/50 text-sm leading-relaxed">
          نعتذر عن الإزعاج، سنعود قريباً.
        </p>
      </div>
    </div>
  )
}
