export default function StudentAccommodation() {
  return (
    <section
      className="
        bg-slate-50 px-6 py-20
        transition-colors duration-200
        dark:bg-slate-950
        sm:px-8 lg:px-12
      "
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">

          {/* Section Heading */}
          <h2
            className="
              text-3xl font-bold tracking-tight text-slate-900
              transition-colors duration-200
              dark:text-white
              sm:text-4xl
            "
          >
            Student accommodation in Zimbabwe
          </h2>

          {/* Paragraph 1 */}
          <p
            className="
              mt-6 text-base leading-8 text-slate-600
              transition-colors duration-200
              dark:text-slate-300
              sm:text-lg
            "
          >
            <span className="font-semibold text-slate-900 dark:text-white">
              MushaLink
            </span>{" "}
            is a student accommodation marketplace built to help students
            find suitable places to live near their university. Browse rooms,
            shared accommodation, houses and other student-friendly properties
            across Zimbabwe, with clear pricing, property details and location
            information.
          </p>

          {/* Paragraph 2 */}
          <p
            className="
              mt-5 text-base leading-8 text-slate-600
              transition-colors duration-200
              dark:text-slate-300
              sm:text-lg
            "
          >
            Whether you're looking for accommodation near UZ, NUST, MSU,
            Africa University, HIT, Chinhoyi University or another university,
            MushaLink makes it easier to explore available options and compare
            properties in one place.
          </p>

          {/* Paragraph 3 */}
          <p
            className="
              mt-5 text-base leading-8 text-slate-600
              transition-colors duration-200
              dark:text-slate-300
              sm:text-lg
            "
          >
            From private rooms and shared spaces to entire properties,
            students can view photos, amenities, utilities, pricing and other
            important details before contacting a landlord. Our goal is to
            make finding student accommodation simpler, more transparent and
            safer for students across Zimbabwe.
          </p>

        </div>
      </div>
    </section>
  );
}