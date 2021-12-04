import React from "react";
import FormFields from "../FormFields";

class Fildsets extends React.Component {

    constructor(props) {
        super(props);

        /*
        props.editItem[this.props.input.name]
        [
            {key1: val, key2: val},
            {key1: val, key2: val},
            ...
        ]
        */

        var fields = typeof this.props.editItem[this.props.input.name] === 'object' && this.props.editItem[this.props.input.name] != null
            ? this.props.editItem[this.props.input.name] : [];

        fields = fields.map((item, i) => {
            item.id = Math.random();
            return item;
        });

        if (fields.length == 0) {
            fields.push(this.getEmptyFields());
        }

        this.state = {
            fields: fields
        };
    }

    getEmptyFields() {
        var data = {};

        this.props.input.fields.forEach(element => {
            data[this.getName(element.name)] = '';
        });

        data.id = Math.random();

        return data;
    }

    getName(str) {
        var str = str.split('['),
            str = str[1].split(']');

        return str[0];
    }

    fieldsAdd = () => {
        this.setState((prevState) => {
            prevState.fields.push(this.getEmptyFields());

            return {
                fields: prevState.fields
            };
        });
    }

    fieldsTrash = (id) => {
        this.setState((prevState) => {
            var feilds = prevState.fields.filter((item) => id !== item.id);

            if (feilds.length == 0) {
                feilds.push(this.getEmptyFields());
            }

            return {
                fields: feilds
            };
        });
    }

    getEditItem = (index) => {
        var editItem = {};

        this.props.input.fields.forEach((element, i) => {
            var name = this.getName(element.name);

            if (typeof this.state.fields[index][name] !== 'undefined' && this.state.fields[index][name] != null) {
                editItem[element.name] = this.state.fields[index][name];
            }
        });

        return editItem;
    }

    render() {
        var fieldsCount = this.state.fields.length;

        return this.state.fields.map((item, index) => {
            var editItem = this.getEditItem(index);

            return (
                <fieldset key={item.id} className={fieldsCount - 1 == index ? 'form-group' : 'form-group mb-3'}>
                    <legend>
                        {this.props.input.placeholder + ' ' + (index + 1)}
                        <div onClick={() => this.fieldsAdd()} className="multiple_block_icon"><svg viewBox="0 0 16 16"><path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path></svg></div>
                        <div onClick={() => this.fieldsTrash(item.id)} className="multiple_block_icon"><svg className="delete" viewBox="0 0 14 14"><path d="M13.5000308,3.23952 C13.5000308,4.55848168 11.9230308,12.0493 11.9230308,12.0782 C11.9230308,12.6571 9.73825083,14 7.04165083,14 C4.34504083,14 2.16025083,12.6571 2.16025083,12.0782 C2.16025083,12.0541 0.5,4.55799105 0.5,3.23952 C0.5,1.91780104 3.02713083,0 7.03525083,0 C11.0433308,0 13.5000308,1.9178004 13.5000308,3.23952 Z M7,2 C3.625,2 2.5,3.25 2.5,4 C2.5,4.75 3.625,6 7,6 C10.375,6 11.5,4.75 11.5,4 C11.5,3.25 10.375,2 7,2 Z"></path></svg></div>
                    </legend>
                    <FormFields
                        inputs={this.props.input.fields}
                        editItem={editItem}
                    />
                </fieldset>
            );
        });
    }

}

export default Fildsets;