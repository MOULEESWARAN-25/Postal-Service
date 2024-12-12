"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Trophy, Target, CheckCircle, X } from "lucide-react";
import VillageTrackingUI from "./tracker";
import CameraCaptureWithAddress from "./camera";

const PostOfficeTaskApp = () => {
  const [camera, setCamera] = useState(false);

  // Function to toggle the display of the Contact component
  const handleClick = () => {
    setCamera(true);
    console.log("Geo location marked!");
  };

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Create 50 Accounts in Village X",
      assignedBy: "Sub Post Office Head",
      points: 0,
      status: "Pending",
      villages: ["X", "A", "I", "Y"],
      progress: 0,
    },
  ]);
  const [selectedTask, setSelectedTask] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { name: "adhavan", points: 250, completedTasks: 5 },
    { name: "Kanish", points: 180, completedTasks: 3 },
    { name: "Grish", points: 200, completedTasks: 3 },
  ]);

  useEffect(() => {
    fetch("api/fetch-game")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((err) => console.log(err));
  }, []);
  const startTask = () => {
    setSelectedTask(true);
  };

  const submitTaskProgress = (geoLocation, photo) => {
    // Logic for submitting task progress
    // Would include uploading photo, recording geo location
    // Updating points and leaderboard
  };

  const handleDialogClose = () => {
    setSelectedTask(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
        <Target className="mr-2 text-blue-600" /> Post Office Task Management
      </h1>

      {/* Task List Section */}
      <div className="bg-white shadow-md rounded-lg mb-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Assigned Tasks
          </h2>
        </div>
        <div className="p-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border rounded p-3 mb-2 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 text-sm">
                  Assigned By: {task.assignedBy}
                </p>
              </div>
              <button
                onClick={startTask}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Start Task
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Section */}
      {/* Leaderboard Section */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b flex items-center">
          <Trophy className="mr-2 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-700">Leaderboard</h2>
        </div>
        <div className="p-4">
          {leaderboard.map((leader, index) => (
            <div
              key={leader._id}
              className="flex justify-between p-2 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-800">
                {index + 1}. {leader.employeeName}
              </span>
              <span className="text-green-600 font-semibold">
                {leader.points} Points
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && <VillageTrackingUI onbuutonClick={handleClick} />}
      {camera && <CameraCaptureWithAddress />}
    </div>
  );
};

export default PostOfficeTaskApp;
