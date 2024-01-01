import React,{useState,useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import swal from 'sweetalert'
import TextEditor from '../components/TextEditor'

function Recipe({user}) {
  const [recipe, setRecipe] = useState({ recipe:"", servings:"", preptime:"", cooktime:"",
  ingredients:"", note:"" });
  const location = useLocation()
  const navigate = useNavigate()
  let receivedData = location.state && location.state.data;;
  
  useEffect(()=>{
    if(user.access==='false'){
      swal({
        title:"Access Required",
        icon: "warning",
      })
      navigate('/ingredients')
    }
    if(receivedData){
      setRecipe(receivedData.data)
    }
  },[])
  
  const handleInputChange = (e)=>{
    setRecipe({...recipe,[e.target.name]:e.target.value})
  }
   
  const handleProcedureContentChange = (content,_,__,editor) => {
    let text = editor.getText().trim()  
    setRecipe({...recipe,note:text})
  };
  
  const saveClick = async()=>{
    if(receivedData){
      try {
        const response = await fetch(`http://localhost:5000/recipe/${receivedData.data._id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(recipe),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        else{
          receivedData = null
          navigate('/ingredients')
          setRecipe({ recipe:"", servings:"", preptime:"", cooktime:"",
          ingredients:"", note:"" })
          swal({title:"Successfully",
          text: "Recipe updated successfully",
          icon: "success",
          })
        }
      } 
      catch (error) {
        console.error('Error sending data to backend:', error);
      }
    }else{
      try {
        const response = await fetch('http://localhost:5000/recipe', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(recipe),
        });
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        else{
          setRecipe({ recipe:"", servings:"", preptime:"", cooktime:"",
          ingredients:"", note:"" })
          swal({title:"Successfully",
          text: "Recipe created successfully",
          icon: "success",
          })
        }
      } 
      catch (error) {
        console.error('Error sending data to backend:', error);
      }
    }
  }

  return(<div>  
    <div className='flex justify-between p-8'>
        <h2 className="text-blue-800 text-2xl font-bold">EDIT/CUSTOMIZE</h2>
        <button className="btn bg-blue-800 rounded-full font-bold text-white px-8 py-2"
        onClick={saveClick}> Save </button>
    </div>

    <div className='flex'>
      <div className='flex flex-col px-8'>
        
        <div className='my-4'>
          <label htmlFor="recipe" className='block text-xl  text-blue-800'>Recipe Name</label>
          <input type="text" name="recipe" id="recipe" value={recipe.recipe} onChange={handleInputChange} 
          className='border-2 p-2 rounded' placeholder='Steam Bunny Chicken Bao' req/>
        </div>
        
        <div className='my-4'>
          <label htmlFor="servings" className='block text-xl text-blue-800'>Recipe Servings</label>
          <input type="text" name="servings" id="servings" value={recipe.servings} onChange={handleInputChange} 
          className='border-2 p-2 rounded' placeholder='2'/>           
        </div>
                
        <div className='my-4'>
          <label htmlFor="preptime" className='block text-xl text-blue-800'>Preparation Time</label>
          <input type="text" name="preptime" id="preptime" value={recipe.preptime} onChange={handleInputChange} 
          placeholder='15minutes' className="border-2 p-2 rounded"/>           
        </div>

        <div className='my-4'>
          <label htmlFor="cooktime" className='block text-xl text-blue-800'>Cook Time</label>
          <input type="text" name="cooktime" id="cooktime" value={recipe.cooktime} onChange={handleInputChange}
          placeholder='1hour 10minutes' className="border-2 p-2 rounded"/>           
        </div>

      </div>
      <div>
        <div className='my-4'>
          <label htmlFor="Ingredients" className='block text-xl text-blue-800'>Ingredients</label>
          <input type="text" name="ingredients" onChange={handleInputChange} value={recipe.ingredients}
          id="ingredients" className='border-2 p-2 rounded' placeholder='for the filling'/>
        </div>
        <div className='my-8'>
          <p className='text-xl text-blue-800'>Add Note</p>
          <TextEditor handleProcedureContentChange={handleProcedureContentChange}/>
        </div>
        </div>
      </div>
    </div>
    )
}

export default Recipe