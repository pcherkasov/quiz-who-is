import React from 'react';
import { useForm } from 'react-hook-form';

interface CreateOrganisationFormProps {
  onSubmit: (data: any) => void;
}

interface FormData {
  name: string;
  description?: string;
}

const CreateOrganisationForm: React.FC<CreateOrganisationFormProps> = ({ onSubmit }) => {
  const {register, handleSubmit} = useForm<FormData>();

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

export default CreateOrganisationForm;
