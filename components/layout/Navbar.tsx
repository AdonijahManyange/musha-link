export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-blue-600">
            Musha<span className="text-green-600">Link</span>
          </h1>
        </div>

        {/* Navigation */}
        <ul className="hidden gap-8 font-medium text-slate-700 md:flex">
          <li className="cursor-pointer hover:text-blue-600">Home</li>
          <li className="cursor-pointer hover:text-blue-600">Browse</li>
          <li className="cursor-pointer hover:text-blue-600">Universities</li>
          <li className="cursor-pointer hover:text-blue-600">About</li>
        </ul>

        {/* Buttons */}
        <div className="flex gap-3">
          <button className="rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
}