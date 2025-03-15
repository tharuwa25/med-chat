'use client';
import { PlaceholdersAndVanishInput } from '@/app/components/ui/placeholders-and-vanish-input';
//import Spline from '@splinetool/react-spline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

const FindSymptoms = () => {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [symptom, setSymptom] = useState('');
  const [diseases, setDiseases] = useState([]); // Added disease state
  const [error, setError] = useState('');

  const router = useRouter();

  const welcomeText = useMemo(() => [
    "What is your symptom?",
    "Tell us how you're feeling",
    "Share your health concern",
    "Let's get to the root of the problem",
    "Not feeling your best?",
  ], []);
  
  const [randomText, setRandomText] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * welcomeText.length);
    setRandomText(welcomeText[randomIndex]);
  }, [welcomeText]);

  const placeholders = [
    "My sore throat is making it really uncomfortable to eat or drink anything.",
    "Who is Tyler Durden?",
    "I can’t seem to get warm, no matter how many blankets I use to cover myself.",
    "I keep sneezing uncontrollably, and it feels like it’s never going to stop.",
    "My throat feels dry and scratchy, which makes me cough uncontrollably.",
  ];

  const getSentence = async () => {
    console.log('message', message);
  };

  const getSymptom = async (e: React.FormEvent) => {
    e.preventDefault();

    getSentence();

    const res = await fetch('https://tharudila245.pythonanywhere.com/get_sentence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentence: message
      }),
    });
    const data = await res.json();
    console.log('data  1️⃣', data);

    setSymptom(data.symptom);
    console.log('symptom 2️⃣', symptom);

    const transformedMessage = data.symptom.replace(/\s+/g, '_').toLowerCase();
    console.log('transformedMessage 3️⃣', transformedMessage);

    const res2 = await fetch('https://tharudila245.pythonanywhere.com/get_diseases_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptom_user_input: transformedMessage
      })
    });

    const data2 = await res2.json();
    console.log('data 4️⃣', data2);

    if (data2.message === 'Enter correct symptom') {
      setError(`Currently MEDCHAT doesn't support for your symptom ${transformedMessage}`);
    } else {
      setDiseases(data2.diseases);
      console.log('Diseases:', diseases);

      const details = data2.diseases.reduce((acc: Record<string, boolean>, disease: string) => {
        acc[disease] = true;
        return acc;
      }, {});

      localStorage.setItem('details', JSON.stringify(details));
      setLoading(true);
    }
  };

  useEffect(() => {
    console.log('Updated diseases:', diseases);
    setDiseases(diseases);
  }, [diseases]);

  const handleNextPage = (item: string) => {
    router.push(`/my-symptoms?disease=${encodeURIComponent(item)}`);
  };

  // Error modal component
  const ErrorModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-md w-96 relative">
          <p className="text-red-500">{message}</p>
          
          {/* Close icon in the top-right corner */}
          <span
            onClick={onClose}
            className="absolute top-2 right-2 cursor-pointer text-2xl text-gray-600 hover:text-gray-800"
          >
            &times; {/* This is the "X" icon for close */}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-bgColor-700 h-screen py-16">
      <h4 className="font-bold text-3xl text-white mb-6 items-center text-center">{randomText}</h4>

      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={(e) => setMessage(e.target.value)}
        onSubmit={getSymptom}
      />

      {loading && (
        <div className="bg-bgColor-300 m-12 mt-20 rounded-md p-4">
          <h5 className="font-bold text-2xl text-black mb-6 text-center mt-6">
            Based on your symptoms, you may have one of these conditions.
          </h5>
          <div className="bg-bgColor-200 p-8 border-black rounded-sm border-2 ml-16 mr-16 text-center">
            {diseases.map((item, index) => (
              <button
                key={index}
                className="bg-white p-4 text-xl rounded-xl mr-8 hover:bg-slate-400"
                onClick={() => handleNextPage(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <h5 className="font-bold text-2xl text-black mb-6 text-center mt-6">
            To get a more accurate diagnosis, we recommend clicking on an illness.
          </h5>
        </div>
      )}

      {!loading && (
        <div className="flex justify-center items-center mt-8">
          <Image 
            src='/banner.png' 
            width={700} 
            height={300} 
            alt="Banner image"
          />
        </div>
      )}

      {/* Show the error modal if error state is set */}
      {error && <ErrorModal message={error} onClose={() => setError('')} />}
    </div>
  );
};

export default FindSymptoms;
