import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity
} from "../../store/cartSlice";
import { useRouter } from "next/navigation";
import { getAllMenuItems } from "../../app/actions/MenuActions.js";

// const menuItems = [
//   {
//     _id: 1,
//     name: "Margherita Pizza",
//     description: "Classic cheese pizza with fresh basil.",
//     price: 299,
//     image:
//       "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
//   },
//   {
//     _id: 2,
//     name: "Cheese Burger",
//     description: "Juicy beef patty with cheddar cheese.",
//     price: 249,
//     image:
//       "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
//   },
//   {
//     _id: 3,
//     name: "Pasta Alfredo",
//     description: "Creamy Alfredo sauce with parmesan.",
//     price: 349,
//     image:
//       "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
//   },
//   {
//     _id: 4,
//     name: "Chicken Biryani",
//     description: "Fragrant basmati rice with spicy chicken.",
//     price: 399,
//     image:
//       "https://images.unsplash.com/photo-1633945274405-b6c8069047b0",
//   },
//   {
//     _id: 5,
//     name: "Veg Momos",
//     description: "Steamed dumplings stuffed with vegetables.",
//     price: 149,
//     image:
//       "https://images.unsplash.com/photo-1664138218128-2dcf791a9d27",
//   },
//   {
//     _id: 6,
//     name: "French Fries",
//     description: "Crispy golden potato fries served with dip.",
//     price: 129,
//     image:
//       "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
//   },
//   {
//     _id: 7,
//     name: "Grilled Sandwich",
//     description: "Toasted sandwich with veggies and cheese.",
//     price: 179,
//     image:
//       "https://images.unsplash.com/photo-1550507992-eb63ffee0847",
//   },
//   {
//     _id: 8,
//     name: "Chocolate Brownie",
//     description: "Rich and fudgy chocolate dessert.",
//     price: 199,
//     image:
//       "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
//   },
// ];

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();


  const cartItems = useSelector((state) => state.cart.items);
  const getItemInCart = (_id) => {
    return cartItems.find((item) => item._id === _id);
  };

  useEffect(()=>{
    const fetchMenuItems = async () => {
      const menuFromActions = await getAllMenuItems();
      setMenuItems(menuFromActions);
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">
          Food Menu
        </h1>

        {/* ✅ TOP RIGHT PROCEED BUTTON */}
        {cartItems.length > 0 && (
          <button
            onClick={() => router.push("/cart")}
            className="fixed top-2 right-4 bg-green-600 text-white px-5 py-2 mb-4 rounded-lg shadow-lg z-50"
          >
            Proceed to Cart ({cartItems.length})
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {menuItems.map((item) => {
          const cartItem = getItemInCart(item._id);

          return (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold">
                  {item.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">
                    ₹{item.price * (cartItem?.quantity || 1)}
                  </span>

                  {/* NOT IN CART → SHOW ADD BUTTON */}
                  {!cartItem ? (
                    <button
                      onClick={() =>
                        dispatch(addToCart({
                          _id: item._id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          quantity: 1
                        }))
                      }
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    /* IN CART → SHOW CONTROLS */
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          dispatch(
                            decreaseQuantity(item._id)
                          )
                        }
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        -
                      </button>

                      <span className="font-semibold">
                        {cartItem.quantity}
                      </span>

                      <button
                        onClick={() =>
                          dispatch(
                            increaseQuantity(item._id)
                          )
                        }
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;