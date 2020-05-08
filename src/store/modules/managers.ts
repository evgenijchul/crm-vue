import { Manager, Entity } from "@/models";
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
// import { login } from '@/logics/api';
import { getData, getToken } from "@/logics/utils";

export interface IManagersState {

  token: string;
  status: string;
  stat: Entity[];
  manager: Manager;
  managerAll: Manager[];
  diskFreeSpace: string[];
}

@Module({ dynamic: true, namespaced: true, store, name: 'managers' })
export default class ManagersModule extends VuexModule implements IManagersState {

  token = getToken();
  status = '';
  stat = [];
  manager: Manager = {} as Manager;
  managerAll: Manager[] = [];
  diskFreeSpace: string[] = []

  @Mutation
  private authRequest() {
    this.status = 'loading';
  }
  @Mutation
  private authSuccess(_token: string) {
    this.status = 'success'
    this.token = _token
  }
  @Mutation
  private authError() {
    this.status = 'error';
  }
  @Mutation
  private logout() {
    this.status = ''
    this.token = ''
  }
  @Mutation
  private setDiskFreeSpace(_diskFreeSpace: string[]) {
    this.diskFreeSpace = _diskFreeSpace;
  }

  @Action
  getDiskFreeSpace() {

    getData('/tech/disk_free_space').then((res) => {

      if (res.data) {
        this.setDiskFreeSpace(res.data);
      }

    });



    // this.setToken(token);
    // this.setUser(user);
  }



  // };updateUser
  // const actions = {

}

export const managersModule = getModule(ManagersModule);