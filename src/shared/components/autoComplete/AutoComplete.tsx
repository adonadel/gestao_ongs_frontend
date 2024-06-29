import {useState} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {baseApi} from "../../../lib/api.ts";

const AutoComplete = ({ origin, objectToGetName, objectToGetId, labelForAutoComplete, onChange }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (value) => {
    if (value.length >= 3) {
      try {
        setIsSearching(true);
        const response = await baseApi.get(`/api/${origin}?search=${value}`);
        const optionsWithData = response.data.data.map(option => ({
          ...option,
          id: objectToGetName ? option[objectToGetName]?.id : option.id,
        }));
        setOptions(optionsWithData);
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setOptions([]);
    }
  };

  const handleOptionSelected = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(objectToGetId ? option[objectToGetId]?.id : option.id);
    }
  };

  return (
    <Autocomplete
      options={options}
      noOptionsText={'Nenhum registro encontrado'}
      loading={isSearching}
      loadingText='Buscando...'
      getOptionLabel={(option) => objectToGetName ? option[objectToGetName]?.name : option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          label={labelForAutoComplete}
          variant="outlined"
          onChange={(e) => handleSearch(e.target.value)}
        />
      )}
      onChange={(event, newValue) => handleOptionSelected(newValue)}
      value={selectedOption}
    />
  );
};

export default AutoComplete;
