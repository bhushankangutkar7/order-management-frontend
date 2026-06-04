export default function About() {
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-10">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">
          About Us
        </h1>

        {/* Paragraphs */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          Welcome to Food Express, your trusted online food ordering platform.
          We connect hungry customers with their favorite restaurants and
          deliver delicious meals right to their doorstep.
        </p>

        <p className="text-gray-700 mb-4 leading-relaxed">
          Our mission is to make food ordering simple, fast, and convenient.
          Whether you're craving pizza, burgers, biryani, Chinese cuisine,
          healthy meals, or desserts, Food Express offers a wide variety of
          options from local restaurants and popular food chains.
        </p>

        <p className="text-gray-700 mb-4 leading-relaxed">
          We work closely with restaurant partners and delivery professionals
          to ensure that every order is prepared with care and delivered on
          time. Customer satisfaction remains at the heart of everything we do.
        </p>

        {/* Section title */}
        <p className="text-gray-800 font-semibold mt-6 mb-3">
          Our platform provides:
        </p>

        {/* List */}
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Easy online food ordering</li>
          <li>Real-time order tracking</li>
          <li>Secure online payments</li>
          <li>Fast and reliable delivery</li>
          <li>Exclusive discounts and offers</li>
          <li>Wide selection of restaurants and cuisines</li>
        </ul>

        {/* Footer text */}
        <p className="text-gray-700 mt-6 leading-relaxed">
          Thank you for choosing Food Express. We're committed to delivering
          great food and exceptional service, one order at a time.
        </p>

      </div>
    </div>
  );
}