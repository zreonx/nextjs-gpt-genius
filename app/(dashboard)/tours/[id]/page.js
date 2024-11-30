import TourInfo from '@/components/TourInfo';
import { getSingleTour } from '@/utils/action';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;

const SingleTourPage = async ({ params }) => {
  const tour = await getSingleTour(params.id);

  if (!tour) {
    return redirect('/tours');
  }

  const { city, country, title } = tour;

  const { data } = await axios.get(`${url}${city}`);
  const tourImage = data?.results[0]?.urls?.raw;

  const convertToValidPrompt = (str) => {
    return str.replace(/ /g, '-').toLowerCase();
  };
  
  console.log(data);
  
  const prompt =
    'https://image.pollinations.ai/prompt/' +
    convertToValidPrompt(`a panoramic view of ${city}, ${country}`);

  return (
    <div>
      <Link href={`/tours`} className="btn btn-secondary mb-12">
        back to tours
      </Link>
      {tourImage ? (
        <Image
          src={tourImage}
          priority
          width={300}
          height={300}
          className="rounded-xl shadow-xl mb-16 h-96 w-96 object-center object-fill"
          alt={title}
        />
      ) : null}
      <TourInfo tour={tour} />
    </div>
  );
};

export default SingleTourPage;
