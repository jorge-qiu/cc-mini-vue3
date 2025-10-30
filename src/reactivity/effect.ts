import { extend } from "../shared";

class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      clearupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function clearupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

const targetMap = new Map();
export function track(target, key) {
  //! target -> key -> dep

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // todo 由于收集的依赖不能重复，所以使用Set数据结构来做存储
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);

  // activeEffect 可能是个undefined ，因为这里需要的是在活跃状态下才会有，如果是单纯的reactive的获取的话，是不存在activeEffect
  if (!activeEffect) return;
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  // ! 取出依赖，调用依赖
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler(effect.run.bind(effect));
    } else {
      effect.run();
    }
  }
}

let activeEffect;

export function effect(fn, options: any = {}) {
  //fn
  const _effect = new ReactiveEffect(fn, options.scheduler);

  // options
  extend(_effect, options);

  // extend

  // _effect.onStop = options.onStop;

  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
