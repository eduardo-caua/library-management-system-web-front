import { Environment } from '../../../environment';
import { API } from '../axios-config';

export interface ICustomersList {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ICustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

type TCustomerData = {
  rows: ICustomersList[];
  count: number;
}

const getAll = async (page = 1, filter = ''): Promise<TCustomerData | Error> => {
  try {
    const urlRelativa = `/customers?_offset=${page-1}&_limit=${Environment.PAGE_SIZE}&name=${filter}`;

    const { data } = await API.get(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Unexpected error on query. Try again later.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on query. Try again later.');
  }
};

const getById = async (id: number): Promise<ICustomer | Error> => {
  try {
    const { data } = await API.get(`/customers/${id}`);

    if (data) {
      return data;
    }

    return new Error('Unexpected error on query. Try again later.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on query. Try again later.');
  }
};

const create = async (dados: Omit<ICustomer, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await API.post<ICustomer>('/customers', dados);

    if (data) {
      return data.id;
    }

    return new Error('Unexpected error on create. Try again later.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on create. Try again later.');
  }
};

const updateById = async (id: number, dados: ICustomer): Promise<void | Error> => {
  try {
    await API.put(`/customers/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on update. Try again later.');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await API.delete(`/customers/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on delete. Try again later.');
  }
};

export const CustomersService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
