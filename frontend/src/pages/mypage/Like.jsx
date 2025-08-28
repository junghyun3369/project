import { useState, useEffect, useRef } from 'react'
import { useRoot } from '@hooks/RootProvider.jsx'
import { useNavigate } from "react-router-dom";
import { FastAPI } from '@utils/Network.js'

const Like = () => {
  const { isStorage, getFile, getUserNo } = useRoot()
  const navigate = useNavigate();
  const [list, setList] = useState([])
  useEffect(() => {
    if(isStorage("access")) { 
      const arr = {fileNo: null}
      setList([...list, arr])
    } else {
      navigate("/");
    }
  }, [])
  return (
    <div className="grid">
      {list?.map((row, index) => {
        return (
          <div className="grid-card" key={index}>
            <img src={getFile(row.fileNo)} alt="" />
          </div>
        )
      })}
    </div>
  )
}

export default Like