import { useEffect, useState } from 'react';
import { Select, SelectProps, InputLabel, MenuItem, FormControl, FormHelperText } from '@mui/material';
import { useField } from '@unform/core';

type TVSelectProps = SelectProps & {
  name: string;
  options?: string[];
}

export const VSelectField: React.FC<TVSelectProps> = ({ name, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);

  return (
    <FormControl sx={{ minWidth: 250 }}>
      <InputLabel id={fieldName + '-select-label'}>{rest.label}</InputLabel>
      <Select
        {...rest}
        labelId={fieldName + '-select-label'}
        value={value}
        error={!!error}
        defaultValue={defaultValue}
        onChange={e => { setValue(e.target.value); rest.onChange?.(e, {}); }}
        onKeyDown={(e) => { error && clearError(); rest.onKeyDown?.(e); }}
      >
        <MenuItem value={'IN'}>IN</MenuItem>
        <MenuItem value={'OUT'}>OUT</MenuItem>
      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};
