import * as React from "react";
import Button from "./Button";
import renderer from "react-test-renderer";


describe('Button', () => {
    it('renders correctly', () => {
        const gotoNext = jest.fn();
        const tree = renderer.create(<Button text="OK" onPress={gotoNext} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
