'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  generateTourResponse,
  getExistingTour,
  createNewTour,
  fetchUserTokensById,
  subtractTokens,
} from '@/utils/action';
import TourInfo from './TourInfo';
import toast from 'react-hot-toast';
import { auth, useAuth } from '@clerk/nextjs';

const NewTour = () => {
  const queryClient = useQueryClient();

  const { userId } = useAuth();

  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      const existingTour = await getExistingTour(destination);

      console.log(existingTour);

      if (existingTour) return existingTour;

      const currentTokens = await fetchUserTokensById(userId);
      if (currentTokens < 300) {
        toast.error('Tokens balance is too low...');
        return;
      }

      const newTour = await generateTourResponse(destination);

      if (!newTour) {
        toast.error('No matching city found...');
        return null;
      }

      await createNewTour(newTour.tour);
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      const newTokens = await subtractTokens(userId, newTour.tokens);
      toast.success(`${newTokens} tokens remaining`);
      return newTour.tour;
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(formData.entries());
    mutate(destination);
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h2 className="mb-4">Select your dream destination</h2>
        <div className="join w-full">
          <input
            type="text"
            className="join-item input input-bordered w-full"
            placeholder="city"
            name="city"
            required
          />
          <input
            type="text"
            className="join-item input input-bordered w-full"
            placeholder="country"
            name="country"
            required
          />
          <button className="btn btn-primary join-item" type="submit">
            {' '}
            generate tour
          </button>
        </div>
      </form>
      <div className="mt-16">{tour ? <TourInfo tour={tour} /> : null}</div>
    </>
  );
};

export default NewTour;
