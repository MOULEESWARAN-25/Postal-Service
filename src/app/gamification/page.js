'use client'

import React, { useState } from 'react';
import { PlusCircle, Trash2, Save, FileSpreadsheet } from 'lucide-react';
const axios = require('axios');

const TaskAssignmentPage = () => {
  const [schemes, setSchemes] = useState([
    { id: 1, name: 'Senior Citizen Savings Scheme (SCSS)' },
    { id: 2, name: 'Kisan Vikas Patra (KVP)' }
  ]);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Ram Singh', branch: 'Branch A' },
    { id: 2, name: 'Priya Patel', branch: 'Branch B' }
  ]);

  const [taskForm, setTaskForm] = useState({
    scheme: '',
    employee: '',
    villages: [''],
    totalAccounts: 0,
    orderType: 'sequential',
    startDate: '',
    endDate: '',
    additionalInstructions: ''
  });

  const addVillage = () => {
    setTaskForm(prev => ({
      ...prev,
      villages: [...prev.villages, '']
    }));
  };

  const removeVillage = (index) => {
    const newVillages = [...taskForm.villages];
    newVillages.splice(index, 1);
    setTaskForm(prev => ({
      ...prev,
      villages: newVillages
    }));
  };

  const updateVillage = (index, value) => {
    const newVillages = [...taskForm.villages];
    newVillages[index] = value;
    setTaskForm(prev => ({
      ...prev,
      villages: newVillages
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const data = 
    {
      "employeeName": "adhavan",  
      "villages": ["bannri", "village2"],  
      "totalAccounts": 5,  
      "orderType": "sequential",  
      "startDate": "2024-12-12",  
      "endDate": "2024-12-12",  
      "additionalInstructions": "success"  
    }
  const submitTask = () => {
      // Validation and submission logic would go here
      console.log('Task Submitted:', taskForm);
      axios.post('/api/add-game', data)
      .then(response => {
        console.log('Data sent successfully:', response.data);
        // Handle response from server (optional)
      })
      .catch(error => {
        console.error('Error sending data:', error);
        // Handle error (optional)
      });
      // You would typically send this to a backend API
    };

  return (
    <div className="w-full text-black h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
          <FileSpreadsheet className="mr-3 text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Task Assignment</h2>
        </div>

        {/* Form Container with Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scheme Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Scheme</label>
              <select
                value={taskForm.scheme}
                onChange={(e) => setTaskForm(prev => ({
                  ...prev,
                  scheme: e.target.value
                }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              >
                <option value="">Choose Scheme</option>
                {schemes.map(scheme => (
                  <option 
                    key={scheme.id} 
                    value={scheme.id.toString()}
                  >
                    {scheme.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Assign to Employee</label>
              <select
                value={taskForm.employee}
                onChange={(e) => setTaskForm(prev => ({
                  ...prev,
                  employee: e.target.value
                }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option 
                    key={employee.id} 
                    value={employee.id.toString()}
                  >
                    {employee.name} - {employee.branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Village Order */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <label className="block text-sm font-medium text-gray-700">Village Order</label>
              <div className="space-y-3">
                {taskForm.villages.map((village, index) => (
                  <div key={index} className="flex space-x-3">
                    <input 
                      type="text"
                      placeholder={`Village ${index + 1}`}
                      value={village}
                      onChange={(e) => updateVillage(index, e.target.value)}
                      className="flex-grow px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                    />
                    {taskForm.villages.length > 1 && (
                      <button 
                        onClick={() => removeVillage(index)}
                        className="p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  onClick={addVillage}
                  className="flex items-center px-4 py-2.5 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <PlusCircle className="mr-2" /> Add Village
                </button>
              </div>
            </div>

            {/* Order Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Order Traversal Type</label>
              <select
                value={taskForm.orderType}
                onChange={(e) => setTaskForm(prev => ({
                  ...prev,
                  orderType: e.target.value
                }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              >
                <option value="sequential">Sequential</option>
                <option value="random">Random</option>
                <option value="optimized">Optimized Route</option>
              </select>
            </div>

            {/* Total Accounts */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Total Accounts to Create</label>
              <input 
                type="number"
                name="totalAccounts"
                value={taskForm.totalAccounts}
                onChange={handleInputChange}
                placeholder="Number of Accounts"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input 
                type="date"
                name="startDate"
                value={taskForm.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input 
                type="date"
                name="endDate"
                value={taskForm.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              />
            </div>

            {/* Additional Instructions */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Additional Instructions</label>
              <textarea 
                name="additionalInstructions"
                value={taskForm.additionalInstructions}
                onChange={handleInputChange}
                placeholder="Enter any specific instructions for the task"
                rows="4"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button 
              onClick={submitTask}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg"
            >
              <Save className="mr-2" size={20} /> Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignmentPage;