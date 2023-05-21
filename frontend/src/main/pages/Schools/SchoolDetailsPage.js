import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import SchoolTable from "main/components/Schools/SchoolTable";
import { useBackend } from "main/utils/useBackend";

export default function SchoolDetailsPage() {
    let { id } = useParams();

    const { data: school, error, status } = useBackend(
        // Stryker disable next-line all : don't test internal caching of ReactQuery
        [`/api/schools?id=${id}`],
        {
            // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: "/api/schools",
            params: { id }
        }
    );

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>School Details</h1>
                {school && <SchoolTable schools={[school]} showButtons={false} />}
            </div>
        </BasicLayout>
    );
}