export default function Home() {
  return (
    <div className="px-4 py-10">

      {/* Hero Section */}
      <div className="text-center py-16 px-6 bg-gray-100 rounded-xl mb-10">
        <h1 className="text-4xl font-bold mb-4">
          🍕 Welcome to Food Express
        </h1>

        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-6">
          Order your favorite meals from the best restaurants in your city.
          Fast delivery, secure payments, and delicious food delivered
          straight to your doorstep.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg">
          Order Now
        </button>
      </div>

      {/* Features Section */}
      <h2 className="text-3xl font-bold text-center mb-8">
        Why Choose Us?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="h-40 bg-white shadow-sm rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">⚡ Fast Delivery</h3>
          <p className="text-gray-600">
            Get your food delivered quickly and reliably by our trusted delivery partners.
          </p>
        </div>

        <div className="h-40 bg-white shadow-sm rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">🍔 Wide Variety</h3>
          <p className="text-gray-600">
            Choose from hundreds of restaurants and cuisines including Indian, Chinese, Italian, and more.
          </p>
        </div>

        <div className="h-40 bg-white shadow-sm rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">💳 Secure Payments</h3>
          <p className="text-gray-600">
            Pay safely using credit cards, debit cards, UPI, wallets, and cash on delivery.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <h2 className="text-3xl font-bold text-center mt-16 mb-8">
        How It Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="h-40 bg-white shadow-sm rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-2">
            1️⃣ Browse Restaurants
          </h3>
          <p className="text-gray-600">
            Explore nearby restaurants and discover your favorite dishes.
          </p>
        </div>

        <div className="h-40 bg-white shadow-sm rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-2">
            2️⃣ Place Your Order
          </h3>
          <p className="text-gray-600">
            Add items to your cart and checkout in just a few clicks.
          </p>
        </div>

        <div className="h-40 bg-white shadow-sm rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-2">
            3️⃣ Enjoy Your Meal
          </h3>
          <p className="text-gray-600">
            Track your order in real-time and enjoy fresh food delivered to your home.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16 p-10 bg-gray-900 text-white rounded-xl">
        <h2 className="text-3xl font-bold mb-4">
          Hungry?
        </h2>

        <p className="text-gray-300 mb-6">
          Discover amazing restaurants and order your favorite food now.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg">
          Start Ordering
        </button>
      </div>

    </div>
  );
}