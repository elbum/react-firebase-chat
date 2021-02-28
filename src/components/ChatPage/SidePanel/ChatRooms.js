import React, { Component } from 'react'
import { FaRegSmileWink, FaSmile, FaSmileWink } from 'react-icons/fa'
import { FaPlus } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import firebase from '../../../firebase';
import {connect} from 'react-redux';
// Classcomponent 이므로 hook 을 못씀. 유저정보 redux 에서 가져와야함.
import {setCurrentChatRoom} from '../../../redux/actions/chatRoom_action'

// redux hoox 쓸수있었다면 이렇게..
// import {useSelector} from 'react-redux';
// function MessageForm() {
    // const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
export class ChatRooms extends Component {
    state = {
        show: false,
        name: "",
        description:"",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        chatRooms:[],
        firstLoad:true, // 처음에만 1번방 셋팅하려고..
        activeChatRoomId:""

    }
    // functional -> class   transition
    // const [show, setShow] = useState(false);   

    componentDidMount() {
        this.AddChatRoomsListeners(); // 실시간으로 리스닝 가능
    }

    //destroy 할떄
    componentWillUnmount() {
        this.state.chatRoomsRef.off();
    }
    setFirstChatRoom = () => {
        const firstChatRoom = this.state.chatRooms[0]
        if(this.state.firstLoad && this.state.chatRooms.length>0) {
            this.props.dispatch(setCurrentChatRoom(firstChatRoom))
            this.setState({activeChatRoomId:firstChatRoom.id})
        }
        this.setState({firstLoad:false})
    }
    AddChatRoomsListeners = () => {
        let ChatRoomsArray=[];

        this.state.chatRoomsRef.on("child_added",DataSnapshot => {
            ChatRoomsArray.push(DataSnapshot.val())
            console.log(ChatRoomsArray)
            // listen 하고 첫번째 챗룸을 디폴트값으로 선정
            this.setState({chatRooms:ChatRoomsArray},()=>this.setFirstChatRoom());
        })
    }
    handleClose = () => this.setState({show: false});
    // const handleClose = () => setShow(false);

    handleShow = () => this.setState({show:true});
    // const handleShow = () => setShow(true);
    
    handleSubmit = (e) => {
        e.preventDefault();
        const {name,description } = this.state;
        console.log(name,description);
        if(this.isFormValid(name,description)) {
            this.addChatRoom();
        }
    }
    addChatRoom = async () => {
        const key = this.state.chatRoomsRef.push().key;

        const {name,description} = this.state;
        
        const {user} = this.props;   // 아래꺼 desctructure
        // const user = this.props.user;   

        const newChatRoom = {
            id: key,
            name: name,
            description: description,
            createdBy: {
                name:user.displayName,
                image:user.photoURL
            }
        };

        try {
            await this.state.chatRoomsRef.child(key).update(newChatRoom)
            this.setState({
                name:"",
                description:"",
                show:false  // modal close
            })
        } catch (err) {
            alert(err)

        }
    }

    isFormValid = (name,description) => {
        return name && description;
    }

    changeChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room))
        this.setState({activeChatRoomId:room.id})
    }
    renderChatRooms = chatRooms => {
        console.log("renderChatRooms",chatRooms);
        return (chatRooms.length > 0 &&
        chatRooms.map(room => (
            <li key={room.id}
                style={{backgroundColor:room.id===this.state.activeChatRoomId && '#FFFFFF45'}}
                onClick={()=>this.changeChatRoom(room)}
            >
                {room.name}
            </li>
        )))
    }


    render() {
        return (
            <div>
                <div style={{
                    position: 'relative',width:'100%',
                    display:'flex',alignItems:'center'
                }}>
                    <FaSmileWink style={{marginRight:3}}/>
                    CHAT ROOMS {" "} ({this.state.chatRooms.length})

                    <FaPlus 
                    onClick={this.handleShow}
                    style={{
                        position: 'absolute',
                        right:0, cursor:'pointer'
                    }} />

                </div>

                <ul style={{listStyleType:'none',padding:0}}>
                    {/* {this.state.chatRooms.length} */}
                    {this.renderChatRooms(this.state.chatRooms)}

                </ul>

                {/* ADD Chatroom */}


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Create a chat room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>


                        <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>방 이름</Form.Label>
                            <Form.Control 
                            onChange={(e)=> this.setState({name:e.target.value})}
                            type="text" placeholder="Enter a chat room name" />
                            <Form.Text className="text-muted">
                            채팅방 이름이에요~
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>방 설명 </Form.Label>
                            <Form.Control 
                            onChange={(e)=> this.setState({description:e.target.value})}
                            type="text" placeholder="Enter a chat room description" />
                        </Form.Group>
                       
                        </Form>
                        


                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        Create Room
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user:state.user.currentUser
    }
}
export default connect(mapStateToProps)(ChatRooms)
