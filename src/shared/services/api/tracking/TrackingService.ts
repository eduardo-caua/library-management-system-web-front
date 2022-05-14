import { Environment } from '../../../environment';
import { API } from '../axios-config';

export interface IBook {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  status: string;
  dueDate: Date;
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
  book?: IBook;
  customerId: number;
  customer: ICustomer;
  dueDate?: Date;
  action: string;
  createdAt: string;
}

type TTrackingData = {
  count: number;
  book: IBook,
  rows: ITracking[];
}

const getAll = async (id: number, page = 1): Promise<TTrackingData | Error> => {
  try {
    const urlRelativa = `/books/${id}/tracking?_offset=${page-1}&_limit=${Environment.PAGE_SIZE}`;

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

const create = async (dados: Omit<ITracking, 'id' | 'customer' | 'book' | 'createdAt'>): Promise<number | Error> => {
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

const updateById = async (dados: Omit<ITracking, 'customer' | 'book' | 'createdAt'>): Promise<void | Error> => {
  try {
    await API.patch<ITracking>(`/books/${dados.bookId}/tracking/${dados.id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on update. Try again later..');
  }
};

export const TrackingService = {
  getAll,
  create,
  getById,
  updateById,
};
