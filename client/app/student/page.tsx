'use client'
import { Box } from '@mui/material'
import { getClassData } from '@/app/student/actions'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

interface  ClassData {
  class_id: number;
  description: string | null;
  name: string | null;
  section_number: string | null;
}

const Classes = () => {
  const [classes, setClasses] = useState<ClassData[]>()
  const router = useRouter()

  useEffect(() => {
    const fetchClasses = async () => {
      const data = await getClassData()
      setClasses(data)
    }
    fetchClasses()
  }, [])
  


  return (
    // <ListItemButton component="a" href="#simple-list">
    //   <ListItemText primary="Spam" />
    // </ListItemButton>

    // <Box className="min-h-screen bg-gray-50">
    //   {/* Main content */}
    //   <Box className="p-4">
    //     {/* Scrollable container for class boxes */}
    //     <div className="overflow-x-auto">
    //       <div className="flex space-x-4 pb-4 min-w-full">
    //         {classes?.map((classItem, index) => (
    //           <div 
    //             key={index} 
    //             className="flex-none w-72 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    //           >
    //             {/* Class header info */}
    //             <div className="p-4 border-b border-gray-100">
    //               <h3 className="text-xl font-bold text-gray-900 mb-2">
    //                 {classItem.name || 'Unnamed Class'}
    //               </h3>
    //               <p className="text-lg font-semibold text-gray-700">
    //                 Section: {classItem.section_number || 'N/A'}
    //               </p>
    //             </div>
                
    //             {/* Description box */}
    //             <div className="p-4 bg-gray-50">
    //               <p className="italic text-gray-600">
    //                 {classItem.description || 'No description available'}
    //               </p>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </Box>
    // </Box>
  )
}

export default Classes