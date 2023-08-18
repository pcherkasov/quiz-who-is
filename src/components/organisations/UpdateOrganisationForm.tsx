import React, {useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { OrganisationInfoResponse } from '../../types/apiTypes';

interface UpdateOrganisationFormProps {
  onSubmit: (data: any) => void;
  organisation: OrganisationInfoResponse;
}

interface FormData {
  name: string;
  description?: string;
}

const UpdateOrganisationForm: React.FC<UpdateOrganisationFormProps> = ({ onSubmit, organisation }) => {
  const {register, handleSubmit, setValue} = useForm<FormData>({ defaultValues: organisation });

  useEffect(() => {
    setValue("name", organisation.name);
    setValue("description", organisation.description);
  }, [organisation, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name:</label>
        <input {...register("name", {required: true})} />
      </div>
      <div>
        <label>Description (optional):</label>
        <input {...register("description")} />
      </div>
      <input type="submit"/>
    </form>
  );
};

export default UpdateOrganisationForm;
