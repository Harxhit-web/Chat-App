import  { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';


const RightSidebar = () => {

  const {selectedUser, messages } = useContext(ChatContext);
  const {logout, onlineUsers} = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([])

  // Get all the images from the messages and set them to state
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.image).map(msg=>msg.image)
    )
  },[messages])

  return selectedUser && (
    <div className={`bg-[#818582]/10 text-white w-full relativeoverflow-y-scroll ${selectedUser ? "max-md:hidden": ""}`}>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" 
        className='w-20 aspect-[1/1] rounded-full'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
          </h1>
          <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>

      <hr className='border-[#ffffff50] my-4' />
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-col-2 gap-4 opacity-80'>
          {msgImages.map((url, index)=> (
            <div key={index} onClick={()=> window.open(url)} className='cursor-pointer'>
              <img src={url} alt="" className='h-30 w-full rounded-md' />
            </div>
          ))}
        </div>
      </div>
      <button onClick={()=> logout()} className='mt-50 w-full bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-3 rounded-full cursor-pointer hover:opacity-90 transition-opacity'>Logout</button>
    </div>
  );
}

export default RightSidebar
