//update to connect to backend
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantTable from "main/components/Restaurants/RestaurantTable";
import { useBackend } from "main/utils/useBackend";

export default function RestaurantDetailsPage() {
    let { id } = useParams();

    const { data: restaurant, error, status } = useBackend(
        // Stryker disable next-line all : don't test internal caching of ReactQuery
        [`/api/restaurants?id=${id}`],
        {
            // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: "/api/restaurants",
            params: { id }
        }
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Restaurant Details</h1>
        {restaurant && <RestaurantTable restaurants={[restaurant]} showButtons={false} />}
      </div>
    </BasicLayout>
  )
}