//update to connect to backend
import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/restaurantUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

const showCell = (cell) => JSON.stringify(cell.row.values);

export default function RestaurantTable({
    restaurants,
    currentUser,
    showButtons = true,
    testIdPrefix = "RestaurantTable",
}) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)}`);
        navigate(`/restaurants/edit/${cell.row.values.id}`);
    };

    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)}`);
        navigate(`/restaurants/details/${cell.row.values.id}`);
    };

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/restaurants/all"]
    );
    // Stryker enable all

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => {
        deleteMutation.mutate(cell);
    };

    const columns = [
        {
            Header: "id",
            accessor: "id", // accessor is the "key" in the data
        },
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: "Cuisine",
            accessor: "cuisine",
        },
        {
            Header: "Roach Counter",
            accessor: "roachCounter",
        },
    ];

    const buttonColumns = [
        ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        buttonColumns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        buttonColumns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    }

    const columnsToDisplay = showButtons ? [...columns, ...buttonColumns] : columns;

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columnsToDisplay, [columnsToDisplay]);
    const memoizedRestaurants = React.useMemo(() => restaurants, [restaurants]);

    return (
        <OurTable
            data={memoizedRestaurants}
            columns={memoizedColumns}
            testid={testIdPrefix}
        />
    );
}

export { showCell };