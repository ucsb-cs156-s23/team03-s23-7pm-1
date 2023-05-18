import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchoolTable from 'main/components/Schools/SchoolTable';
import { schoolUtils } from 'main/utils/schoolUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function SchoolIndexPage() {

    const navigate = useNavigate();

    const schoolCollection = schoolUtils.get();
    const schools = schoolCollection.schools;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`SchoolIndexPage deleteCallback: ${showCell(cell)})`);
        schoolUtils.del(cell.row.values.id);
        navigate("/schools");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/schools/create">
                    Create School
                </Button>
                <h1>Schools</h1>
                <SchoolTable schools={schools} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}
