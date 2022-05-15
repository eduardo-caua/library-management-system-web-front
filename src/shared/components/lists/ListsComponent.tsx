import { Box, Button, Icon, Paper, TextField, useTheme, FormControl, Select, InputLabel, MenuItem, FormHelperText } from '@mui/material';
import { useState } from 'react';

import { Environment } from '../../environment';

interface IListsComponentProps {
  searchText?: string;
  searchPlaceholder?: string;
  showSearchInput?: boolean;
  selectOption?: string;
  options?: string[];
  showSearchSelect?: boolean;
  newButtonLabel?: string;
  showNewButton?: boolean;
  showDownloadButton?: boolean;
  onNewButtonClick?: () => void;
  onSearchTextChange?: (text: string) => void;
  onSelectChange?: (text: string) => void;
  onDownloadButtonClick?: () => void;
}
export const ListsComponent: React.FC<IListsComponentProps> = ({
  searchText = '',
  searchPlaceholder = '',
  showSearchInput = false,
  selectOption = '',
  options = [],
  showSearchSelect = false,
  newButtonLabel = 'New',
  showNewButton = true,
  showDownloadButton = false,
  onSearchTextChange,
  onNewButtonClick,
  onSelectChange,
  onDownloadButtonClick,
}) => {
  const theme = useTheme();

  const [option, setOption] = useState('');

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
      {showSearchInput && (
        <TextField
          size="small"
          value={searchText}
          placeholder={searchPlaceholder}
          onChange={(e) => onSearchTextChange?.(e.target.value)}
        />
      )}

      {showSearchSelect && (
        <FormControl sx={{ minWidth: 250 }} size="small">
          <Select
            displayEmpty
            value={selectOption || option}
            onChange={(e) => { onSelectChange?.(e.target.value); setOption(e.target.value); }}
          >
            <MenuItem value="">Status</MenuItem>
            {options.map(row => (
              <MenuItem key={row} value={row}>{row}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Box flex={1} display="flex" justifyContent="end">
        {showDownloadButton && (
          <Button
            color='primary'
            disableElevation
            variant='outlined'
            onClick={onDownloadButtonClick}
            endIcon={<Icon>download</Icon>}
          >Download</Button>
        )}
      </Box>

      <Box display="flex" justifyContent="end">
        {showNewButton && (
          <Button
            color='primary'
            disableElevation
            variant='contained'
            onClick={onNewButtonClick}
            endIcon={<Icon>add</Icon>}
          >{newButtonLabel}</Button>
        )}
      </Box>
    </Box>
  );
};
