import { Environment } from '../../../environment';
import { API } from '../axios-config';

export interface IBook {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  status: string;
  dueDate?: string;
}

export interface ICustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

type TBooksData = {
  rows: IBook[];
  count: number;
}

const getAll = async (page = 1, filter = ''): Promise<TBooksData | Error> => {
  try {
    const urlRelativa = `/books?_offset=${page-1}&_limit=${Environment.PAGE_SIZE}&title=${filter}`;

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

const getById = async (id: number): Promise<IBook | Error> => {
  try {
    const { data } = await API.get(`/books/${id}`);

    if (data) {
      return data;
    }

    return new Error('Unexpected error on query. Try again later.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on query. Try again later.');
  }
};

const create = async (dados: Omit<IBook, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await API.post<IBook>('/books', dados);

    if (data) {
      return data.id;
    }

    return new Error('Unexpected error on create. Try again later.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on create. Try again later.');
  }
};

const updateById = async (id: number, dados: IBook): Promise<void | Error> => {
  try {
    await API.put(`/books/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on update. Try again later..');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await API.delete(`/books/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on delete. Try again later.');
  }
};

export const BooksService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
