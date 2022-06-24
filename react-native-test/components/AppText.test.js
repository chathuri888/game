import * as React from "react";
import AppText from "./AppText";
import renderer from "react-test-renderer";
it(`renders correctly`, () => {
    const tree = renderer.create(<AppText>Reset</AppText>);
    expect(tree).toMatchSnapshot();
});