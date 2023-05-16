import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { parkUtils } from "main/utils/parkUtils";

const showCell = (cell) => JSON.stringify(cell.row.values);


const defaultDeleteCallback = async (cell) => {
    console.log(`deleteCallback: ${showCell(cell)})`);
    parkUtils.del(cell.row.values.id);
}

export default function ParkTable({
    parks,
    deleteCallback = defaultDeleteCallback,
    showButtons = true,
    testIdPrefix = "ParkTable" }) {

    const navigate = useNavigate();
 
    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)})`);
        navigate(`/parks/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)})`);
        navigate(`/parks/details/${cell.row.values.id}`)
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
            Header: 'State',
            accessor: 'state',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Acres',
            accessor: 'acres',
        }
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
        ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
        ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    ]

    const columnsToDisplay = showButtons ? buttonColumns : columns;

    return <OurTable
        data={parks}
        columns={columnsToDisplay}
        testid={testIdPrefix}
    />;
};

export { showCell };