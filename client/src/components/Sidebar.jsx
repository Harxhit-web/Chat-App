import React, { useContext, useEffect,useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {
    const {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext);

    const {logout, onlineUsers, authUser} = useContext(AuthContext);

    const[input, setInput] = useState("");

    const navigate = useNavigate();
    console.log("Sidebar - authUser:", authUser);
    console.log("Sidebar - users:", users);
    console.log("Sidebar - onlineUsers:", onlineUsers);


    const filteredUsers = input ? users.filter(user => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;
    useEffect(()=>{
        console.log("Sidebar useEffect triggered");
        if (authUser){
            console.log("Calling getUsers...");
            getUsers();
        }
    },[onlineUsers, authUser])
    console.log("Filtered users:", filteredUsers);

  return (
    <div>
      <div className={`bg-[#818582]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
        <div className='flex justify-between items-center'>
            <img src={assets.logo} alt="logo" className='max-w-40'/>
            <div className='relative py-2 group'>
                <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
                <div className='absolute right-0 top-full mt-2 w-32 bg-[#282142] border border-gray-600 rounded-md p-5  group-hover:block hidden duration-300 z-20'>
                    <p onClick={()=> navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                    <hr className='my-2 border-t border-gray-500'/>
                    <p onClick={()=> logout()} className='cursor-pointer text-sm'>Logout</p>
                </div>
            </div>
        </div>
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
            <img src={assets.search_icon} alt="Search" className='w-3' />
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent text-white text-xs border-none placeholder-[#c8c8c8] flex-1 outline-none' placeholder='Search User...' />
        </div>
        <div className='flex flex-col gap-4 mt-7 '>
            {filteredUsers.map((user, index) => (
                <div onClick={()=>{setSelectedUser(user); setUnseenMessages(prev=>({...prev, [user._id]: null}))}} key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id ===user._id && 'bg-[#282142]/50'}`}>
                    <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
                    <div className='flex flex-col leading-5'>
                        <p>{user.fullName}</p>
                        {
                            onlineUsers.includes(user._id)
                            ? <span className='text-green-400 text-xs'>Online</span>
                            : <span className=' text-neutral-400 text-xs'>Offline</span>
                    }
                    </div>
                    {unseenMessages[user._id] && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
