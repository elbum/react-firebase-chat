import React , {useRef,useState} from 'react'
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import firebase from '../../firebase'
import md5 from 'md5'
function RegisterPage() {
    const {register,watch,errors,handleSubmit} = useForm({mode:"onChange"});
    const [errorFromSubmit, seterrorFromSubmit] = useState("");
    const [Loading, setLoading] = useState(false);
    // const {register,watch,errors} = useForm();  submit 했을때만 체크.
    console.log(watch("email"))
    const password = useRef;
    password.current = watch("password");

    const onSubmit = async(data) => {
        try {
            setLoading(true);
            console.log(data)
            let createdUser = await firebase.auth()
            .createUserWithEmailAndPassword(data.email,data.password)
            console.log(createdUser)

            // 부가정보 업데이트
            await createdUser.user.updateProfile({
                displayName: data.name,
                photoURL:`http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            })

            // Firebase DB 저장
            await firebase.database().ref("users").child(createdUser.user.uid).set({
                name: createdUser.user.displayName,
                image: createdUser.user.photoURL
            })


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
                <h3>Register</h3>
            </div>
             <form onSubmit = {handleSubmit(onSubmit)}>
                 <label>Email</label>
                <input
                    name="email" type="email"
                    ref={register({ required: true, pattern : /^\S+@\S+$/i})}
                />
                {errors.email && <p>This field is required</p>}
                <label>Name</label>
                <input
                    name="name"
                    ref={register({ required: true, maxLength: 10 })}
                />
                {errors.name && errors.name.type ==="required" && <p>This name field is required</p>}
                {errors.name && errors.name.type ==="maxLength" && <p>Your input exceed maximum length</p>}
                <label>Password</label>
                <input
                    name="password" type="password"
                    ref={register({ required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type ==="required" && <p>This name field is required</p>}
                {errors.password && errors.password.type ==="minLength" && <p> Password must have at least 6 length</p>}
                <label>Password Confirm</label>
                <input
                    name="password_confirm" type="password"
                    ref={register({ 
                        required:true, 
                        validate:(value) => value ===password.current
                        // value 는 password_confirm 꺼고...

                     })}
                />
                {errors.password_confirm && errors.password_confirm.type ==="required" && <p>Password confirm field is required</p>}
                {errors.password_confirm && errors.password_confirm.type ==="validate" && <p>The password doesn't match</p>}

                {errorFromSubmit && <p> {errorFromSubmit} </p> }

                <input type="submit" disabled={Loading}/>
                <Link style={{color:'gray',textDecoration:'none'}} to="Login">이미 아이디가 있다면...</Link>

    </form>
        
        </div>
    )
}

export default RegisterPage
