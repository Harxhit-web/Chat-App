import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  // Initialize with authUser data
  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || authUser.name || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form submitted");
    console.log("Name:", name);
    console.log("Bio:", bio);
    console.log("Selected Image:", selectedImg);
    
    try {
      const formData = {
        fullName: name,
        bio: bio
      };

      // If image is selected, convert to base64
      if (selectedImg) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onloadend = async () => {
          formData.profilePic = reader.result;
          console.log("Sending data with image:", { ...formData, profilePic: "base64..." });
          await updateProfile(formData);
          console.log("Profile updated, navigating...");
          setTimeout(() => navigate('/'), 500); // Small delay to ensure update completes
        };
        reader.onerror = (error) => {
          console.error("File read error:", error);
        };
      } else {
        console.log("Sending data without image:", formData);
        await updateProfile(formData);
        console.log("Profile updated, navigating...");
        setTimeout(() => navigate('/'), 500); // Small delay to ensure update completes
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  }
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center '>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1' action="">
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedImg 
              ? URL.createObjectURL(selectedImg) 
              : authUser?.profilePic || assets.avatar_icon} alt="" className={`w-12 h-12 object-cover ${(selectedImg || authUser?.profilePic) ? 'rounded-full' : ''}`} />
            Update proflile picture
          </label>
          <input onChange={(e)=> setName(e.target.value)} value={name} type="text" required placeholder='Your Name' className='p-2 border border-gray-600 rounded-md focus:outline-none focus-ring-2 focus:ring-violet-500' />
          <textarea onChange={(e)=> setBio(e.target.value)} value={bio} placeholder='Write profile bio' required name="" id="" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
          <button type='Submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={selectedImg 
              ? URL.createObjectURL(selectedImg) 
              : authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfilePage
