import * as React from 'react';
import { AgGrid } from 'components/container';

export interface IAppProps {
}

export default class App extends React.Component<IAppProps, any> {
    public render() {
        return (
            <div>
                <AgGrid
                    style={{ height: 700 }}
                    columnDefs={[{
                        headerName: "Make", field: "make"
                    }, {
                        headerName: "Model", field: "model"
                    }, {
                        headerName: "Price", field: "price"
                    }]}
                    rowData={
                        [
                            {
                                make: "Toyota", model: "Celica", price: 35000
                            }, {
                                make: "Ford", model: "Mondeo", price: 32000
                            }, {
                                make: "Porsche", model: "Boxter", price: 72000
                            }, {
                                make: "Toyota", model: "Celica", price: 35000
                            }, {
                                make: "Ford", model: "Mondeo", price: 32000
                            }, {
                                make: "Porsche", model: "Boxter", price: 72000
                            }
                        ]
                    }
                />
            </div>
        );
    }
}
