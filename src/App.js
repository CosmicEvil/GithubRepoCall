import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './App.module.scss';
import { List, TextField, ListItemButton, ListItemText, Button } from '@mui/material';
import { Link } from "react-router-dom";
import { useGlobalState } from './state';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

function App() {
  const [data, setData] = useState([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [username, setUsername] = useGlobalState('user');
  const [repo, setRepo] = useGlobalState('repo');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setloadingMessage] = useState("Enter a Github Account to see the public repositories they can access");
  /* Connect with the github API and get the repo's for the typed user */ 
  useEffect(() => {

    const fetchData = async () => {
      if(usernameInput != ""){

        setIsLoading(true);
        setloadingMessage("Loading")
        setError(false);
        try {
          const result = await axios(
            `https://api.github.com/users/${username}/repos`,
          );
          setData(result.data);
        } catch (error) {
          setError(true);
          setData([]);
        }

        setIsLoading(false);
        setloadingMessage("Enter a Github Account to see the public repositories they can access")

      } else {
        setIsLoading(true);

      }
    };
    fetchData();
  }, [username]);

  /* Handlers for the buttons and text field */
  const onTextChange = (e) => setUsernameInput(e.target.value);
  const handleSubmit = () => setUsername(usernameInput);
  const handleReset = () => setUsernameInput("");

  return (
    <div className={styles.mainblock}>
      <div className={styles.searchblock}>
        <TextField className={styles.searchblock__search} 
          onChange={onTextChange} value={usernameInput || ''} id="basic" label="Username"   
          InputProps={{
            className: "searchblock__search",
          }}
        />
        <Button className={styles.searchblock__button} onClick={handleSubmit} variant="contained"  color="primary">Submit</Button>
        <Button className={styles.searchblock__button} onClick={handleReset} variant="contained" color="primary" >Reset</Button>
      </div>
      {error && <div className={`${styles.mainblock__label} ${styles.mainblock__label_error}`}>Something went wrong</div>}
      {isLoading ? (
        <div className={styles.mainblock__label}>{loadingMessage}</div>
      ) : (
        <List>
        {data.map(item => (
          <ListItemButton key={item.id} component={Link} to={"/commits"} 
            onClick={() => {setRepo(item.name); setUsername(username)}}>
            <ListItemText primary={item.name} /> <ArrowRightIcon />
          </ListItemButton>
        ) )}
        </List>
      )}
    </div>
  );
}


export default App;
