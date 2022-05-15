import { Box, Button, Divider, Icon, Paper, Skeleton, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';

interface IDetailsComponentProps {
  newButtonLabel?: string;

  showNewButton?: boolean;
  showBackButton?: boolean;
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showSaveAndCloseButton?: boolean;

  showNewButtonCarregando?: boolean;
  showBackButtonCarregando?: boolean;
  showDeleteButtonCarregando?: boolean;
  showSaveButtonCarregando?: boolean;
  showSaveAndCloseButtonCarregando?: boolean;

  onNewButtonClick?: () => void;
  onBackButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
  onSaveButtonClick?: () => void;
  onSaveAndCloseButtonClick?: () => void;
}
export const DetailsComponent: React.FC<IDetailsComponentProps> = ({
  newButtonLabel = 'New',

  showNewButton = true,
  showBackButton = true,
  showDeleteButton = true,
  showSaveButton = true,
  showSaveAndCloseButton = false,

  showNewButtonCarregando = false,
  showBackButtonCarregando = false,
  showDeleteButtonCarregando = false,
  showSaveButtonCarregando = false,
  showSaveAndCloseButtonCarregando = false,

  onNewButtonClick,
  onBackButtonClick,
  onDeleteButtonClick,
  onSaveButtonClick,
  onSaveAndCloseButtonClick,
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const theme = useTheme();

  return (
    <Box
      gap={1}
      marginX={1}
      padding={1}
      paddingX={2}
      display="flex"
      alignItems="center"
      height={theme.spacing(5)}
      component={Paper}
    >
      {(showSaveButton && !showSaveButtonCarregando) && (
        <Button
          color='primary'
          disableElevation
          variant='contained'
          onClick={onSaveButtonClick}
          startIcon={<Icon>save</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Save
          </Typography>
        </Button>
      )}

      {showSaveButtonCarregando && (
        <Skeleton width={110} height={60} />
      )}

      {(showSaveAndCloseButton && !showSaveAndCloseButtonCarregando && !smDown && !mdDown) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={onSaveAndCloseButtonClick}
          startIcon={<Icon>save</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Save and close
          </Typography>
        </Button>
      )}

      {(showSaveAndCloseButtonCarregando && !smDown && !mdDown) && (
        <Skeleton width={180} height={60} />
      )}

      {(showDeleteButton && !showDeleteButtonCarregando) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={onDeleteButtonClick}
          startIcon={<Icon>delete</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Delete
          </Typography>
        </Button>
      )}

      {showDeleteButtonCarregando && (
        <Skeleton width={110} height={60} />
      )}

      {(showNewButton && !showNewButtonCarregando && !smDown) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={onNewButtonClick}
          startIcon={<Icon>add</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            {newButtonLabel}
          </Typography>
        </Button>
      )}

      {(showNewButtonCarregando && !smDown) && (
        <Skeleton width={110} height={60} />
      )}

      {
        (
          showBackButton &&
          (showNewButton || showDeleteButton || showSaveButton || showSaveAndCloseButton)
        ) && (
          <Divider variant='middle' orientation='vertical' />
        )
      }

      {(showBackButton && !showBackButtonCarregando) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={onBackButtonClick}
          startIcon={<Icon>arrow_back</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Back
          </Typography>
        </Button>
      )}

      {showBackButtonCarregando && (
        <Skeleton width={110} height={60} />
      )}
    </Box >
  );
};
