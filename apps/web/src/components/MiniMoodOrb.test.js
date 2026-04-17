import { fireEvent, render, screen } from "@testing-library/react";
import MiniMoodOrb from "./MiniMoodOrb";

describe("MiniMoodOrb", () => {
  it("renders mood and state-driven aria label and interaction", () => {
    const onClick = jest.fn();
    render(
      <MiniMoodOrb
        orbColor="#7ac6ff"
        weatherMood="rain"
        season="winter"
        timeOfDay="night"
        veilMode="on"
        mode="water"
        highlighted
        onClick={onClick}
      />
    );

    const orb = screen.getByRole("button", { name: /Rainy renewal/i });
    expect(orb).toHaveClass("mini-mood-orb--winter");
    expect(orb).toHaveClass("is-highlighted");
    fireEvent.click(orb);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
