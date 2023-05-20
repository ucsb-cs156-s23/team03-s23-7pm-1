
// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import { useParams } from "react-router-dom";
// import { restaurantUtils }  from 'main/utils/restaurantUtils';
// import RestaurantForm from 'main/components/Restaurants/RestaurantForm';
// import { useNavigate } from 'react-router-dom'


// export default function RestaurantEditPage() {
//     let { id } = useParams();

//     let navigate = useNavigate(); 

//     const response = restaurantUtils.getById(id);

//     const onSubmit = async (restaurant) => {
//         const updatedRestaurant = restaurantUtils.update(restaurant);
//         console.log("updatedRestaurant: " + JSON.stringify(updatedRestaurant));
//         navigate("/restaurants");
//     }  

//     return (
//         <BasicLayout>
//             <div className="pt-2">
//                 <h1>Edit Restaurant</h1>
//                 <RestaurantForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.restaurant}/>
//             </div>
//         </BasicLayout>
//     )
// }

//update to connect to backend
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function RestaurantEditPage() {
  let { id } = useParams();

  const { data: restaurant, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/restaurants?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/restaurants`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (restaurant) => ({
    url: "/api/restaurants",
    method: "PUT",
    params: {
      id: restaurant.id,
    },
    data: {
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      roachCounter: restaurant.roachCounter
    }
  });

  const onSuccess = (restaurant) => {
    toast(`Restaurant Updated - id: ${restaurant.id} name: ${restaurant.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/restaurants?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/restaurants" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Restaurant</h1>
        {restaurant &&
          <RestaurantForm initialRestaurant={restaurant} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

