import packages from "./packages.vue";

export let convertRouter = (vuePages:any) => {
  let generator:any[] = [];
  Object.keys(vuePages).forEach(item => {
    let dir = item.split("/");
    var target = generator;
    var pid:any = 0;
    var p:string|undefined;
    while ((p = dir.shift())) {
      if (!target.find(t => t.id == p)) {
        let res = {
          id: p,
          pid: pid,
          path: pid == 0 ? "/" + p : p,
          children: [],
          component: packages,
          name: ''
        };
        if (dir.length == 0) {
          res.name = item.replace(/\//g, "-");
          res.component = vuePages[item];
        } else if (pid != 0) {
          res.name = target.find(t => t.id == pid).name + "-" + p;
        } else {
          res.name = p;
        }
        if (res.id.startsWith("_")) {
          //认为是个单页
          res.path = `:${res.id.substr(1)}`;
          res.path = pid == 0 ? "/" + res.path : res.path;
        }

        target.push(res);
      } else if (dir.length == 0) {
        target.find(t => t.id == p).component = vuePages[item];
      }

      target = target.find(t => t.id == p).children;
      pid = p;
    }
  });
  return generator;
};
