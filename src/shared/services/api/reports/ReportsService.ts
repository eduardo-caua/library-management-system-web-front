import { API } from '../axios-config';

type TBooksMetrics = {
  available: number,
  checkedout: number,
  delayed: number
}

const getBooksMetrics = async (): Promise<TBooksMetrics | Error> => {
  try {
    const urlRelativa = '/reports/books-metrics';

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

const downloadBooksReport = async (title:string, status:string): Promise<[] | Error> => {
  try {
    const { data } = await API.get(`/reports/books?title=${title}&status=${status}`);

    if (data) {
      return data;
    }

    return new Error('Unexpected error on query. Try again later.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Unexpected error on query. Try again later.');
  }
};

export const ReportsService = {
  getBooksMetrics,
  downloadBooksReport,
};
