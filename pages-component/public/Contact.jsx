export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-10">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">
          Contact Us
        </h1>

        {/* Intro */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          We'd love to hear from you. Whether you have questions about your
          order, need technical assistance, or want to share feedback about
          our service, our support team is here to help.
        </p>

        {/* Contact Details */}
        <p className="text-gray-700 mb-3">
          <span className="font-semibold">Customer Support Email:</span>{' '}
          support@foodexpress.com
        </p>

        <p className="text-gray-700 mb-3">
          <span className="font-semibold">Phone:</span> +91 98765 43210
        </p>

        <p className="text-gray-700 mb-3">
          <span className="font-semibold">Business Hours:</span> Monday - Sunday, 8:00 AM to 11:00 PM
        </p>

        {/* Address */}
        <div className="text-gray-700 mb-4">
          <span className="font-semibold">Head Office:</span>
          <div className="ml-4 mt-1">
            Food Express Pvt. Ltd.<br />
            Panvel, Maharashtra, India
          </div>
        </div>

        {/* Partnership */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          For restaurant partnerships, delivery partner registrations, or
          business inquiries, please contact us at:
        </p>

        <p className="text-gray-800 font-semibold mb-4">
          partners@foodexpress.com
        </p>

        {/* Footer note */}
        <p className="text-gray-600 text-sm">
          We aim to respond to all customer inquiries within 24 hours.
        </p>

      </div>
    </div>
  );
}