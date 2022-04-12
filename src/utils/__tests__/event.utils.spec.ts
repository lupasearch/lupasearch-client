import { bindSearchTriggers, unbindSearchTriggers } from "../event.utils";

const mockElement = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const event = () => {
  return 1;
};

describe("bindSearchTriggers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not bind any events if there are no selectors", () => {
    document.querySelector = jest.fn().mockReturnValueOnce(mockElement);
    bindSearchTriggers(undefined, event);
    expect(mockElement.addEventListener).not.toHaveBeenCalled();
  });

  it("should not bind any events if elements are not found", () => {
    document.querySelector = jest.fn().mockReturnValueOnce(null);
    bindSearchTriggers(["#trigger1"], event);
    expect(mockElement.addEventListener).not.toHaveBeenCalled();
  });

  it("should bind event for every element that was found", () => {
    document.querySelector = jest
      .fn()
      .mockReturnValueOnce(mockElement)
      .mockReturnValueOnce(mockElement);
    bindSearchTriggers(["#trigger1", "#trigger2"], event);
    expect(mockElement.addEventListener).toHaveBeenCalledTimes(2);
    expect(mockElement.addEventListener).toHaveBeenCalledWith("click", event);
  });

  it("should bind event for every element that was found", () => {
    document.querySelector = jest
      .fn()
      .mockReturnValueOnce(mockElement)
      .mockReturnValueOnce(mockElement)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(mockElement);
    bindSearchTriggers(
      ["#trigger1", "#trigger2", "#trigger3", "#trigger4"],
      event
    );
    expect(mockElement.addEventListener).toHaveBeenCalledTimes(3);
    expect(mockElement.addEventListener).toHaveBeenCalledWith("click", event);
  });
});

describe("unbindSearchTriggers", () => {
  it("should unbind event for every element that was found", () => {
    document.querySelector = jest
      .fn()
      .mockReturnValueOnce(mockElement)
      .mockReturnValueOnce(mockElement)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(mockElement);
    unbindSearchTriggers(
      ["#trigger1", "#trigger2", "#trigger3", "#trigger4"],
      event
    );
    expect(mockElement.removeEventListener).toHaveBeenCalledTimes(3);
    expect(mockElement.removeEventListener).toHaveBeenCalledWith(
      "click",
      event
    );
  });
});
