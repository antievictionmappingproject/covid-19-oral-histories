import React from "react"
import Visualizer from "../components/Visualizer";

export default (props) => {
  return(
    <>
      <Visualizer />
      <audio {...props} />
    </>
  )
}