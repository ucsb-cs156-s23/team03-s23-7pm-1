import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import SchoolTable from 'main/components/Schools/SchoolTable';
import { schoolUtils } from 'main/utils/schoolUtils';

export default function SchoolDetailsPage() {
  let { id } = useParams();

  const response = schoolUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>School Details</h1>
        <SchoolTable schools={[response.school]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
