import { Circle } from "better-react-spinkit";
import Image from "next/image"

const Loading = () => {
  return (
    <center style={{display: 'grid', placeItems: 'center', height: '100vh'}}>
        <div>
            <Image 
            src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" 
            alt="whatsapp icon" 
            width={200} 
            height={200} 
            style={{marginBottom: 10}}
            />
        </div>

        <Circle color="#3CBC28" size={60}/>

    </center>
  )
}

export default Loading