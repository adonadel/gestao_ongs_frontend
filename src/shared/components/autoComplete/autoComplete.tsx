import {useState} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import baseApi from "../../../lib/api.ts";

const AutoComplete = ({ origin, objectToGetName, labelForAutoComplete }) => {
  const [options, setOptions] = useState([]);

  const handleSearch = async (value:string) => {
    if (value.length >= 3) {
      try {
					const response = await baseApi.get(`/api/${origin}?search=${value}`);
        setOptions(response.data.data);
      } catch (error) {
      }
    } else {
      setOptions([]);
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => objectToGetName ? option[objectToGetName]?.name : option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          label={labelForAutoComplete}
          variant="outlined"
          onChange={(e) => handleSearch(e.target.value)}
        />
      )}
    />
  );
};

export default AutoComplete;
