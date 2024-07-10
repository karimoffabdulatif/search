/* eslint-disable no-undef */
import { Button } from "@mui/material";
import { Service } from "@modal";
import { ServiceTable } from "../../components/ui";
import { useEffect, useState } from "react";
import service from "../../service/service";
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const Index = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [params, setParams] = useState({
    limit: 5,
    page: 2,
    name: ""
  });

  const getData = async () => {
    try {
      const response = await service.get(params);
      if (response.status === 200 && response?.data?.services) {
        setData(response.data.services);
        const total = Math.ceil(response.data.total / params.limit);
        setCount(total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleChange = (event, value) => {
    setParams({
      ...params,
      page: value,
    });
  };

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    color: 'blue',
    justifyContent: 'center',
  }));

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid blue',

    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(-1),
      width: 'auto',
    },
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  const handleInputChange =()=>{

  }

  return (
    <>
      <Service open={open} handleClose={() => setOpen(false)} />
      <div className="flex flex-col gap-3">
       <div className="absolute flex justify-start  mx-2">
       <Search onChange={handleInputChange}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
       </div>
        <div className="flex justify-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add
          </Button>
        </div>
        <ServiceTable data={data} />
        <Pagination
          count={count}
          page={params.page}
          onChange={handleChange}
          sx={{ marginLeft: '530px', marginTop: '20px' }}
        />
      </div>
    </>
  );
};

export default Index;
