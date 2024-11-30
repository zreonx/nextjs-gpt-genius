'use client';

import { getAllTours } from '@/utils/action';
import { useQuery } from '@tanstack/react-query';
import ToursList from './ToursList';
import { useRef, useState } from 'react';

const ToursPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchValue);

  const debounceTimeout = useRef(null);

  const handleSearchChange = (value) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 500); // 500ms debounce delay
  };

  const { data, isPending } = useQuery({
    queryKey: ['tours', debouncedSearchTerm],
    queryFn: () => getAllTours(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm,
  });

  return (
    <>
      <form className="max-w-lg mb-12 ">
        <div className="join w-full">
          <input
            type="text"
            placeholder="enter city or country here..."
            className="input input-bordered join-item w-full"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearchChange(e.target.value);
            }}
            required
          />
          <button
            className="btn btn-primary join-item"
            type="button"
            disabled={isPending}
            onClick={() => setSearchValue('')}
          >
            {isPending ? 'please wait...' : 'reset'}
          </button>
        </div>
      </form>
      {isPending ? (
        <span className="loading"></span>
      ) : (
        <ToursList data={data} />
      )}
    </>
  );
};

export default ToursPage;
