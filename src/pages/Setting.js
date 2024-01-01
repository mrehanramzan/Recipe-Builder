import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert'
import VisibilityIcon from '@mui/icons-material/Visibility';

function Setting({user}) {
    const navigate = useNavigate()
    const[users, setUsers] =  useState([]);
    const fetchUsers = async()=>{
        try{
           const response =  await fetch('http://localhost:5000/users')
           if(!response.ok){
                throw new Error("Network response not ok")
            }
            const {users} = await response.json()
            setUsers(users)
        }catch(error){
            console.error(error)
        }
    }

    const handleAccessClick = async(id)=>{
        try{
            const response = await fetch(`http://localhost:5000/access/${id}`);
            const data = await response.json()
            if(data.message==='true'){
                swal({title:"Successfully",
                    text: "Access allowed",
                    icon: "success",
                })
            }else{
                swal({title:"Successfully",
                    text: "Access Not Alowed",
                    icon: "success",
                })
            }
            
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        if(user.role==='user'){
            swal({
                title:"Only Admin Can Access",
                icon: "warning",
              })
            navigate('/ingredients')
        }
        fetchUsers()
    },[])  
  
    return (
        <>
            <div>
                {users.length!=0?(<div>
                    <div className="p-8">
                        <h2 className="text-blue-800 text-2xl font-bold">Users</h2>    
                    </div>
                    <table className='border-2 border-black w-1/2 mx-8'>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Access</th>
                        </tr>
                        {
                            users.map((item)=>(
                                <tr className='text-center'>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td><button onClick={()=>{handleAccessClick(item._id)}}><VisibilityIcon/></button></td>
                                </tr>
                            ))
                        }
                    </table>
                </div>)
                : <h2>No user</h2> }
            </div>
        </>
    )

    }
export default Setting