import React,{useRef} from 'react'
import {IoIosChatboxes} from 'react-icons/io';
// import Dropdown from 'react-bootstrap/Dropdown' 같은거다.
import {Dropdown} from 'react-bootstrap'
import Image from 'react-bootstrap/Image'
import {useSelector,useDispatch} from 'react-redux'
import firebase from '../../../firebase'
import mime from 'mime-types'
import {setPhotoURL} from '../../../redux/actions/user_action'

function UserPanel() {
    const user = useSelector(state=>state.user.currentUser)
    const inputOpenImageRef = useRef(); // 업로드에다가 ref 를 달고 display none 해줌.
    const dispatch = useDispatch()
    const handleLogout = () => {
        firebase.auth().signOut();
    }
    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click()
    }
    const handleUpLoadImage = async (event) => { 
        const file = event.target.files[0];
        const metadata = {contentType: mime.lookup(file.name)};

        
        console.log("file",file)

        // 스토리지에 저장
        try {
            let uploadTaskSnapshot = await firebase.storage().ref()
                                            .child(`user_image/${user.uid}`)
                                            .put(file,metadata)
            let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

            console.log(uploadTaskSnapshot)
            
            // 포토 이미지 수정
            await firebase.auth().currentUser.updateProfile({
                photoURL:  downloadURL
            });
            // 데이터베이스 유저 이미지 수정
            let dbresult = await firebase.database().ref("users")
            .child(user.uid)
            .update({image: downloadURL})

            console.log("db_result=",dbresult);
            // 리덕스 값도 수정
            dispatch(setPhotoURL(downloadURL));

            console.log("dispatch completed");
            

        } catch(error) {

        }
    }
    return (
        <div>
            <h3 style={{color: 'white'}}>
            <IoIosChatboxes/>{" "} Chat App    
            </h3>

            <div style={{ display: 'flex' , marginBottom: '1rem' }}>
            <Image src={user && user.photoURL} style={{width:'30px',height:'30x',marginTop:'3px'}} roundedCircle />
            <input type="file" accept="image/jpeg , image/png" ref={inputOpenImageRef} style={{display:"none"}} onChange={handleUpLoadImage}/>
        
            <Dropdown>
            <Dropdown.Toggle style={{background:'transparent',border:'0px'}} id="dropdown-basic">
               {user && user.displayName}  {user && user.email} 
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={handleOpenImageRef}>
                    프로필 사진 변경
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2" onClick={handleLogout}>
                    로그아웃
                </Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </div>
        </div>
    )
}

export default UserPanel
