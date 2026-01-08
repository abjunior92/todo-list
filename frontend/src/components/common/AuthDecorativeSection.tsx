export function AuthDecorativeSection() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-stone-100 to-stone-50 relative overflow-hidden">
      {/* Golden Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #d4af37 1px, transparent 1px),
              linear-gradient(to bottom, #d4af37 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Decorative Elements */}
      <div className="relative w-full h-full p-8 flex flex-col items-center justify-center">
        {/* To Do List Note */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs transform rotate-[-2deg] relative z-10">
          <h3 className="text-black font-semibold text-lg mb-4">To do list</h3>
          <div className="space-y-2">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
              <div key={day} className="flex items-center">
                <span className="text-sm text-gray-600 w-12">{day}</span>
                <div className="flex-1 border-b border-gray-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-8 right-8 text-6xl opacity-30">🌸</div>
        <div className="absolute bottom-16 left-12 text-4xl opacity-30">🌵</div>
        <div className="absolute bottom-8 right-16 text-3xl opacity-30">☕</div>
      </div>
    </div>
  );
}
