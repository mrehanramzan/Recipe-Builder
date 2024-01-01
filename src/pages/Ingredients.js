import React,{useState ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import EmptyRecipe from '../assests/empty-recipe.png'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Ingredients({user}) {
  const [data, setData] =  useState([])
  const [search,setSearch] = useState('')
  const navigate = useNavigate()
  let initital_data;
  const handleSearchChange = (e)=>{
    setSearch(e.target.value)
    initital_data = data;
    var newData;
    

  }

  const onBlur = ()=>{
    setData(initital_data)
  }

  const handleDeleteClick = async(id)=>{
      try{
        const response =  await fetch(`http://localhost:5000/recipe/${id}`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
        })
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        else{
          swal({title:"Successfully",
          text: "Recipe deleted successfully",
          icon: "success",
          })
          fetchData()
        }  
      }catch(error){
        console.error('Error sending data to backend:', error);
      }
  }

  const getRecipe = async(id)=>{
    try{
      const response = await fetch(`http://localhost:5000/recipe/${id}`)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json()
      navigate('/recipe',{state:{data}})
    }catch (error) {

      console.error('Error sending data to backend:', error);
    }
  }

  const handleEditClick = (id)=>{
    getRecipe(id)
  }

  const fetchData = async()=>{
    try{
      const response = await fetch('http://localhost:5000/recipes')
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json()
      setData(data.data)
    }catch(error){
      console.error('Error getting data to backend:', error)
    }
  }

  useEffect(()=>{
    fetchData();
  },[])
    
  
  return (
    <div>
    { data.length!=0?(<div>
      <div className="p-8">
        <h2 className="text-blue-800 text-2xl font-bold">Ingredients</h2>    
      </div>
      <div>
        <input type="search" value={search} onBlur={showAllData} onChange={handleSearchChange} className='border-2 border-blue-500 m-8 p-2' placeholder='Recipe...' />
      </div>
      <table className='border-2 border-black w-11/12 m-auto'>
        <thead>
          <tr>
            <th>Recipe</th>
            <th>Servings</th>
            <th>Prep Time</th>
            <th>Cook Time</th>
            <th>Ingredients</th>
            <th>Note</th>
            {user.access==='true'?<th>Actions</th>:''}
          </tr>
        </thead>
        <></>
        {
          data.map((item)=> (<tr className='text-center'>
              <td>{item.recipe}</td>
              <td>{item.servings}</td>
              <td>{item.preptime}</td>
              <td>{item.cooktime}</td>
              <td>{item.ingredients}</td>
              <td>{item.note}</td>
              <td>
                {user.access==='true'?<EditIcon onClick={ ()=>{handleEditClick(item._id)} }/>:''}
                {user.access==='true'?<DeleteIcon onClick={ ()=>{handleDeleteClick(item._id)} }/>:''}
              </td>
            </tr>)
          )
        }
      </table>
    </div>):
      <div className='img-container'>
        <img src={EmptyRecipe}  alt="Empty-Recipe"/>
      </div>
    }
    </div>
  )
}
export default Ingredients