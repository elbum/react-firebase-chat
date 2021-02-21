import React , {useState} from 'react'
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import firebase from '../../firebase'

function LoginPage() {
    const {register,errors,handleSubmit} = useForm({mode:"onChange"});
    const [errorFromSubmit, seterrorFromSubmit] = useState("");
    const [Loading, setLoading] = useState(false);
    // const {register,watch,errors} = useForm();  submit 했을때만 체크.

    const onSubmit = async(data) => {
        try {
            setLoading(true);
            await firebase.auth().signInWithEmailAndPassword(data.email,data.password);


            setLoading(false);
        } catch(error) {
            // error 를 렌더링 하자
            seterrorFromSubmit(error.message);
            setLoading(false);
            setTimeout(()=>{
                seterrorFromSubmit("")
            },5000)

        }
        
    }
    return (
        <div class="auth-wrapper">
            <div style={{textAlign:'center'}}>
                <h3>Login</h3>
            </div>
             <form onSubmit = {handleSubmit(onSubmit)}>
                 <label>Email</label>
                <input
                    name="email" type="email"
                    ref={register({ required: true, pattern : /^\S+@\S+$/i})}
                />
                {errors.email && <p>This field is required</p>}
                <label>Password</label>
                <input
                    name="password" type="password"
                    ref={register({ required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type ==="required" && <p>This name field is required</p>}
                {errors.password && errors.password.type ==="minLength" && <p> Password must have at least 6 length</p>}

                {errorFromSubmit && <p> {errorFromSubmit} </p> }

                <input type="submit" disabled={Loading}/>
                <Link style={{color:'gray',textDecoration:'none'}} to="register">아직 아이디가 없다면...</Link>

    </form>
        
        </div>
    )
}

export default LoginPage
