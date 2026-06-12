import React from "react";

const Profile = () => {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    address:
      "Flat 101, Palm Residency, Mumbai, Maharashtra",
  };

  return (
    <div className="bg-gray-100 p-6 w-full min-w-[325px] mt-10">
      <h1 className="text-3xl font-bold mb-8">
        My Profile
      </h1>

      <div className="max-w-2xl bg-white p-6 rounded-xl shadow">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {user.name}
            </h2>

            <p className="text-gray-500">
              {user.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-semibold block">
              Phone
            </label>
            <p>{user.phone}</p>
          </div>

          <div>
            <label className="font-semibold block">
              Delivery Address
            </label>
            <p>{user.address}</p>
          </div>
        </div>

        <button className="mt-6 bg-orange-500 text-white px-5 py-2 rounded-lg">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;