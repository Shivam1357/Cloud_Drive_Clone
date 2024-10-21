import { Skeleton } from "@mui/material";

export default function SkeletonDisplay(){

    return(
        <div style={{
            display:'flex',
            flexDirection:'column',
            paddingTop:3,
            paddingBottom:2
        }}>
            <div 
                style={{
                    display:'flex' ,
                    flexDirection:'row',
                    justifyContent:'space-evenly',
                    marginTop:2,
                    marginBottom:3

                }}>
                <Skeleton variant="rounded" width={160} height={50} />
                <Skeleton variant="rounded" width={160} height={50} />
            </div>
            <div 
                style={{
                    display:'flex' ,
                    flexDirection:'row',
                    justifyContent:"space-evenly",
                    marginTop:2,
                    marginBottom:3
                }}>
                <Skeleton variant="rounded" width={160} height={50} />
                <Skeleton variant="rounded" width={160} height={50} />
            </div>
        </div>
    )
}

