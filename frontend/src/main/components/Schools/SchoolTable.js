import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/schoolUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function SchoolTable({
        schools,
        currentUser,
        showButtons = true}) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/school/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/school/details/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/school/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


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
            Header: 'District',
            accessor: 'district',
        },
        {
            Header: 'Grade Range',
            accessor: 'grade range',
        }
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, "SchoolTable"),
        ButtonColumn("Edit", "primary", editCallback, "SchoolTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "SchoolTable"),
    ]

    const columnsToDisplay = (showButtons && hasRole(currentUser, "ROLE_USER")) ? buttonColumns : columns;

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columnsToDisplay, [columnsToDisplay]);
    const memoizedSchools = React.useMemo(() => schools, [schools]);

    return <OurTable
        data={memoizedSchools}
        columns={memoizedColumns}
        testid={"SchoolTable"}
    />;
};