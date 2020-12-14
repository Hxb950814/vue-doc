import Vue from "vue";

import { Button, Cell, Popup, Notify, Tab, Tabs, NavBar, Rate, Dialog, Icon, Collapse, CollapseItem,
    CouponCell, CouponList, Checkbox, Field, Uploader, List, PullRefresh, Switch,Loading  } from "vant";

Vue.component(Button.name, Button);
Vue.component(Popup.name, Popup);
Vue.component(Cell.name, Cell);

Vue.use(Tab);
Vue.use(Tabs);
Vue.use(NavBar);
Vue.use(Rate);
Vue.use(Icon);
Vue.use(Notify);
Vue.use(Dialog);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(CouponCell);
Vue.use(CouponList);
Vue.use(Checkbox);
Vue.use(Field);
Vue.use(Uploader);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Switch);
Vue.use(Loading);
