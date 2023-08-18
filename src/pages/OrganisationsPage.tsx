import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient, QueryFunction} from 'react-query';
import {createOrganisation, deleteOrganisation, getOrganisation, getOrganisations, updateOrganisation} from '../services/api';
import OrganisationListItem from '../components/organisations/OrganisationListItem';
import CreateOrganisationForm from '../components/organisations/CreateOrganisationForm';
import {CreateOrganisationRequest, OrganisationInfoResponse, UpdateOrganisationRequest, Page} from '../types/apiTypes';
import {Button, Container, Box, Typography, Stack} from '@mui/material';

const fetchOrganisations: QueryFunction<Page<OrganisationInfoResponse>, [string, number]> = async ({ queryKey }) => {
  const [_key, page] = queryKey;
  return getOrganisations(page);
};
const OrganisationPage: React.FC = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: organisations,
    isError: orgError,
    isLoading: orgLoading
  } = useQuery(['organisations', currentPage], fetchOrganisations);

  const {
    data: selectedOrganisation,
    isError: selectedOrgError,
    isLoading: selectedOrgLoading
  } = useQuery(['organisation', selectedOrgId], () => getOrganisation(selectedOrgId), {
    enabled: !!selectedOrgId,
  });

  const handlePrevPage = () => {
    setCurrentPage(old => Math.max(0, old - 1));
  };
  const handleNextPage = () => {
    if (organisations && organisations.totalPages - 1 > currentPage) {
      setCurrentPage(old => old + 1);
    }
  };

  const orgCreateMutation = useMutation(createOrganisation, {
    onSuccess: () => {
      queryClient.invalidateQueries('organisations');
    },
  });

  const orgUpdateMutation = useMutation(updateOrganisation, {
    onSuccess: () => {
      queryClient.invalidateQueries('organisations');
    },
  });

  const orgDeleteMutation = useMutation(deleteOrganisation, {
    onSuccess: () => {
      setSelectedOrgId(null);
      queryClient.invalidateQueries('organisations');
    },
  });

  if (orgLoading || selectedOrgLoading) {
    return <div>Loading...</div>;
  }

  if (orgError || selectedOrgError) {
    return <div>Error occurred</div>;
  }

  const handleEdit = (id: number) => {
    setSelectedOrgId(id);
  };

  const handleCreate = async (data: CreateOrganisationRequest) => {
    try {
      await orgCreateMutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number | null) => {
    try {
      await orgDeleteMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container sx={{marginTop: '2em'}}>
      <Typography variant="h2" gutterBottom>Organisations</Typography>
      <Stack direction="row" justifyContent="left" spacing={2} marginTop='2em'>
        {organisations?.content && organisations?.content.map((org: OrganisationInfoResponse) => (
          <OrganisationListItem
            key={org.id}
            organisation={org}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </Stack>
      <Stack direction="row" justifyContent="left" spacing={2} marginTop='2em'>
        {!organisations?.first && <Button onClick={handlePrevPage}>Previous page</Button>}
        {!organisations?.last && <Button onClick={handleNextPage}>Next page</Button>}
      </Stack>
      <Box marginTop='2em'>
        <Typography variant="h4" gutterBottom>Create a new organisation</Typography>
        <CreateOrganisationForm onSubmit={handleCreate}/>
      </Box>
    </Container>
  );
};

export default OrganisationPage;
