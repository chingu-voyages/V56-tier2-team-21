import { useNavigate } from 'react-router-dom';

const Container = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row items-start px-20 py-10 min-h-screen bg-gradient-to-r from-violet-200 to-pink-200">
      <div className="md:w-1/2 mb-20 mb:mb-0 text-center md:text-left">
        <h1 className="font-bold text-2xl mb-10">Welcome </h1>
        <h4 className="font-bold text-4xl  mb-10">Surgery Status Board</h4>
        <div className='flex flex-col gap-30'>
          <p className="pt-10text-xl italic">Our Surgery Status Board helps hospitals keep family members informed during a patient’s surgery. See real-time updates on your loved one’s progress without needing to ask staff.
          </p>
          <div className='flex gap-20'>
            <div className='flex flex-col items-center justify-between w-32 h-32 rounded-2xl cursor-pointer hover:shadow-lg transition hover:text-blue-300 bg-white' onClick={() => navigate('/status')}>
              <img src='/guest.png' className='object-cover p-2 mb-2' />
              <span className='text-sm font-bold'>Guest</span>
            </div>

            <div className='flex flex-col items-center justify-between w-32 h-32 rounded-2xl cursor-pointer hover:shadow-lg transition hover:text-blue-300'
              onClick={() => navigate('/login')}>
              <img src='/admin.jpeg' className='object-cover rounded-2xl mb-2' />
              <span className='text-sm font-bold'>Admin</span>
            </div>

            <div className='flex flex-col items-center justify-between w-32 h-32 rounded-2xl cursor-pointer hover:shadow-lg transition hover:text-blue-300 bg-white'
              onClick={() => navigate('/login')}>
              <img src='/surgery-team.png' className='object-cover mb-2' />
              <span className='text-sm font-bold'>Surgery Team</span>
            </div>

          </div>
        </div>
      </div>
      <div className="md:w-1/2 transform rotate-2 w-full mt-20">
        <img className="w-full h-auto" src=" https://static.vecteezy.com/system/resources/previews/020/003/281/original/doctor-and-patient-graphic-clipart-design-free-png.png 
"/>
      </div>
    </div>
  );
}

export default Container;