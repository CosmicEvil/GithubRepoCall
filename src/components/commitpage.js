import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import { useGlobalState } from '../state';
import { Link } from 'react-router-dom';
import { parseISO, format } from 'date-fns'
import styles from '../App.module.scss';
import "./datagrid.scss";
import { fetchDataCommit } from '../api';

function CommitsPage() {
    const [username, setUsername] = useGlobalState('user');
    const [repo, setRepo] = useGlobalState('repo');
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    /* Setting columns + formatting for data grid */

    const columns = [
        {
            field: 'commit', headerName: 'date', width: 150, border:2,
            valueGetter: (params) => {
                const date = parseISO(params.row.commit.committer.date);
                return format(date, 'LLLL d, yyyy')
            }
        },
        {
            field: 'committer', headerName: 'committer', width: 150,
            valueGetter: (params) =>  params.row.commit.author.name
        },
        {
            field: 'message', headerName: 'message', 
            width: 600, 
            valueGetter: (params) =>   params.row.commit.message
        }
      ]

    /* get the commits for the repo onload of page*/

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        setError(false);
        console.log("repo:" + repo + "   Username:" + username);
        try {
          
            const result = await fetchDataCommit(username, repo);
            setData(result.data);
            console.log(result.data)
            
        } catch (error) {
          setError(true);
        }
        setIsLoading(false);
      };
      fetchData();
    }, []);

    /* if it has an error, it shows the error message instead */
    if (error){
      return (
        <div className={styles.mainblock}>
          <div className={`${styles.mainblock__label} ${styles.mainblock__label_error}`}>Something went wrong</div>
          <Button className={styles.commit__button} component={Link} to="/" variant="contained" >
            Back to the main page
          </Button>
        </div>
      )
    }

    return (
      <div className={styles.mainblock}>
        {
        isLoading ?
        (
          <div className={styles.mainblock__label}>Loading</div>
        ) :
        (
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={20}
            getRowId={(row) => row.node_id}
          />
        )
        }
        <Button className={styles.commit__button} component={Link} to="/" variant="contained" >
            Back to the main page
        </Button>
      </div>)
}

export default CommitsPage;