import { render, screen } from "@testing-library/react";
import Constellation from "./Constellation";

describe("Constellation", () => {
  it("adds birthday enhancement class when birthday mode is active", () => {
    const { rerender } = render(
      <Constellation
        birthdayMode={false}
        veilMode="off"
        weatherMood="sunny"
        season="spring"
        timeOfDay="night"
      />
    );

    expect(document.querySelector(".birthday-enhanced")).not.toBeInTheDocument();

    rerender(
      <Constellation
        birthdayMode
        veilMode="off"
        weatherMood="sunny"
        season="spring"
        timeOfDay="night"
      />
    );

    expect(document.querySelector(".birthday-enhanced")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Renewal arc" })).toBeInTheDocument();
  });
});
