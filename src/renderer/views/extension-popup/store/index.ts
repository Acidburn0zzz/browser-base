import { ipcRenderer } from 'electron';
import { observable } from 'mobx';
import * as React from 'react';

export class Store {
  @observable
  public visible = false;

  @observable
  public maxHeight = 0;

  @observable
  public url: string = null;

  public webviewRef = React.createRef<Electron.WebviewTag>();

  @observable
  public webviewWidth = 0;

  @observable
  public webviewHeight = 0;

  public constructor() {
    ipcRenderer.on('visible', (e, flag, data) => {
      if (flag) {
        const { url } = data;
        this.url = url;
      } else {
        this.visible = false;
        this.hide();
      }
    });

    ipcRenderer.on('max-height', (e, height) => {
      this.maxHeight = height;
    });
  }

  public get id() {
    return ipcRenderer.sendSync('get-webcontents-id');
  }

  public hide() {
    this.url = null;
    this.webviewHeight = 0;
    this.webviewWidth = 0;
    ipcRenderer.send(`hide-${this.id}`);
  }
}

export default new Store();