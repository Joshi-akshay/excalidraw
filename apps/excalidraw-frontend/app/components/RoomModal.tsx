"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Input } from "@repo/ui/input";
import { ButtonCom } from "@repo/ui/button";
import { CopyButton } from "@repo/ui/copyButton";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "join";
}

export default function RoomModal({ isOpen, onClose, mode }: RoomModalProps) {
  const router = useRouter();
  const [showRoomCreated, setShowRoomCreated] = useState(false);
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joinUserName, setJoinUserName] = useState("");
  const [joinRoomName, setJoinRoomName] = useState("");
  
  const userNameRef = useRef<HTMLInputElement>(null);
  const roomNameRef = useRef<HTMLInputElement>(null);
  const joinRoomNameRef = useRef<HTMLInputElement>(null);
  const joinUserNameRef = useRef<HTMLInputElement>(null);
  
  async function createRoom() {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BACKEND_URL}/room`, {
              room: roomName
      }, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

      return res.data.roomId;
  }

  const handleCreateRoomSubmit = async () => {
    if (userName && roomName) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please sign in to create a room");
          return;
        }
        
        const roomId = await createRoom();
        setRoomId(roomId);
        setShowRoomCreated(true);
      } catch (error: any) {
        if (error.response?.status === 403) {
          alert("Authentication failed. Please sign in again.");
        } else {
          alert("Failed to create room. Please try again.");
        }
        console.error("Error creating room:", error);
      }
    }
  };

  const handleJoinRoomSubmit = () => {
    if (joinUserName && joinRoomName) {
      router.push(`/canvas/${joinRoomName}`);
    }
  };

  const handleJoinCreatedRoom = () => {
    router.push(`/canvas/${roomId}`);
  };

  const handleClose = () => {
    setShowRoomCreated(false);
    setUserName("");
    setRoomName("");
    setRoomId("");
    setJoinUserName("");
    setJoinRoomName("");
    onClose();
  };

  if (showRoomCreated) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Room Created Successfully!"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xl font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <Input
              placeholder="Your name"
              value={userName}
              readOnly={true}
              className="text-xl"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-xl font-medium text-gray-300 mb-2">
              Room ID
            </label>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Room ID"
                value={roomId}
                readOnly={true}
                className="flex-1 text-xl"
              />
              <CopyButton text={roomId} />
            </div>
          </div>
          
          <div className="pt-4">
            <ButtonCom
              variant="Primary"
              Size="lg"
              text="Join Room"
              onClick={handleJoinCreatedRoom}
              widthFull={true}
            />
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "create" ? "Create Room" : "Join Room"}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xl font-medium text-gray-300 mb-2">
            Your Name
          </label>
          <Input
            placeholder="Enter your name"
            value={mode === "create" ? userName : joinUserName}
            onChange={(value) => mode === "create" ? setUserName(value) : setJoinUserName(value)}
            className="text-xl"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-xl font-medium text-gray-300 mb-2">
            {mode === "create" ? "Room Name" : "Room ID"}
          </label>
          <Input
            placeholder={mode === "create" ? "Enter room name" : "Enter room ID"}
            value={mode === "create" ? roomName : joinRoomName}
            onChange={(value) => mode === "create" ? setRoomName(value) : setJoinRoomName(value)}
            className="text-xl"
          />
        </div>
        
        <div className="pt-4">
          <ButtonCom
            variant="Primary"
            Size="lg"
            text={mode === "create" ? "Create Room" : "Join Room"}
            onClick={mode === "create" ? handleCreateRoomSubmit : handleJoinRoomSubmit}
            widthFull={true}
          />
        </div>
      </div>
    </Modal>
  );
} 