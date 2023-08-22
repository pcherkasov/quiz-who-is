import React from 'react';
import {OrganisationInfoResponse} from '../../types/apiTypes';
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface OrganisationListItemProps {
  organisation: OrganisationInfoResponse;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const OrganisationListItem: React.FC<OrganisationListItemProps> = ({
                                                                     organisation,
                                                                     onEdit,
                                                                     onDelete
                                                                   }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/organisations/${organisation.id}/seasons`);
  };

  return (
    <Card variant="outlined"
          sx={{
            marginBottom: 2,
          cursor: "pointer",
            transition: "all 0.2s ease",
            '&:hover': {
              boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.2)",
            }
          }}
          onClick={handleClick}
    >
      <CardContent>
        <Typography variant="h5">{organisation.name}</Typography>
        <Typography variant="body2" color="text.secondary">{organisation.description}</Typography>
        <Stack direction="row" spacing={2} marginTop={2}>
          <Button variant="contained" color="secondary" onClick={() => onEdit(organisation.id)}>Edit</Button>
          <Button variant="contained" color="error" onClick={() => onDelete(organisation.id)}>Delete</Button>
        </Stack>
      </CardContent>
    </Card>
  )
};

export default OrganisationListItem;
