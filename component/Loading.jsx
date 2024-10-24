import { Circle } from "better-react-spinkit";
import Image from "next/image"

const Loading = () => {
  return (
    <center style={{display: 'grid', placeItems: 'center', height: '100vh'}}>
        <div>
            <Image 
            src="/logo.png" 
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