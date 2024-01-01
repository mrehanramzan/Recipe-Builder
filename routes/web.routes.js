import path from 'path'
import { ObjectId } from 'mongodb'
import verifyToken from '../middlewares/verifytoken'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const initRoutes = (app)=>{
    
    app.get('/recipes',async(req,res,next)=>{
        try{
            const db = req.app.locals.db
            const ingredientsCollection = db.collection("ingredients");
            const ingredients = await ingredientsCollection.find().toArray()
            res.status(200).json({
                success:true,
                message: "List of Ingredients",
                data: ingredients
            })
        }catch(error){
            return next(error)
        }
    })
    
    app.get('/recipe/:id',async(req,res,next)=>{
        try{
            const db = req.app.locals.db
            const ingredientsCollection = db.collection('ingredients')
            const ingredient = await ingredientsCollection.findOne({ _id : new ObjectId(req.params.id) })
            res.status(200).json({
                success:true,
                message:"Ingredient found",
                data: ingredient
            })
        }catch(error){
            return next(error)
        }
    })
    
    app.post('/recipe',async(req,res,next)=>{
        try{           
            const db = req.app.locals.db
            const ingredientsCollection = db.collection('ingredients')
            const ingredient = await ingredientsCollection.insertOne(req.body)
            res.status(201).json({
                success:true,
                message:'Ingredient save successfully',
                data : ingredient 
            })
        }catch(error){
            return next(error)
        }
    })

    app.put('/recipe/:id',async(req,res,next)=>{
        try{
            const db = req.app.locals.db
            const ingredientsCollection = db.collection('ingredients')
            const updatedIngredient = req.body;
            delete updatedIngredient._id;
            const ingredient = await ingredientsCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: updatedIngredient }
            )
            res.status(200).json({message:'ingredient updated successfully'})
        }catch(error){
            return next(error)
        }
    })

   
    app.delete('/recipe/:id',async(req,res,next)=>{
        try{
            const db = req.app.locals.db
            const ingredientsCollection = db.collection('ingredients')
            await ingredientsCollection.deleteOne({_id: new ObjectId(req.params.id)})
            res.status(200).json({message:"recipe deleted"})
        }catch(error){
            return next(error)
        }
    })    

    
    app.post('/signup',async(req,res,next)=>{
        try{
            const db = req.app.locals.db
            const userCollection = db.collection('users')
            const {email, password} = req.body
            const existingUser = await userCollection.findOne({email})
            if(existingUser){
                return res.status(409).json({ error:'User already exists' })
            }
            const hashPassword = await bcrypt.hash(password,10)
            await userCollection.insertOne({email,password:hashPassword,role:'user',access:'false'})
            res.status(201).json({
                success:true,
                message:"Sign-up successfully"
            })
            }catch(error){
                return next(error)
            }
    })


    app.post('/signin',async(req,res,next)=>{
        try{
            const { email,password } = req.body
            const db = req.app.locals.db
            const userCollection = db.collection('users')
            const user = await userCollection.findOne({email});
            const match = await bcrypt.compare(password,user.password)
            if (!user || !match) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const token = jwt.sign({ id: user._id, email: user.email, role:user.role, access:user.access }, process.env.secretKey, { expiresIn: '1m' });
            res.json({ token });
        }catch(error){
            return next(error)
        }
    });

    app.get("/users",async(req,res,next)=>{
        try{
            const db = req.app.locals.db
            const userCollection = db.collection('users')
            const users = await userCollection.find().toArray()
            res.json({ users });
        }catch(error){
            return next(error)
        }
    })

    app.get('/protected', verifyToken, (req, res) => {     
        res.status(200).json({ user: req.user });
    });

    app.get('/access/:id', async(req,res,next)=>{
        try{
            const db = req.app.locals.db
            const userCollection = db.collection('users')
            const user = await userCollection.findOne({_id:new ObjectId(req.params.id)})
            let updateAccess = user.access==='false'?'true':'false'
            const updateUser = await userCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: {access:`${updateAccess}`} }
            )
            res.status(200).json({message:`${updateAccess}`})
        }catch(error){
            return next(error)
        }
        
    })

}

export default initRoutes