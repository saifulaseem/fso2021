import axios from "axios";

const baseUrl = "/api/persons";//"https://safe-dawn-39280.herokuapp.com";//"http://localhost:3001/api/persons";

const getAll = () => {
  const response = axios.get(baseUrl);
  return response.then((res) => res.data);
};

const create = (newObject) => {
  const response = axios.post(baseUrl, newObject);
  return response.then((res) => res.data);
};

const update = (newObject) => {
    const response = axios.put(baseUrl+"/"+newObject.id, newObject);
    return response.then((res) => res.data);
  };
const remove = (id) => {
  const request = axios.delete(baseUrl + "/" + id);
  return request.then(res=>res.data);
};
const personService = {
  getAll,
  create,
  update,
  remove
}; 
export default personService;
