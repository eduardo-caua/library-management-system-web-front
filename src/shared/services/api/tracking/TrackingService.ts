import { Environment } from '../../../environment';
import { API } from '../axios-config';

export interface IBook {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  status: string;
}

export interface ICustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ITracking {
  id: number;
  bookId?: number;
  customerId: number;
  customer: ICustomer;
  dueDate: string;
  action: string;
  createdAt: string;
}

type TTrackingData = {
  data: {
    book: IBook,
    tracking: ITracking[]
  };
  totalCount: number;
}

const getAll = async (id: number, page = 1): Promise<TTrackingData | Error> => {
  try {
    const urlRelativa = `/books/${id}/tracking?_page=${page}&_limit=${Environment.PAGE_SIZE}`;

    const { data, headers } = await API.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.PAGE_SIZE),
      };
    }

    return new Error('Unexpected error on query. Try again later.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on query. Try again later.');
  }
};

const getById = async (id: number): Promise<ITracking | Error> => {
  try {
    const { data } = await API.get(`tracking/${id}`);

    if (data) {
      return data;
    }

    return new Error('Unexpected error on query. Try again later.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on query. Try again later.');
  }
};

const create = async (dados: Omit<ITracking, 'id' | 'customer' | 'createdAt'>): Promise<number | Error> => {
  try {
    const { data } = await API.post<ITracking>(`/books/${dados.bookId}/tracking`, dados);

    if (data) {
      return data.id;
    }

    return new Error('Unexpected error on create. Try again later.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on create. Try again later.');
  }
};

const updateById = async (dados: Omit<ITracking, 'customer' | 'createdAt'>): Promise<void | Error> => {
  try {
    await API.patch<ITracking>(`/tracking/${dados.id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on update. Try again later..');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await API.delete(`/tracking/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on delete. Try again later.');
  }
};

export const TrackingService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById
};
