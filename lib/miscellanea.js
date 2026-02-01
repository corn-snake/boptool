function custom403(bd){
    return new Response(bd,{
        status:403,
        headers: {
            "Access-Control-Allow-Origin": '*'
        }
    });
}
const small403 = () => custom403("failed to verify.");

function custom404(bd) {
    return new Response(bd,{
        status:404,
        headers: {
            "Access-Control-Allow-Origin": '*'
        }
    });
}
const small404 = ()=>custom404("wrong turn.");

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

const Router = function({dev}={dev:false}){
    this.toggleDev = ()=>dev = !dev;
    this.registeredRoutes = mapObject();
    this.method = (method="")=>{
        if(!(this.registeredRoutes.has[method]))
            this.registeredRoutes[method] = [];
        return {
            newRoute: (match="",callback=dev ? (req=new Request(),res=new Response(),next=(..._args)=>new Response())=>new Response() : (r=new Request())=>new Response())=> {
                this.registeredRoutes[method].push({match,callback: (r,s,n)=>{
                    const c = callback;
                    if (!dev)
                        return c(r);
                    return c(r,s,n);
                }});
                return this;
            }
        }
    };
    this.post = this.method("POST").newRoute;
    this.get = this.method("GET").newRoute;
    this.put = this.method("PUT").newRoute;
    this.init = ()=> dev ?
        (req=new Request(),res=new Response(),next=(..._args)=>new Response())=>{
            if (!(this.registeredRoutes.has(req.method.toUpperCase())))
                return new Response("Method not allowed.",{status: 404});
            for (const i of this.registeredRoutes[req.method])
                if (req.path.match(new RegExp(`^${i.match.startsWith("/") ? "" : "\/"}${i.match}`)).length > 0)
                    return i.callback(req,res,next);
            next();
        } :
        (r=new Request())=>{
            if (!(this.registeredRoutes.has(r.method.toUpperCase())))
                return new Response("Method not allowed.",{status: 404});
            const url = new URL(r.url);
            for (const i of this.registeredRoutes[r.method]){
                if (url.pathname.match(new RegExp(`^${i.match.startsWith("/") ? "" : "\/"}${i.match}(\/|$)`)) !== null)
                    return i.callback(r);
            }
            return new Response(`${r.method.toUpperCase()} ${url.pathname} not found.`, {status:404})
        };
    return this;
};

export { custom403, small403, custom404, small404, mapObject, Router };