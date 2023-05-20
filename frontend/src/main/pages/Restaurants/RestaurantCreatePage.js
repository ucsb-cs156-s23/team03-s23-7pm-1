// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import RestaurantForm from "main/components/Restaurants/RestaurantForm";
// import { useNavigate } from 'react-router-dom'
// import { restaurantUtils } from 'main/utils/restaurantUtils';

// export default function RestaurantCreatePage() {

//   let navigate = useNavigate(); 

//   const onSubmit = async (restaurant) => {
//     const createdRestaurant = restaurantUtils.add(restaurant);
//     console.log("createdRestaurant: " + JSON.stringify(createdRestaurant));
//     navigate("/restaurants");
//   }  

//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         <h1>Create New Restaurant</h1>
//         <RestaurantForm submitAction={onSubmit} />
//       </div>
//     </BasicLayout>
//   )
// }

//Changes to connect backend to frontend
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RestaurantCreatePage() {

  const objectToAxiosParams = (restaurant) => ({
    url: "/api/restaurants/post",
    method: "POST",
    params: {
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      roachCounter: restaurant.roachCounter
    }
  });

  const onSuccess = (restaurant) => {
    toast(`New restaurant Created - id: ${restaurant.id} name: ${restaurant.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/restaurants/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/restaurants/" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Restaurant</h1>

        <RestaurantForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}