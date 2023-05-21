import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ParkTable from "main/components/Parks/ParkTable";
import { useBackend } from "main/utils/useBackend";

export default function ParkDetailsPage() {
    let { id } = useParams();

    const { data: park, error, status } = useBackend(
        // Stryker disable next-line all : don't test internal caching of ReactQuery
        [`/api/parks?id=${id}`],
        {
            // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: "/api/parks",
            params: { id }
        }
    );

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Park Details</h1>
                {park && <ParkTable parks={[park]} showButtons={false} />}
            </div>
        </BasicLayout>
    );
}
