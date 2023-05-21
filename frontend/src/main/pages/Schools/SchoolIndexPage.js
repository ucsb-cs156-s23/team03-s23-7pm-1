import React from "react";
import { useBackend } from "main/utils/useBackend";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchoolTable from "main/components/Schools/SchoolTable";
import { useCurrentUser } from "main/utils/currentUser";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function SchoolIndexPage() {
    const currentUser = useCurrentUser();

    const { data: schools, error: _error, status: _status, } = useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        ["/api/schools/all"],
        { method: "GET", url: "/api/schools/all" },
        []
    );

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/schools/create">
                    Create School
                </Button>
                <h1>Schools</h1>
                <SchoolTable schools={schools} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}