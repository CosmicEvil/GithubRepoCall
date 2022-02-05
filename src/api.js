import axios from 'axios';


export const fetchDataRepo = async username => {
  const url = `https://api.github.com/users/${username}/repos`;
  return await axios.get(url);
};

export const fetchDataCommit = async (username, repo) => {
    const url =  `https://api.github.com/repos/${username}/${repo}/commits`;
    return await axios.get(url);
};
