import React from "react";
import { useBackend } from "main/utils/useBackend";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ParkTable from "main/components/Parks/ParkTable";
import { useCurrentUser } from "main/utils/currentUser";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function ParkIndexPage() {
    const currentUser = useCurrentUser();

    const { data: parks, error: _error, status: _status, } = useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        ["/api/parks/all"],
        { method: "GET", url: "/api/parks/all" },
        []
    );

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/parks/create">
                    Create Park
                </Button>
                <h1>Parks</h1>
                <ParkTable parks={parks} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}
