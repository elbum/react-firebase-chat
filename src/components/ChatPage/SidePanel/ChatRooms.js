import React, { Component } from 'react'
import { FaRegSmileWink, FaSmile, FaSmileWink } from 'react-icons/fa'
import { FaPlus } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import firebase from '../../../firebase';
import {connect} from 'react-redux';
import Badge from 'react-bootstrap/Badge';

// Classcomponent 이므로 hook 을 못씀. 유저정보 redux 에서 가져와야함.
import {setCurrentChatRoom, setPrivateChatRoom} from '../../../redux/actions/chatRoom_action'

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
        messagesRef: firebase.database().ref("messages"),
        chatRooms:[],
        firstLoad:true, // 처음에만 1번방 셋팅하려고..
        activeChatRoomId:"",
        notifications:[]

    }
    // functional -> class   transition
    // const [show, setShow] = useState(false);   

    componentDidMount() {
        this.AddChatRoomsListeners(); // 실시간으로 리스닝 가능
    }

    //destroy 할떄
    componentWillUnmount() {
        this.state.chatRoomsRef.off();

        this.state.chatRooms.forEach(chatRoom => {
            this.state.messagesRef.child(chatRoom.id).off();
        })
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
            this.addNotificationListener(DataSnapshot.key);

        })
    }
    addNotificationListener = (chatRoomId) => {
        console.log("addNotificationListener!!",chatRoomId)
        this.state.messagesRef.child(chatRoomId).on("value",DataSnapshot=>{
            console.log("this.props.chatRoom",this.props.chatRoom)
            if(this.props.chatRoom) {
                this.handleNotification(
                    chatRoomId,
                    this.props.chatRoom.id,
                    this.state.notifications,
                    DataSnapshot
                    

                )
            }
        })
    }
    handleNotification = (chatRoomId, currentChatRoomId,notifications,DataSnapshot)=>{
        console.log("handleNotification")
        let lastTotal = 0;
        // 이미 notifications state 안에 알림 정보가 들어있는 채팅방과 그렇지 않은 채팅방을 나눠주기
        let index = notifications.findIndex(notification => 
            notification.id === chatRoomId)
        
        console.log("noti = ",notifications)
        //notification state 안에 해당 채팅방의 알림 정보가 없을 때
        if(index===-1){
            notifications.push({
                id:chatRoomId,
                total:DataSnapshot.numChildren(),
                lastKnownTotal: DataSnapshot.numChildren(),
                count:0
            })
        } else { // 이미 알림 정보가 있을 때
            // 상대방이 채팅 보내는 그 방에 있지 않을 때,
            if(chatRoomId !== currentChatRoomId) {
                // 현재까지 유저가 확인한 총 메시지 갯수
                lastTotal = notifications[index].lastKnownTotal;

                // count : 알림으로 보여줄 숫자.
                // 현재 총 메시지 갯수 - 이전에 확인한 총 메시지 갯수 > 0
                // 현재 총 메시지 10개 이전에 확인한거 8 개면.   알림 2개
                if(DataSnapshot.numChildren() - lastTotal > 0 ) {
                    notifications[index].count = DataSnapshot.numChildren() - lastTotal;
                }
            }
            // total property 에 현재 전체[ 메시지 개수를 넣어주기]
            notifications[index].total = DataSnapshot.numChildren();


        }
        // 목표는 방 하나하나에 맞는 notification state를 넣어주기.
        this.setState({notifications});
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
        this.props.dispatch(setCurrentChatRoom(room));
        this.props.dispatch(setPrivateChatRoom(false));
        this.setState({activeChatRoomId:room.id});
        // 이동한 방에 노티가 있으면 삭제.
        this.clearNotifications();
    }
    clearNotifications = () => {
        let index = this.state.notifications.findIndex(
            notification => notification.id === this.props.chatRoom.id
        )
        if (index !== -1){
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].lastKnownTotal = this.state.notifications[index].total;
            updatedNotifications[index].count = 0;
            this.setState({notifications:updatedNotifications});
        } 
    }
    getNotificationCount = (room) =>  {
        // 해당 채팅방에 count 수를 구하는 중입니다.
        let count = 0;
        this.state.notifications.forEach(notification => {
            if(notification.id === room.id) {
                count = notification.count;
            }
        })
        if(count>0) return count


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
                <Badge style={{float:'right',marginTop:'4px'}} variant="danger">
                    {this.getNotificationCount(room)}
                </Badge>
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
        user:state.user.currentUser,
        chatRoom:state.chatRoom.currentChatRoom
    }
}
export default connect(mapStateToProps)(ChatRooms)
