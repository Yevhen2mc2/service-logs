import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  open: boolean;
  draftsCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const RemoveAllDraftsDialog = ({
  open,
  draftsCount,
  onClose,
  onConfirm,
}: Props) => {
  const onRemove = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Remove All Drafts</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove all {draftsCount} draft
          {draftsCount === 1 ? '' : 's'}? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={onRemove}>
          Remove All
        </Button>
      </DialogActions>
    </Dialog>
  );
};
