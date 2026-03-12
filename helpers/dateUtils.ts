import { format, parseISO } from 'date-fns';

export const formatIsoDate = (iso: string): string => format(parseISO(iso), 'dd/MM/yyyy');
