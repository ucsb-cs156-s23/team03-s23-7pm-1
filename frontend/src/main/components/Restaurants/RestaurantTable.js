// import React from "react";
// import OurTable, { ButtonColumn } from "main/components/OurTable";
// import { useNavigate } from "react-router-dom";
// import { restaurantUtils } from "main/utils/restaurantUtils";

// const showCell = (cell) => JSON.stringify(cell.row.values);


// const defaultDeleteCallback = async (cell) => {
//     console.log(`deleteCallback: ${showCell(cell)})`);
//     restaurantUtils.del(cell.row.values.id);
// }

// export default function RestaurantTable({
//     restaurants,
//     deleteCallback = defaultDeleteCallback,
//     showButtons = true,
//     testIdPrefix = "RestaurantTable" }) {

//     const navigate = useNavigate();
 
//     const editCallback = (cell) => {
//         console.log(`editCallback: ${showCell(cell)})`);
//         navigate(`/restaurants/edit/${cell.row.values.id}`)
//     }

//     const detailsCallback = (cell) => {
//         console.log(`detailsCallback: ${showCell(cell)})`);
//         navigate(`/restaurants/details/${cell.row.values.id}`)
//     }

//     const columns = [
//         {
//             Header: 'id',
//             accessor: 'id', // accessor is the "key" in the data
//         },

//         {
//             Header: 'Name',
//             accessor: 'name',
//         },
//         {
//             Header: 'Cuisine',
//             accessor: 'cuisine',
//         },
//         {
//             Header: 'Roach Counter',
//             accessor: 'roach counter',
//         }
//     ];

//     const buttonColumns = [
//         ...columns,
//         ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
//         ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
//         ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
//     ]

//     const columnsToDisplay = showButtons ? buttonColumns : columns;

//     return <OurTable
//         data={restaurants}
//         columns={columnsToDisplay}
//         testid={testIdPrefix}
//     />;
// };

// export { showCell };

//update to connect to backend

import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/restaurantUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

//const showCell = (cell) => JSON.stringify(cell.row.values);

export default function RestaurantTable({ restaurants, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/restaurants/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/restaurants/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const detailsCallback = (cell) => {
        navigate(`/restaurants/details/${cell.row.values.id}`)
    }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Cuisine',
            accessor: 'cuisine',
        },
        {
            Header: 'Roach Counter',
            accessor: 'roachCounter',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Details", "primary", detailsCallback, "RestaurantTable"));
        columns.push(ButtonColumn("Edit", "primary", editCallback, "RestaurantTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "RestaurantTable"));
    } 

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedDates = React.useMemo(() => restaurants, [restaurants]);

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"RestaurantTable"}
    />;
};