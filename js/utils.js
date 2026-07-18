export function glucoseStatus(glucose){

    if(glucose < 70){

        return{
            text:"منخفض",
            color:"#ef4444"
        };

    }

    if(glucose <= 180){

        return{
            text:"طبيعي",
            color:"#22c55e"
        };

    }

    return{

        text:"مرتفع",
        color:"#f59e0b"

    };

}