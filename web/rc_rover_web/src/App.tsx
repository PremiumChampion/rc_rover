import React from 'react';
import rover from "./rover.svg";
import './App.css';
import { socket } from './Socketing';
import { Joystick } from 'react-joystick-component';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';
export interface AppProps {
}

interface AppState {
  connection: boolean;
  xAxis: number;
  yAxis: number;
}
/**
 * Component App
 *
 * @export
 * @class Main
 * @extends {React.Component<AppProps, AppState>}
 */
export class App extends React.Component<AppProps, AppState> {
  private interval: any;
  private power: number = 0;
  private angle: number = 0;
  constructor(props: AppProps) {
    super(props);
    this.state = { connection: false, xAxis: 0, yAxis: 0 };
  }

  public render(): JSX.Element {
    return (
      <div className="App">
        <div className="App-header">
          <img src={rover} className="rover-logo" alt="rover" style={{ height: " 80%", width: "80%", objectFit: "contain" }} />
          <p>
            {this.state.connection && "Connected"}
            {!this.state.connection && "Not connected"}
          </p>
          <Joystick disabled={!this.state.connection} size={200} sticky={false} baseColor="#e7413e" stickColor="#1d1d1b" move={this.handleJoystick.bind(this)} stop={this.handleJoystick.bind(this)} />
        </div>
      </div>)
      ;
  }

  public handleJoystick(event: IJoystickUpdateEvent): void {

    let x = event.x == null ? 0 : event.x;
    let y = event.y == null ? 0 : event.y;
    this.setState({ xAxis: x, yAxis: y });
  }

  public componentDidMount() {
    socket.on("connect", this.onSocketConnect.bind(this));
    socket.on("disconnect", this.onSocketDisconnect.bind(this));

    this.mountInterval();
  }

  public mountInterval() {
    if (!this.interval) {
      this.interval = setInterval(() => {

        const { xAxis, yAxis } = this.state;

        let x = xAxis;
        let y = yAxis;

        if (y == 0) {
          y = 0.000001;
        }
        if (x == 0) {
          x = 0.000001;
        }

        let power = Math.min(Math.sqrt(Math.pow(xAxis, 2) + Math.pow(yAxis, 2)) * 100, 100);
        power = Math.floor(power);
        let angle = Math.atan2(y, x) * 180 / Math.PI;

        if (angle < 0) {
          angle = 360 + angle;
        }

        angle = Math.floor(angle);

        if (this.angle == angle && this.power == this.power) {
          return;
        }

        this.angle = angle;
        this.power = power;

        if (power < 10)
          power = 0;

        if (this.state.connection) {
          socket.emit("rover", angle, power);
        }
        console.log({ angle, power });

      }, 64);
      this.interval = null;
    }
  }

  public unmountInterval() {
    if (this.interval)
      clearInterval(this.interval);
  }

  public onSocketConnect() {
    this.setState({ connection: true });
  }

  public onSocketDisconnect() {
    this.setState({ connection: false });
  }

  public componentWillUnmount(): void {
    this.unmountInterval();
  }
}