import React from 'react'
import SidePanel from './SidePanel/SidePanel';
import MainPanel from './MainPanel/MainPanel';

import {useSelector} from 'react-redux';

function ChatPage() {
    // 이렇게 키를 안주면 룸정보나 유저가 제대로 표시되지 않음.
    const currentChatRoom = useSelector(state=>state.chatRoom.currentChatRoom)
    const currentUser = useSelector(state=>state.user.currentUser)
    return (
        <div style={{display:'flex'}}>
            <div style={{width:'300px'}}>
                <SidePanel 
                    key={currentUser&&currentUser.Uid}/> 
            </div>
            <div style={{width:'100%'}}>
                <MainPanel
                    key={currentChatRoom && currentChatRoom.id}    
                />
            </div>
        </div>
    )
}

export default ChatPage
