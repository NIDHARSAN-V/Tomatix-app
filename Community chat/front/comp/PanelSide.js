import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import axios from 'axios';
import { addNotification, resetNotification } from '../features/userSlice';

function PanelSide() {
  const { socket, currentRoom, setCurrentRoom, members, setMembers, privateMemberMsg, setPrivateMsg, rooms, setRooms } = useContext(AppContext);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    socket.off('new-user').on('new-user', (payload) => {
      setMembers(payload);
      console.log(payload);
    });

    return () => {
      socket.off('new-user');
    };
  }, [socket, setMembers]);

  useEffect(() => {
    if (user) {
      setCurrentRoom('general');
      getRooms();
      socket.emit('join-room', 'general');
      socket.emit('new-user');
    }
  }, [user, socket, setCurrentRoom]);

  useEffect(() => {
    socket.off('notifications').on('notifications', (room) => {
      dispatch(addNotification(room));
    });
  }, [socket, dispatch]);

  const getRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5001/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  if (!user) {
    return null;
  }

  function joinRoom(room, isPublic = true) {
    if (!user) {
      return alert("Please Login");
    }
    socket.emit("join-room", room);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMsg(null);
    }

    dispatch(resetNotification(room));
  }

  function orderIds(id1, id2) {
    return id1 > id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
  }

  function handlePrivateMemberMsg(member) {
    setPrivateMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

  useEffect(() => {
    const animateGlow = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animationValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(animationValue, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateGlow();
  }, [animationValue]);

  const renderRoomItem = ({ item: room }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        room === currentRoom && styles.activeListItem
      ]}
      onPress={() => joinRoom(room)}
    >
      <Text style={styles.roomName}>{room}</Text>
      {currentRoom !== room && user.newMessages[room] > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{user.newMessages[room]}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMemberItem = ({ item: member }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        privateMemberMsg?._id === member?._id && styles.activeListItem
      ]}
      onPress={() => handlePrivateMemberMsg(member)}
      disabled={member._id === user._id}
    >
      <View style={styles.memberRow}>
        <Image
          source={{ uri: member.picture }}
          style={styles.memberImage}
        />
        <Text style={styles.memberName}>
          {member.name} {member._id === user._id && "(You)"} {member.status === "offline" && "(Offline)"}
        </Text>
        <Animated.View
          style={[
            styles.memberStatus,
            {
              opacity: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
              transform: [
                {
                  scale: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.badgeText}>
            {user.newMessages[orderIds(member._id, user._id)]}
          </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Rooms</Text>
      <FlatList
        data={rooms}
        renderItem={renderRoomItem}
        keyExtractor={(room, idx) => `${room}-${idx}`}
      />
      <Text style={styles.heading}>Members</Text>
      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={(member) => member._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  listItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeListItem: {
    backgroundColor: '#d3d3d3',
  },
  roomName: {
    fontSize: 16,
  },
  badgeContainer: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  memberName: {
    flex: 1,
    fontSize: 16,
  },
  memberStatus: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PanelSide;
