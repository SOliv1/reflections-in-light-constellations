import { fireEvent, render, screen } from "@testing-library/react";
import UnifiedDrawer from "./UnifiedDrawer";

describe("UnifiedDrawer", () => {
  it("renders tabs and calls tab change callback", () => {
    const onTabChange = jest.fn();
    render(
      <UnifiedDrawer
        isOpen
        onClose={() => {}}
        activeTab="reflections"
        onTabChange={onTabChange}
        tabs={[
          { id: "reflections", label: "Reflections", content: <div>Reflections panel</div> },
          { id: "notes", label: "Notes", content: <div>Notes panel</div> },
        ]}
      />
    );

    expect(screen.getByText("Reflections panel")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Notes" }));
    expect(onTabChange).toHaveBeenCalledWith("notes");
  });

  it("uses persisted tab when uncontrolled", () => {
    window.localStorage.setItem("unifiedDrawerActiveTab", "quote");
    render(
      <UnifiedDrawer
        isOpen
        onClose={() => {}}
        tabs={[
          { id: "reflections", label: "Reflections", content: <div>Reflections panel</div> },
          { id: "quote", label: "Quote", content: <div>Quote panel</div> },
        ]}
      />
    );

    expect(screen.getByText("Quote panel")).toBeInTheDocument();
  });
});
