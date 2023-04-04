import axios from "../axios";

export const getManufacturersData = async () => {
  let response = await axios.get("product/api/v1/manufacturers");
  return response.data;
};

export const createManufacturers = async (args) => {
    let response = await axios.post("product/api/v1/manufacturers", args);
    return response.data;
  };
  
  export const updateManufacturers = async (args) => {
    
    let response = await axios.put(
      `product/api/v1/manufacturers/${args.id}`,
      args
    );
    return response.data;
  };
  
  export const deleteManufacturers = async (args) => {

    let response = await axios.delete(
      `product/api/v1/manufacturers/${args.id}`
    );
    return response.data;
  };
