import React from 'react';

// 示例
const {
  RouterView,
  Route,
} = createRouter();

<RouterView defalut={NotFound}>
  <RouterView component={Layout}>
    <Route path="/aaa" component={Page} />
    <Route path="/bbb" component={Page1} />
  </RouterView>

  <RouterView path="/ccc" component={Layout1}>
    <Route path="/tags" component={Page2} />
    <Route path="/names" component={Page3} />
  </RouterView>

  <RouterView path="/kkk" to="/tags" component={Layout2}>
    <Route path="/tags" component={Page4} />
    <Route path="/names" component={Page5} />
  </RouterView>

  <Route path="/ddd" component={Page6} />
  <Route path="/eee" component={Page7} />
  <Route path={['/fff', 'jjj']} component={Page8} />
  <Route path="/hhh" from='/h' to="/hhh/detail" component={Page9} />
</RouterView>


const Router = () => {};

const RouterView = ({ children }) => {};

const Route = () => {};

const AsyncRoute = () => {};

const Link = () => {};
