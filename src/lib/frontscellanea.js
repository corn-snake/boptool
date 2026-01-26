function mapObject(_m=new Map()||[]){
    const _a = Array.isArray(_m) ? new Map(_m) : _m;
    const _p = new Proxy(_a,{
        get(target,name,_receiver){
            switch(name){
                case "keys":
                    return [...target.keys()];
                case "reset":
                case "clear":
                    return target.clear;
                case "has":
                    return (th)=>target.has(th);
                case "set":
                    return target.set;
                case "del":
                case "delete":
                case "remove":
                    return target.delete;
                case "valueOf":
                    return ()=>[...target.entries()];
                case "toString":
                    return ()=>`{${[...target.keys()].map((e)=>`"${e}":"${target.get(e)}"`).join(',')}}`
                default:
                    return target.get(name);
            }
        },
        set:(target,name,value,_receiver)=>target.set(name,value)
    });
    return _p;
}

export {mapObject}