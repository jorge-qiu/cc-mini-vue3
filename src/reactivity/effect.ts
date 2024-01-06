class ReactiveEffect {
    private _fn:any;

    constructor(fn) {
        this._fn = fn;
    }
    run() {
        activeEffrct = this;
        return this._fn();
    }
}

const targetMap = new Map();
export function track (target,key) {
    //! target -> key -> dep

    let depsMap = targetMap.get(target);
    if(!depsMap) {
        depsMap = new Map();
        targetMap.set(target,depsMap);
    }

    // todo 由于收集的依赖不能重复，所以使用Set数据结构来做存储
    let dep = depsMap.get(key);
    if(!dep) {
        dep = new Set();
        depsMap.set(key,dep);
    }
    dep.add(activeEffrct)

}

export function trigger(target,key) {
   // ! 取出依赖，调用依赖
   let depsMap = targetMap.get(target);
   let dep = depsMap.get(key);

   for(const effect of dep) {
    effect.run(); 
   }
}


let activeEffrct;

export function effect(fn) {
    //fn
    const _effect = new ReactiveEffect(fn);

    _effect.run();

    return _effect.run.bind(_effect);
}