import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/schoolUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

const showCell = (cell) => JSON.stringify(cell.row.values);

export default function SchoolTable({
    schools,
    currentUser,
    showButtons = true,
    testIdPrefix = "SchoolTable",
}) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)}`);
        navigate(`/schools/edit/${cell.row.values.id}`);
    };

    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)}`);
        navigate(`/schools/details/${cell.row.values.id}`);
    };

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/schools/all"]
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
            Header: "District",
            accessor: "district",
        },
        {
            Header: "GradeRange",
            accessor: "gradeRange",
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
    const memoizedSchools = React.useMemo(() => schools, [schools]);

    return (
        <OurTable
            data={memoizedSchools}
            columns={memoizedColumns}
            testid={testIdPrefix}
        />
    );
}

export { showCell };