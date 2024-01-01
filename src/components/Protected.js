import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'

function Protected({Component}) {
    const navigate = useNavigate()
    const [user,setUser] = useState({})
    const verifyUser = async(token)=>{
        try{
            const response = await fetch('http://localhost:5000/protected',{
                headers: { 
                    'Content-Type':'application/json',
                    'Authorization':token
                }
            })
            if(!response.ok){  
                swal({title:"Login Required",
                    icon: "warning",
                })
                navigate('/')
                throw new Error('Network response was not ok');
            }
            var { user } = await response.json()
            setUser(user)
        }catch(error){
            console.error(error)
        }
    }

    useEffect(()=>{
        let loginToken = localStorage.getItem('token')
        setTimeout(()=>{
            verifyUser(loginToken)
        },50)
    },[])

    return (
        <Component user={user}/>
  )
}

export default Protected