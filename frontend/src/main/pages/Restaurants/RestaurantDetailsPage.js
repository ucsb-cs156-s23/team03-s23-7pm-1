// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import { useParams } from "react-router-dom";
// import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
// import { restaurantUtils } from 'main/utils/restaurantUtils';

// export default function RestaurantDetailsPage() {
//   let { id } = useParams();

//   const response = restaurantUtils.getById(id);

//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         <h1>Restaurant Details</h1>
//         <RestaurantTable restaurants={[response.restaurant]} showButtons={false} />
//       </div>
//     </BasicLayout>
//   )
// }

//update to connect to backend

import React from 'react'
import { useBackend, useBackendMutation } from 'main/utils/useBackend';
import { useParams } from "react-router-dom";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import { useCurrentUser } from 'main/utils/currentUser'


export default function RestaurantDetailsPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const { data: restaurant, error: _error, status: _status } =
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

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Restaurant Details</h1>
        <RestaurantTable restaurants={[restaurant]} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}