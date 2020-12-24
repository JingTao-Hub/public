import * as React from 'react';
import logo from './logo.svg';
import './style.scss';
export interface IAppProps {
}
export class Logo extends React.Component<IAppProps, any> {
    public render() {
        return (
            <div>
                <img src={logo} className="App-logo" alt="logo" />
            </div>
        );
    }
}
