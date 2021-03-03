import React,{useState,useRef} from 'react'
import Form from 'react-bootstrap/Form'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../../../firebase';
import {useSelector} from 'react-redux';
import mime from 'mime-types';
function MessageForm() {
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const inputOpenImageRef = useRef();
    const messagesRef = firebase.database().ref("messages");
    const storageRef = firebase.storage().ref();
    const [percentage, setPercentage] = useState(0)
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
    const handleChange = (event) => {
        setContent(event.target.value)
    }
    const createMessage = (fileUrl=null) => {
        const message = {
            timestamp : firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        }
        if(fileUrl !== null) {
            message["image"] = fileUrl;
        } else {
            message["content"] = content;
        }
        return message
    }
    const handleSubmit=async ()=>{
        if(!content){
            setErrors(prev=>prev.concat("Type contents first"))
            return
        }
        setLoading(true);

        // saving on firebase
        try {
            await messagesRef.child(chatRoom.id).push().set(createMessage())
            setLoading(false);
            setContent("");
            setErrors([]);
        } catch(err) {
            setErrors(prev => prev.concat(errors.message))
            setLoading(false)
            setTimeout(()=>{
                setErrors([]);
            },5000)
        }
    }
    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    }
    const getPath = () => {
        if(isPrivateChatRoom){
            console.log("private datastorage")
            return `/message/private/${chatRoom.id}`
        } else {
            return `/message/public`
        }
    }
    const handleUploadImage= (event) => {
        const file = event.target.files[0];
        console.log(file);
        // const filePath = `/message/public/${file.name}`;
        const filePath = `${getPath()}/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name)};
        setLoading(true);

        try {
            // 파일을 저장
            // await 하면 다 끝나야 progress알수있으니 하면안됨.
            // let uploadTask = await storageRef.child(filePath).put(file,metadata);

            let uploadTask = storageRef.child(filePath).put(file,metadata);

            // 파일 저장 progress 구하기
            uploadTask.on("stage_changed",
                UploadTaskSnapshot => {
                const percentage = Math.round(
                    (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
                )
                setPercentage(percentage);
                },
                err => {
                    console.log(err);
                    setLoading(false);
                },
                () => {
                    // 저장이 된 후에 파일 메시지 전송
                    // 저장된 후 파일 받을수 있는 url 가져오기
                    uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadUrl => { 
                        console.log(downloadUrl)
                        messagesRef.child(chatRoom.id).push().set(createMessage(downloadUrl))
                        setLoading(false);
                    })
                }   )
        } catch(error) {

        }

    }
    return (
        <div>
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control 
                value={content}
                onChange={handleChange}
                as="textarea" rows={3} />
            </Form.Group>
            </Form>
            {
                !(percentage ===0 || percentage === 100) &&
                <ProgressBar variant="warning" label={`${percentage}`} now={percentage} />
            }
            <div>
                {/* {errors.map(errMsg=><p style={{color:" red"}} key={errMsg}>{errMsg}</p>)} */}
                {errors.map(errorMsg => <p style={{ color: 'red' }} key={errorMsg}>{errorMsg}</p>)}
            </div>
            <Row>
                <Col>
                    <button 
                    onClick={handleSubmit}
                    className="message-form-button" style={{width:'100%'}}
                    disabled={loading ? true : false}>
                        S E N D
                    </button>
                </Col>
                <Col>
                    <button 
                        onClick={handleOpenImageRef}
                        className="message-form-button" style={{width:'100%'}}
                        disabled={loading ? true : false}>
                        U P L O A D
                    </button>
                </Col>
            </Row>
            <input 
                accept="image/jpeg,image/png"
                ref={inputOpenImageRef} style={{display:'none'}} type="file"
                    onChange={handleUploadImage} />
        </div>
    )
}

export default MessageForm
