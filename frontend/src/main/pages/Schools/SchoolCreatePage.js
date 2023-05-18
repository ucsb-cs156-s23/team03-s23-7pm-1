import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchoolForm from "main/components/Schools/SchoolForm";
import { useNavigate } from 'react-router-dom'
import { schoolUtils } from 'main/utils/schoolUtils';

export default function SchoolCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (school) => {
    const createdSchool = schoolUtils.add(school);
    console.log("createdSchool: " + JSON.stringify(createdSchool));
    navigate("/schools");
  }  

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New School</h1>
        <SchoolForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
